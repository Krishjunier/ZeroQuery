// notifications.js
document.addEventListener("DOMContentLoaded", async function () {
    const notificationsContainer = document.getElementById("notificationsContainer");
    
    const response = await fetch("http://127.0.0.1:8000/api/notifications/");
    const data = await response.json();
  
    if (data && data.length > 0) {
      data.forEach(notification => {
        const notificationElement = document.createElement("div");
        notificationElement.classList.add("alert", "alert-info", "mb-2");
        notificationElement.innerHTML = `
          <strong>${notification.message}</strong>
          <br>
          <small>${new Date(notification.created_at).toLocaleString()}</small>
        `;
        notificationsContainer.appendChild(notificationElement);
      });
    } else {
      notificationsContainer.innerHTML = `<p>No notifications found.</p>`;
    }
  });
  