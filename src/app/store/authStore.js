import { create } from 'zustand';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

/**
 * Store quản lý trạng thái xác thực toàn cục.
 * Không gọi API trong store; API logic nằm ở feature auth service/hook.
 */
export const useAuthStore = create((set) => {
  const initialToken = getStoredToken();

  return {
    token: initialToken,
    isAuthenticated: !!initialToken,
    user: null,
    isLoading: false,
    error: null,

    /**
     * Cập nhật token sau khi đăng nhập hoặc đồng bộ lại từ browser storage.
     *
     * @param {string} token - JWT access token hợp lệ.
     */
    loginSuccess: (token) => set({
      token,
      isAuthenticated: !!token,
      error: null,
    }),

    /**
     * Cập nhật hồ sơ người dùng đã đăng nhập.
     *
     * @param {Object|null} user - Profile user từ backend.
     */
    setUser: (user) => set({ user }),

    /**
     * Cập nhật trạng thái loading của các thao tác auth.
     *
     * @param {boolean} isLoading - Trạng thái loading hiện tại.
     */
    setLoading: (isLoading) => set({ isLoading }),

    /**
     * Cập nhật lỗi auth để UI có thể hiển thị thông báo phù hợp.
     *
     * @param {string|null} error - Nội dung lỗi hoặc null.
     */
    setError: (error) => set({ error }),

    /**
     * Xóa trạng thái xác thực khỏi Zustand store.
     * Việc xóa token khỏi browser storage được thực hiện bởi shared/utils/auth.removeToken.
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