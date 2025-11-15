const VOTES_API = "http://127.0.0.1:8000/api/votes/";
const THREADS_API = "http://127.0.0.1:8000/api/threads/";
const REPLIES_API = "http://127.0.0.1:8000/api/replies/";
const USERS_API = "http://127.0.0.1:8000/api/users/";

document.addEventListener("DOMContentLoaded", () => {
  const voteForm = document.getElementById("voteForm");
  const voteMessage = document.getElementById("voteMessage");
  const threadSelect = document.getElementById("threadSelect");
  const replySelect = document.getElementById("replySelect");
  const userSelect = document.getElementById("userSelect");
  const votesTableBody = document.getElementById("votesTableBody");

  // Populate threads dropdown
  async function loadThreads() {
    try {
      const res = await fetch(THREADS_API);
      const threads = await res.json();
      threadSelect.innerHTML = `<option value="">-- None --</option>`;
      threads.forEach(thread => {
        const option = document.createElement("option");
        option.value = thread.id;
        option.textContent = thread.title;
        threadSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading threads:", err);
    }
  }

  // Populate replies dropdown
  async function loadReplies() {
    try {
      const res = await fetch(REPLIES_API);
      const replies = await res.json();
      replySelect.innerHTML = `<option value="">-- None --</option>`;
      replies.forEach(reply => {
        const option = document.createElement("option");
        option.value = reply.id;
        // Show a shortened version of the reply message
        option.textContent = reply.message.substring(0, 30) + (reply.message.length > 30 ? "..." : "");
        replySelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading replies:", err);
    }
  }

  // Populate users dropdown
  async function loadUsers() {
    try {
      const res = await fetch(USERS_API);
      const users = await res.json();
      userSelect.innerHTML = `<option value="">-- Select User --</option>`;
      users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.username;
        userSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading users:", err);
    }
  }

  // Load votes and display in table
  async function loadVotes() {
    try {
      const res = await fetch(VOTES_API);
      const votes = await res.json();
      votesTableBody.innerHTML = "";
      votes.forEach(vote => {
        const row = `
          <tr>
            <td>${vote.id}</td>
            <td>${vote.is_upvote ? "Upvote" : "Downvote"}</td>
            <td>${vote.thread ? vote.thread.title : "—"}</td>
            <td>${vote.reply ? vote.reply.message.substring(0, 30) + "..." : "—"}</td>
            <td>${vote.user ? vote.user.username : "—"}</td>
          </tr>
        `;
        votesTableBody.innerHTML += row;
      });
    } catch (err) {
      console.error("Error loading votes:", err);
      votesTableBody.innerHTML = `<tr><td colspan="5">⚠️ Failed to load votes</td></tr>`;
    }
  }

  // Handle vote form submission
  voteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    voteMessage.classList.add("d-none");

    // Parse vote type as boolean
    const is_upvote = document.getElementById("voteType").value === "true";
    // Get IDs from dropdowns; if none selected, use null
    const threadId = threadSelect.value ? parseInt(threadSelect.value) : null;
    const replyId = replySelect.value ? parseInt(replySelect.value) : null;
    const userId = userSelect.value ? parseInt(userSelect.value) : null;

    // Validation: Ensure a user is selected and either a thread or a reply is chosen (but not both)
    if (!userId) {
      alert("Please select a user.");
      return;
    }
    if (threadId && replyId) {
      alert("Please select either a thread or a reply, not both.");
      return;
    }
    if (!threadId && !replyId) {
      alert("Please select a thread or a reply to vote on.");
      return;
    }

    const payload = {
      is_upvote: is_upvote,
      thread: threadId,
      reply: replyId,
      user: userId
    };

    try {
      const res = await fetch(VOTES_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
      voteMessage.textContent = "✅ Vote submitted successfully!";
      voteMessage.className = "alert alert-success";
      voteMessage.classList.remove("d-none");
      loadVotes();
    } catch (err) {
      console.error("Error submitting vote:", err);
      voteMessage.textContent = "❌ Error submitting vote: " + err.message;
      voteMessage.className = "alert alert-danger";
      voteMessage.classList.remove("d-none");
    }
  });

  // Initialize dropdowns and load votes
  loadThreads();
  loadReplies();
  loadUsers();
  loadVotes();
});
