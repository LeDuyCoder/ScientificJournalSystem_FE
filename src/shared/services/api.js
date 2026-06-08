import axios from 'axios';
import { useAuthStore } from '../../app/store/authStore';

// Base Axios instance pointing to the backend API base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { withCredentials: true } 
        );

        if (res.status === 200) {
          const newToken = res.data.token;
          
          // 🔥 ĐÂY LÀ CHỖ THAY ĐỔI: Lấy hàm loginSuccess trực tiếp từ kho Zustand mà không dùng Hook
          const { loginSuccess } = useAuthStore.getState(); 
          loginSuccess(newToken); 
          
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;