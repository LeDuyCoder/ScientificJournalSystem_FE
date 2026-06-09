import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuthStore } from '../../app/store/authStore';

/**
 * Axios instance dùng chung cho toàn bộ FE.
 * Tự động gắn Bearer Token vào Header thay vì dùng Cookie.
 */
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Đã bỏ withCredentials: true để tuân thủ chuẩn mới (dùng Token từ LocalStorage)
});

// Interceptor xử lý Request: Tự động lấy token từ LocalStorage
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý Response: Tự động refresh token khi lỗi 401
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { withCredentials: true } // Giữ withCredentials: true duy nhất ở endpoint refresh nếu BE vẫn còn xài refresh token HTTP-Only
        );

        if (res.status === 200) {
          const newToken = res.data?.token || res.data?.data?.token || null;
          
          if (newToken) {
            const { loginSuccess } = useAuthStore.getState(); 
            loginSuccess(newToken); 
            
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        // Đăng xuất nếu refresh cũng thất bại
        const { logout } = useAuthStore.getState();
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
