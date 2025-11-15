// badges.js
document.addEventListener("DOMContentLoaded", async function () {
    const badgesContainer = document.getElementById("badgesContainer");
    
    const response = await fetch("http://127.0.0.1:8000/api/badges/");
    const data = await response.json();
  
    if (data && data.length > 0) {
      data.forEach(badge => {
        const badgeElement = document.createElement("div");
        badgeElement.classList.add("card", "mb-3");
        badgeElement.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${badge.name}</h5>
            <p class="card-text">${badge.description}</p>
            <img src="http://127.0.0.1:8000${badge.icon}" alt="${badge.name}" class="img-fluid" />
          </div>
        `;
        badgesContainer.appendChild(badgeElement);
      });
    } else {
      badgesContainer.innerHTML = `<p>No badges found.</p>`;
    }
  });
  