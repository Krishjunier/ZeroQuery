// scripts/main.js

const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchData(endpoint) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
}

export async function postData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to POST to ${endpoint}`);
  return response.json();
}
