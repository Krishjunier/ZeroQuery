const API_CHATBOT = "http://127.0.0.1:8001/api/chat";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("userInput");
  const chatArea = document.getElementById("chatArea");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    chatArea.innerHTML += `
      <div class="chat-bubble user mb-3">
        <strong>👤 You:</strong><br>${message}
      </div>
    `;
    input.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
      const res = await fetch(API_CHATBOT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const reply = data.reply || "⚠️ No response from assistant.";

      const lines = reply.split(/\n|•|\-/).filter(line => line.trim());
      let formatted = "<ul>";
      lines.forEach(line => {
        formatted += `<li>📌 ${line.trim()}</li>`;
      });
      formatted += "</ul>";

      chatArea.innerHTML += `
        <div class="chat-bubble bot mb-3">
          <strong>🤖 Assistant:</strong><br>${formatted}
          <div class="mt-3">
            <a href="queries.html" class="btn btn-outline-primary btn-sm me-2">📝 Go to Queries</a>
            <a href="threads.html" class="btn btn-outline-success btn-sm">💬 Go to Threads</a>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      chatArea.innerHTML += `<div class="chat-bubble error text-danger">❌ Error talking to assistant.</div>`;
    }

    chatArea.scrollTop = chatArea.scrollHeight;
  });
});
