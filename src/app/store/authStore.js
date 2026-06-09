/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: app\store\authStore.js
 */
import { create } from 'zustand';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

/**
 * Store quản lý trạng thái xác thực toàn cục.
 *
 * Hiện dự án đang chuyển từ lưu token ở browser storage sang luồng
 * access/refresh token bằng HTTP-only cookie. Vì vậy store vẫn giữ:
 * - `token`: token nhận từ login/refresh nếu BE trả về.
 * - `user`: thông tin user khôi phục từ `/users/me` khi cookie còn hợp lệ.
 */
export const useAuthStore = create((set) => {
  return {
    token: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    user: null,
    isLoading: false,
    error: null,

    /**
     * Đánh dấu phiên đăng nhập là hợp lệ.
     * Lưu token vào localStorage theo chuẩn mới.
     *
     * @param {string|null} token - Token xác thực được trả về từ backend.
     * @param {Object|null} user - Thông tin người dùng.
     */
    loginSuccess: (token = null, user = null) => {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      }
      set((state) => ({
        token: token ?? state.token,
        user: user ?? state.user,
        isAuthenticated: Boolean(token ?? state.token ?? user ?? state.user),
        error: null,
      }));
    },

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    /**
     * Xóa trạng thái auth và xóa token khỏi localStorage.
     */
    logout: () => {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      set({
        token: null,
        isAuthenticated: false,
        user: null,
        error: null,
        isLoading: false,
      });
    },
  };
});