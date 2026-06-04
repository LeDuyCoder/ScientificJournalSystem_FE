import axios from 'axios';

// Base Axios instance pointing to the backend API base URL
const api = axios.create({
  baseURL: 'https://scientificjournalsystem-be-nodejs.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the bearer auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('researchpulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
