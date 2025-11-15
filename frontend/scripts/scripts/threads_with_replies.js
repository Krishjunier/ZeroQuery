const THREAD_API = "http://127.0.0.1:8000/api/threads/";
const QUERY_API = "http://127.0.0.1:8000/api/queries/";
const USERS_API = "http://127.0.0.1:8000/api/users/";
const REPLIES_API = "http://127.0.0.1:8000/api/replies/";

document.addEventListener("DOMContentLoaded", () => {
  const querySelect = document.getElementById("queryId");
  const userSelect = document.getElementById("userId");
  const threadsContainer = document.getElementById("threadsContainer");

  async function fetchDropdowns() {
    const [queries, users] = await Promise.all([
      fetch(QUERY_API).then(res => res.json()),
      fetch(USERS_API).then(res => res.json())
    ]);

    querySelect.innerHTML = queries.map(q => `<option value="${q.id}">${q.title}</option>`).join("");
    userSelect.innerHTML = users.map(u => `<option value="${u.id}">${u.username}</option>`).join("");
  }

  async function loadThreads() {
    const [threads, replies] = await Promise.all([
      fetch(THREAD_API).then(res => res.json()),
      fetch(REPLIES_API).then(res => res.json())
    ]);

    const repliesByThread = replies.reduce((acc, reply) => {
      const threadId = reply.thread.id;
      acc[threadId] = acc[threadId] || [];
      acc[threadId].push(reply);
      return acc;
    }, {});

    threadsContainer.innerHTML = threads.map(thread => {
      const repliesHTML = (repliesByThread[thread.id] || []).map(reply => `
        <div class="reply-box">
          <strong>${reply.user.username}</strong>: ${reply.message}
          <div class="text-muted small">${new Date(reply.created_at).toLocaleString()}</div>
        </div>
      `).join("");

      return `
        <div class="thread-box">
          <div class="thread-header">${thread.title}</div>
          <div class="thread-user">by ${thread.user.username}</div>
          <div class="thread-message">${thread.message}</div>
          <div class="thread-meta">🕓 ${new Date(thread.created_at).toLocaleString()} | Topic: ${thread.query.title}</div>

          ${repliesHTML}

          <form class="reply-form" data-thread-id="${thread.id}">
            <div class="input-group mt-2">
              <select class="form-select form-select-sm user-selector"></select>
              <input class="form-control form-control-sm reply-input" placeholder="Write a reply..."/>
              <button class="btn btn-sm btn-success" type="submit">Reply</button>
            </div>
          </form>
        </div>
      `;
    }).join("");

    populateUserSelectors();
    attachReplyHandlers();
  }

  function populateUserSelectors() {
    document.querySelectorAll('.user-selector').forEach(select => {
      select.innerHTML = userSelect.innerHTML; // clone user dropdown
    });
  }

  function attachReplyHandlers() {
    document.querySelectorAll(".reply-form").forEach(form => {
      form.addEventListener("submit", async e => {
        e.preventDefault();
        const threadId = form.getAttribute("data-thread-id");
        const userId = form.querySelector(".user-selector").value;
        const message = form.querySelector(".reply-input").value.trim();

        if (!message || !userId) return alert("⚠️ Message and user are required!");

        try {
          const res = await fetch(REPLIES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              thread_id: threadId,
              user_id: userId,
              message: message
            })
          });
          if (!res.ok) throw new Error("Failed to reply");

          await loadThreads();
        } catch (err) {
          alert("⚠️ Failed to post reply.");
        }
      });
    });
  }

  document.getElementById("threadForm").addEventListener("submit", async e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const message = document.getElementById("message").value;
    const query_id = querySelect.value;
    const user_id = userSelect.value;

    try {
      const res = await fetch(THREAD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, query_id, user_id })
      });

      if (!res.ok) throw new Error("Thread creation failed");
      alert("✅ Thread created");
      e.target.reset();
      await loadThreads();
    } catch (err) {
      alert("❌ Failed to create thread");
    }
  });

  fetchDropdowns();
  loadThreads();
});
