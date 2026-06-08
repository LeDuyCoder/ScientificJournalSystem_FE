/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: app\store\authStore.js
 */
import { create } from 'zustand';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

const getStoredToken = () => (
  localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
);

/**
 * Store quản lý trạng thái xác thực toàn cục.
 *
 * Hiện dự án đang chuyển từ lưu token ở browser storage sang luồng
 * access/refresh token bằng HTTP-only cookie. Vì vậy store vẫn giữ:
 * - `token`: token nhận từ login/refresh nếu BE trả về.
 * - `user`: thông tin user khôi phục từ `/users/me` khi cookie còn hợp lệ.
 */
export const useAuthStore = create((set) => {
  const initialToken = getStoredToken();

  return {
    token: initialToken,
    isAuthenticated: Boolean(initialToken),
    user: null,
    isLoading: false,
    error: null,

    /**
     * Đánh dấu phiên đăng nhập là hợp lệ.
     *
     * Hỗ trợ 2 trường hợp:
     * - Login/refresh token: `loginSuccess(token)`
     * - Khôi phục session bằng cookie: `loginSuccess(null, user)`
     */
    loginSuccess: (token = null, user = null) => set((state) => ({
      token: token ?? state.token,
      user: user ?? state.user,
      isAuthenticated: Boolean(token ?? state.token ?? user ?? state.user),
      error: null,
    })),

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    /**
     * Xóa trạng thái auth trong memory.
     * Việc xóa token trong localStorage/sessionStorage nằm ở `removeToken`.
     */
    logout: () => set({
      token: null,
      isAuthenticated: false,
      user: null,
      error: null,
      isLoading: false,
    }),
  };
});