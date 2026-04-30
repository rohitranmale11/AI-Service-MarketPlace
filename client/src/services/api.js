import axios from 'axios';

const AUTH_STORAGE_KEY = 'ai-service-marketplace-auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
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
