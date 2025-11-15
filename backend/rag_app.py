import os
import sqlite3
from typing_extensions import List, TypedDict, Annotated, Literal
from transformers import BertTokenizer, BertModel
from langchain.chat_models import init_chat_model
from langchain.embeddings import HuggingFaceEmbeddings  # Updated import
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.prompts import PromptTemplate
from langgraph.graph import START, StateGraph
from langchain import hub

# 1. API Key & Model Init
os.environ['GROQ_API_KEY'] = "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"  # Replace with your Groq API Key
llm = init_chat_model("llama3-8b-8192", model_provider="groq")

# 2. Embeddings Setup
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# 3. Load Data from SQLite
conn = sqlite3.connect("db.sqlite3")  # Path to your SQLite database
cursor = conn.cursor()

cursor.execute("""
SELECT 
    q.title as query_title, 
    q.description as query_description,
    t.title as thread_title
FROM app_query q
LEFT JOIN app_thread t ON q.id = t.query_id
""")

rows = cursor.fetchall()
conn.close()

# 4. Convert to LangChain Documents
documents = []
for query_title, query_desc, thread_title in rows:
    content = f"Query: {query_title}\nDescription: {query_desc}\nThread: {thread_title}"
    metadata = {"query_title": query_title, "thread_title": thread_title or "Unknown"}
    documents.append(Document(page_content=content, metadata=metadata))

# 5. Split Documents
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
all_splits = splitter.split_documents(documents)

# 6. Add to Vector Store
vector_store = InMemoryVectorStore(embeddings)
_ = vector_store.add_documents(all_splits)

# 7. RAG Setup with LangGraph
class Search(TypedDict):
    query: Annotated[str, ..., "Search query to run."]
    section: Annotated[Literal["beginning", "middle", "end"], ..., "Section to query."]

class State(TypedDict):
    question: str
    query: Search
    context: List[Document]
    answer: str

# Use a simplified RAG prompt
template = """Use the following pieces of context to answer the question at the end.
If you don't know the answer, say you don't know and suggest the user create a query/thread.
Use three sentences maximum. Always say \"Thanks for asking!\" at the end.

{context}

Question: {question}

Helpful Answer:"""
custom_rag_prompt = PromptTemplate.from_template(template)

# Pull structure prompt
def analyze_query(state: State):
    structured_llm = llm.with_structured_output(Search)
    query = structured_llm.invoke(state["question"])
    return {"query": query}

def retrieve(state: State):
    query = state["query"]
    retrieved_docs = vector_store.similarity_search(
        query["query"],
        filter=lambda doc: doc.metadata.get("section") == query["section"],
    )
    return {"context": retrieved_docs}

def generate(state: State):
    if not state["context"]:
        return {"answer": "Sorry, I couldn't find a matching query. Please create a new query and thread. Thanks for asking!"}

    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = custom_rag_prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}

# Build LangGraph
rag_graph = StateGraph(State)
rag_graph.add_node("analyze_query", analyze_query)
rag_graph.add_node("retrieve", retrieve)
rag_graph.add_node("generate", generate)

rag_graph.set_entry_point("analyze_query")
rag_graph.add_edge("analyze_query", "retrieve")
rag_graph.add_edge("retrieve", "generate")

app = rag_graph.compile()

# Example test
result = app.invoke({"question": "od letter"})

print("\n--- Context ---")
for doc in result["context"]:
    print(doc.page_content)

print("\n--- Answer ---")
print(result["answer"])

# Optional: Stream result steps
# for step in app.stream({"question": "What is prototyping model?"}, stream_mode="updates"):
#     print(step)
#     print("----------------")
