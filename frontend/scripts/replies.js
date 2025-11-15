const REPLY_API = "http://127.0.0.1:8000/api/replies/";
const THREAD_API = "http://127.0.0.1:8000/api/threads/";
const USERS_API = "http://127.0.0.1:8000/api/users/";

document.addEventListener("DOMContentLoaded", () => {
  const replyForm = document.getElementById("replyForm");
  const threadSelect = document.getElementById("threadId");
  const userSelect = document.getElementById("userId");
  const parentInput = document.getElementById("parentId");
  const repliesContainer = document.getElementById("repliesContainer");

  async function fetchDropdownData() {
    const [threads, users] = await Promise.all([
      fetch(THREAD_API).then(res => res.json()),
      fetch(USERS_API).then(res => res.json())
    ]);

    threadSelect.innerHTML = threads.map(t => `<option value="${t.id}">${t.title}</option>`).join("");
    userSelect.innerHTML = users.map(u => `<option value="${u.id}">${u.username}</option>`).join("");
  }

  function renderReplies(replies, parentId = null, depth = 0) {
    return replies
      .filter(r => (r.parent && r.parent.id === parentId) || (!r.parent && parentId === null))
      .map(r => {
        const children = renderReplies(replies, r.id, depth + 1);
        return `
          <div class="reply-box nested-reply" style="margin-left:${depth * 30}px">
            <div class="reply-header">${r.user.username} <span class="reply-time">— ${new Date(r.created_at).toLocaleString()}</span></div>
            <div class="reply-message mb-2">${r.message}</div>
            <div class="reply-action" onclick="setReplyParent(${r.id})">↪️ Reply</div>
            ${children}
          </div>
        `;
      }).join("");
  }

  async function loadReplies() {
    try {
      const res = await fetch(REPLY_API);
      const data = await res.json();
      repliesContainer.innerHTML = renderReplies(data);
    } catch (err) {
      repliesContainer.innerHTML = `<div class="alert alert-danger">⚠️ Failed to load replies</div>`;
    }
  }

  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const thread = threadSelect.value;
    const user = userSelect.value;
    const message = document.getElementById("message").value.trim();
    const parent = parentInput.value || null;

    const payload = {
      thread_id: parseInt(thread),
      user_id: parseInt(user),
      message,
    };
    if (parent) payload.parent_id = parseInt(parent);

    try {
      const res = await fetch(REPLY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to post reply");

      alert("✅ Reply posted!");
      replyForm.reset();
      parentInput.value = ""; // reset parent
      await loadReplies();
    } catch (err) {
      alert("⚠️ Failed to post reply");
    }
  });

  // Set parent reply for nested reply
  window.setReplyParent = function (replyId) {
    parentInput.value = replyId;
    document.getElementById("message").focus();
  };

  fetchDropdownData();
  loadReplies();
});
