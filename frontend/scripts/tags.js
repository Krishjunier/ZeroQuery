// tags.js
document.addEventListener("DOMContentLoaded", async function () {
    const tagsContainer = document.getElementById("tagsContainer");
    
    const response = await fetch("http://127.0.0.1:8000/api/tags/");
    const data = await response.json();
  
    if (data && data.length > 0) {
      data.forEach(tag => {
        const tagElement = document.createElement("div");
        tagElement.classList.add("badge", "bg-info", "me-2");
        tagElement.textContent = tag.name;
        tagsContainer.appendChild(tagElement);
      });
    } else {
      tagsContainer.innerHTML = `<p>No tags found.</p>`;
    }
  });
  