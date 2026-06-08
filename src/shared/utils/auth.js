/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\utils\auth.js
 */
import { useAuthStore } from '../../app/store/authStore';
import api from '../services/api';

/**
 * Xóa các token cũ đang lưu ở phía client.
 *
 * Luồng auth hiện tại ưu tiên HTTP-only cookie, nhưng một số phần code cũ
 * vẫn có thể lưu token vào localStorage/sessionStorage. Xóa cả hai nhóm key
 * giúp logout hoặc xử lý phiên hết hạn sạch hơn.
 */
export const removeToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('researchpulse_token');
  sessionStorage.removeItem('researchpulse_token');
};

/**
 * Kiểm tra người dùng hiện tại còn phiên đăng nhập hợp lệ hay không.
 *
 * Trường hợp nhanh: Zustand đã có user nên không cần gọi API.
 * Trường hợp F5/reload: Zustand mất dữ liệu, gọi `/users/me` để BE xác thực
 * bằng cookie HTTP-only và trả lại thông tin user.
 */
export const isAuthenticated = async () => {
  try {
    const storeUser = useAuthStore.getState().user;
    if (storeUser) return true;

    const res = await api.get('/users/me');

    if (res.status === 200) {
      const { user } = res.data;
      useAuthStore.getState().loginSuccess(null, user);
      return true;
    }

    return false;
  } catch {
    // Không xác thực được thì xóa state/token cũ để tránh UI hiểu nhầm là đã login.
    useAuthStore.getState().logout();
    removeToken();
    return false;
  }
};