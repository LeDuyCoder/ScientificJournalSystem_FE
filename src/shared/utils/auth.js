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
    // 1. Nếu Zustand đang báo có User (đã đăng nhập thành công trước đó trong phiên này)
    const storeUser = useAuthStore.getState().user;
    if (storeUser) {
      return true;
    }

    // 2. Nếu F5 lại trang, Zustand bị mất data -> Gọi API /me để Cookie quét xác thực
    const res = await api.get('/users/me');

    if (res.status === 200) {
      // Backend hỗ trợ linh hoạt format: lấy trực tiếp hoặc bọc trong object
      const user = res.data?.user || res.data?.data?.user || res.data;
      
      // Cập nhật vào Zustand trạng thái đăng nhập thành công
      // Lưu ý: Hàm này trong store của bạn chỉ cần set state: user và isAuthenticated = true
      useAuthStore.getState().loginSuccess(null, user);
      
      return true;
    }

    return false;
  } catch (error) {
    // 🔥 HỢP NHẤT BIỆN PHÁP AN TOÀN CỦA CẢ 2 BÊN KHI THẤT BẠI:
    // Nếu dính lỗi 401 triệt để (kể cả sau khi Axios Interceptor đã cố Refresh thất bại)
    // Không xác thực được thì xóa state/token cũ để tránh UI hiểu nhầm là đã login.
    useAuthStore.getState().logout(); 
    removeToken();
    return false;
  }
};