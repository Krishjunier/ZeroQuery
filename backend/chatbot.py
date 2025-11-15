from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows your frontend (even if on a different port) to call the API

# Replace with your actual Groq API key
groq_client = Groq(api_key="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")

# System prompt with portal links and descriptions (modify if needed)
system_prompt = {
    "role": "system",
    "content": """
You are KG Academic Assistant — a helpful AI assistant for students and faculty.
Use the following portals for reference if needed:

👤 User Profiles: http://127.0.0.1:3000/userprofiles.html
🏅 Badges: http://127.0.0.1:3000/badges.html
📘 Disciplines: http://127.0.0.1:3000/disciplines.html
❓ Queries: http://127.0.0.1:3000/queries.html
💬 Threads: http://127.0.0.1:3000/threads.html
🗨️ Replies: http://127.0.0.1:3000/replies.html
🏷️ Tags: http://127.0.0.1:3000/tags.html
⬆️⬇️ Votes: http://127.0.0.1:3000/votes.html
🔔 Notifications: http://127.0.0.1:3000/notifications.html
🔎 Search: http://127.0.0.1:3000/search.html

Answer academic queries and include links when relevant.
"""
}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")

    # Build messages for the conversation; for simplicity we send only system and user message
    messages = [system_prompt, {"role": "user", "content": message}]
    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages,
            temperature=0.6,
            max_tokens=500
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8001)
