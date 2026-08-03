import axios from 'axios';

// Dynamically use localhost in development, and monolithic same-origin /api in production (Render)
const env = (import.meta as any).env;
const BASE_URL = env?.VITE_API_URL || (env?.MODE === 'development' ? 'http://localhost:8080/api' : '/api');

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enable sending and receiving cookies cross-origin & same-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
