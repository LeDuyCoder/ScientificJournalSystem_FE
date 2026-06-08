/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\services\api.js
 */
import axios from 'axios';
import { useAuthStore } from '../../app/store/authStore';

/**
 * Axios instance dùng chung cho toàn bộ FE.
 *
 * Luồng auth hiện tại sau khi merge nhánh Duy:
 * - BE lưu access token/refresh token trong HTTP-only cookie.
 * - `withCredentials: true` giúp browser gửi cookie kèm request.
 * - Nếu API trả 401, interceptor sẽ thử gọi `/auth/refresh` đúng 1 lần
 *   để lấy access token mới rồi gọi lại request ban đầu.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Mỗi request chỉ được refresh một lần để tránh vòng lặp vô hạn khi token lỗi.
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          // Hỗ trợ cả 2 format response từ BE:
          // { token: "..." } hoặc { data: { token: "..." } }.
          const newToken = res.data?.token || res.data?.data?.token || null;

          if (newToken) {
            useAuthStore.getState().loginSuccess(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;