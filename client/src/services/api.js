import axios from 'axios';

const AUTH_STORAGE_KEY = 'ai-service-marketplace-auth';
const DEFAULT_API_BASE_URL = 'https://ai-service-marketplace.onrender.com';
const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;
const API_BASE_URL = RAW_API_BASE_URL
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

console.log('API BASE URL:', API_BASE_URL);

if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not set. Falling back to the deployed Render backend.');
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const requestUrl = new URL(config.url || '', config.baseURL || API_BASE_URL).toString();

  console.log('API Request:', requestUrl);

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
