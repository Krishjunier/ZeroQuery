const USERS_API = "http://127.0.0.1:8000/api/users/";

// Create a new user when the form is submitted
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();

  try {
    const response = await fetch(USERS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email })
    });

    if (!response.ok) {
      throw new Error("Failed to create user.");
    }

    const newUser = await response.json();
    alert(`✅ User created with ID: ${newUser.id}`);
    e.target.reset();
    loadUsers();  // Reload the user list after creation
  } catch (err) {
    console.error(err);
    alert("⚠️ Error creating user.");
  }
});

// Function to load and display all users
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("usersTableBody");

  async function loadUsers() {
    try {
      const res = await fetch(USERS_API);
      const users = await res.json();

      tableBody.innerHTML = "";
      users.forEach((user) => {
        const row = `
          <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("Error loading users:", error);
      tableBody.innerHTML = `<tr><td colspan="3">⚠️ Failed to load users</td></tr>`;
    }
  }

  loadUsers();
});
