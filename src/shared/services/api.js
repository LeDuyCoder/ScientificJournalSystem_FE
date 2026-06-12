import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuthStore } from '../../app/store/authStore';

/**
 * Axios instance dùng chung cho toàn bộ FE.
 * Tự động gắn Bearer Token vào Header thay vì dùng Cookie.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Đã bỏ withCredentials: true để tuân thủ chuẩn mới (dùng Token từ LocalStorage)
});

// Axios instance for public endpoints (does not send cookies or tokens)
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor xử lý Response: Tự động refresh token khi lỗi 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Mỗi request chỉ được refresh một lần để tránh vòng lặp vô hạn khi token lỗi
    if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          const newToken = res.data?.token || res.data?.data?.token || null;

          if (newToken) {
            // 🔥 Giữ thay đổi: Lấy hàm loginSuccess trực tiếp từ kho Zustand mà không dùng Hook
            const { loginSuccess } = useAuthStore.getState();
            loginSuccess(newToken);
            
            // Gán token mới vào header của request bị lỗi trước đó
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

          }

          // Thực hiện lại request ban đầu với token mới
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear everything
        const { logout } = useAuthStore.getState();
        logout();
        localStorage.removeItem('researchpulse_token');
        return Promise.reject(refreshError);
      }
    }

    // If it's 401 and we already retried, clear token
    if (error.response && error.response.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      localStorage.removeItem('researchpulse_token');
    }

    return Promise.reject(error);
  }
);

export default api;
