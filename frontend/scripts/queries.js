// queries.js
document.addEventListener("DOMContentLoaded", async function () {
    const queriesContainer = document.getElementById("queriesContainer");
  
    try {
      const data = await api.getQueries();
  
      if (data && data.length > 0) {
        data.forEach(query => {
          const queryElement = document.createElement("div");
          queryElement.classList.add("card", "mb-3");
          queryElement.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">${query.title}</h5>
              <p class="card-text">${query.description}</p>
            </div>
          `;
          queriesContainer.appendChild(queryElement);
        });
      } else {
        queriesContainer.innerHTML = `<p>No queries found.</p>`;
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  });
  