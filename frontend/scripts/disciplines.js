// disciplines.js
document.addEventListener("DOMContentLoaded", async function () {
    const disciplinesContainer = document.getElementById("disciplinesContainer");
    
    const response = await fetch("http://127.0.0.1:8000/api/disciplines/");
    const data = await response.json();
  
    if (data && data.length > 0) {
      data.forEach(discipline => {
        const disciplineElement = document.createElement("div");
        disciplineElement.classList.add("card", "mb-3");
        disciplineElement.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${discipline.name}</h5>
            <p class="card-text">${discipline.description}</p>
          </div>
        `;
        disciplinesContainer.appendChild(disciplineElement);
      });
    } else {
      disciplinesContainer.innerHTML = `<p>No disciplines found.</p>`;
    }
  });
  