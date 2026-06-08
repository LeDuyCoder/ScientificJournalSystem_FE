import { useAuthStore } from "../../app/store/authStore";
import api from "../services/api";

export const isAuthenticated = async () => {
  try {
    // 1. Nếu Zustand đang báo có User (đã đăng nhập thành công trước đó trong phiên này)
    const storeUser = useAuthStore.getState().user;
    if (storeUser) {
      return true;
    }

    // 2. Nếu F5 lại trang, Zustand bị mất data -> Gọi API /me để Cookie quét xác thực
    const res = await api.get("/users/me");

    if (res.status === 200) {
      const { user } = res.data; // Backend chỉ trả về dữ liệu user sạch, không trả token
      
      // Cập nhật vào Zustand trạng thái đăng nhập thành công
      // Lưu ý: Hàm này trong store của bạn chỉ cần set state: user và isAuthenticated = true
      useAuthStore.getState().loginSuccess(null, user); 
      
      return true;
    }

    return false;
  } catch (error) {
    // Nếu dính lỗi 401 triệt để (kể cả sau khi Axios Interceptor đã cố Refresh thất bại)
    useAuthStore.getState().logout(); // Đảm bảo clear sạch Zustand cũ nếu có
    return false;
  }
};