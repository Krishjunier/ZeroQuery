// globalSearch.js
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const searchResultsDiv = document.getElementById("searchResults");
  
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = document.getElementById("searchQuery").value;
  
      if (!query) {
        alert("Please enter a search term.");
        return;
      }
  
      const response = await fetch(`http://127.0.0.1:8000/api/search/?q=${encodeURIComponent(query)}`);
      const data = await response.json();
  
      if (data.error) {
        searchResultsDiv.innerHTML = `<div class="alert alert-danger" role="alert">${data.error}</div>`;
        return;
      }
  
      // Clear the results before appending
      searchResultsDiv.innerHTML = "";
  
      if (data.queries.length || data.threads.length || data.replies.length || data.disciplines.length) {
        // Display queries
        if (data.queries.length) {
          const queriesDiv = document.createElement("div");
          queriesDiv.innerHTML = "<h4>Queries</h4>";
          data.queries.forEach(query => {
            queriesDiv.innerHTML += `
              <div class="card mb-2">
                <div class="card-body">
                  <h5 class="card-title">${query.title}</h5>
                  <p class="card-text">${query.description}</p>
                </div>
              </div>
            `;
          });
          searchResultsDiv.appendChild(queriesDiv);
        }
  
        // Display threads
        if (data.threads.length) {
          const threadsDiv = document.createElement("div");
          threadsDiv.innerHTML = "<h4>Threads</h4>";
          data.threads.forEach(thread => {
            threadsDiv.innerHTML += `
              <div class="card mb-2">
                <div class="card-body">
                  <h5 class="card-title">${thread.title}</h5>
                  <p class="card-text">${thread.message}</p>
                </div>
              </div>
            `;
          });
          searchResultsDiv.appendChild(threadsDiv);
        }
  
        // Display replies
        if (data.replies.length) {
          const repliesDiv = document.createElement("div");
          repliesDiv.innerHTML = "<h4>Replies</h4>";
          data.replies.forEach(reply => {
            repliesDiv.innerHTML += `
              <div class="card mb-2">
                <div class="card-body">
                  <p class="card-text">${reply.message}</p>
                </div>
              </div>
            `;
          });
          searchResultsDiv.appendChild(repliesDiv);
        }
  
        // Display disciplines
        if (data.disciplines.length) {
          const disciplinesDiv = document.createElement("div");
          disciplinesDiv.innerHTML = "<h4>Disciplines</h4>";
          data.disciplines.forEach(discipline => {
            disciplinesDiv.innerHTML += `
              <div class="card mb-2">
                <div class="card-body">
                  <h5 class="card-title">${discipline.name}</h5>
                  <p class="card-text">${discipline.description}</p>
                </div>
              </div>
            `;
          });
          searchResultsDiv.appendChild(disciplinesDiv);
        }
      } else {
        searchResultsDiv.innerHTML = "<div class='alert alert-warning' role='alert'>No results found.</div>";
      }
    });
  });
  