import axios from 'axios';

// Base Axios instance pointing to the backend API base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the bearer auth token
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('researchpulse_token');
    
    if (!token) {
      // For guest users, try to use a cached guest token
      token = localStorage.getItem('researchpulse_guest_token');
      
      // If not cached, fetch it from login API
      if (!token && !config.url.endsWith('/auth/login') && !config.url.endsWith('/auth/register')) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
            email: 'phunghao2701@gmail.com',
            password: '12345678'
          });
          if (res.data?.success && res.data?.data?.token) {
            token = res.data.data.token;
            localStorage.setItem('researchpulse_guest_token', token);
          }
        } catch (err) {
          console.error('Error fetching guest token in background:', err);
        }
      }
    }

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
