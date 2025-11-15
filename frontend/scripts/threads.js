const THREAD_API = "http://127.0.0.1:8000/api/threads/";
const QUERY_API = "http://127.0.0.1:8000/api/queries/";
const USERS_API = "http://127.0.0.1:8000/api/users/";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("threadForm");
  const querySelect = document.getElementById("queryId");
  const userSelect = document.getElementById("userId");
  const threadTableBody = document.getElementById("threadTableBody");

  // Load Queries
  async function loadQueries() {
    const res = await fetch(QUERY_API);
    const queries = await res.json();
    queries.forEach((q) => {
      const option = document.createElement("option");
      option.value = q.id;
      option.textContent = q.title;
      querySelect.appendChild(option);
    });
  }

  // Load Users
  async function loadUsers() {
    const res = await fetch(USERS_API);
    const users = await res.json();
    users.forEach((u) => {
      const option = document.createElement("option");
      option.value = u.id;
      option.textContent = u.username;
      userSelect.appendChild(option);
    });
  }

  // Load Threads
  async function loadThreads() {
    try {
      const res = await fetch(THREAD_API);
      const threads = await res.json();

      threadTableBody.innerHTML = "";
      threads.forEach((thread) => {
        const row = `
          <tr>
            <td>${thread.id}</td>
            <td>${thread.query.title}</td>
            <td>${thread.title}</td>
            <td>${thread.message}</td>
            <td>${thread.user.username}</td>
            <td>${new Date(thread.created_at).toLocaleString()}</td>
          </tr>
        `;
        threadTableBody.innerHTML += row;
      });
    } catch (err) {
      console.error("Error loading threads:", err);
      threadTableBody.innerHTML = `<tr><td colspan="6">⚠️ Failed to load threads</td></tr>`;
    }
  }

  // Submit new thread
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const threadData = {
      query_id: querySelect.value,
      user_id: userSelect.value,
      title: document.getElementById("title").value.trim(),
      message: document.getElementById("message").value.trim()
    };

    try {
      const res = await fetch(THREAD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(threadData)
      });

      if (!res.ok) throw new Error("Failed to post thread");

      alert("✅ Thread posted!");
      form.reset();
      loadThreads();
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Failed to post thread");
    }
  });

  loadQueries();
  loadUsers();
  loadThreads(); // Load threads on page load
});
