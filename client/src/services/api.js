import axios from 'axios';

const AUTH_STORAGE_KEY = 'ai-service-marketplace-auth';
const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('API URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

    if (savedAuth) {
      const { token } = JSON.parse(savedAuth);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return config;
});

export default api;
