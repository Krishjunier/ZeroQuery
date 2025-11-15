// api.js
const BASE_URL = 'http://127.0.0.1:8000/api';

export const api = {
  getQueries: async () => {
    const response = await fetch(`${BASE_URL}/queries/`);
    const data = await response.json();
    return data;
  },

  getThreads: async () => {
    const response = await fetch(`${BASE_URL}/threads/`);
    const data = await response.json();
    return data;
  },

  getReplies: async (threadId) => {
    const response = await fetch(`${BASE_URL}/replies/?thread=${threadId}`);
    const data = await response.json();
    return data;
  },

  createThread: async (title, description, queryId) => {
    const response = await fetch(`${BASE_URL}/threads/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        message: description,
        query: queryId,
      }),
    });
    return response.json();
  },

  createReply: async (threadId, message) => {
    const response = await fetch(`${BASE_URL}/replies/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        thread: threadId,
        message: message,
      }),
    });
    return response.json();
  },

  // Add more functions as needed (for badges, user profiles, etc.)
};
