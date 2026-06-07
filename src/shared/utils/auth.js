import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../../app/store/authStore";

const TOKEN_KEY = "token";

/**
 * Lấy JWT token từ bộ nhớ của trình duyệt.
 * 
 * Hàm sẽ ưu tiên tìm kiếm token trong `localStorage` trước (dành cho trường hợp người dùng
 * có chọn "Ghi nhớ đăng nhập"). Nếu không tìm thấy, hàm sẽ tiếp tục tìm trong `sessionStorage`.
 *
 * @function getToken
 * @returns {string|null} Trả về chuỗi JWT token nếu tồn tại, ngược lại trả về `null`.
 */
export const getToken = () => {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY)
  );
};

/**
 * Xóa toàn bộ token xác thực khỏi bộ nhớ của trình duyệt.
 * 
 * Hàm này thường được gọi khi người dùng Đăng xuất (Logout) hoặc khi phát hiện 
 * token đã hết hạn. Hàm đảm bảo dọn sạch token ở cả `localStorage` và `sessionStorage`.
 *
 * @function removeToken
 * @returns {void} Hàm không trả về giá trị.
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

/**
 * Kiểm tra xem JWT token đã hết hạn hay chưa.
 * 
 * Hàm thực hiện giải mã (decode) payload của token để lấy thuộc tính `exp` (Thời gian hết hạn).
 * Sau đó so sánh nó với thời gian hiện tại của hệ thống. 
 * Nếu token bị lỗi format và không thể giải mã (rơi vào khối `catch`), hàm sẽ mặc định 
 * coi như token đã hết hạn (trả về `true`) để đảm bảo an toàn bảo mật.
 *
 * @function isTokenExpired
 * @param {string} token - Chuỗi JWT token cần kiểm tra.
 * @returns {boolean} Trả về `true` nếu token đã hết hạn hoặc không hợp lệ, `false` nếu token vẫn còn hạn sử dụng.
 */
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);

    const now = Date.now() / 1000;

    return exp < now;
  } catch {
    return true;
  }
};

/**
 * Kiểm tra trạng thái xác thực toàn cục (Authentication Status) của người dùng.
 * 
 * Luồng xử lý kiểm tra bảo mật nhiều lớp:
 * 1. Lấy token từ storage. Nếu không có => Chưa đăng nhập (`false`).
 * 2. Giải mã và kiểm tra hạn của token. Nếu hết hạn => Xóa rác trong storage và trả về `false`.
 * 3. [Quan trọng] Nếu người dùng F5/Reload lại trang, biến state trong Zustand (`useAuthStore`) 
 *    sẽ bị reset về null. Hàm này sẽ lấy token hợp lệ từ storage và "bơm" (sync) ngược lại vào 
 *    Zustand store thông qua `loginSuccess(token)`.
 * 4. Hoàn tất kiểm tra và trả về `true` (Hợp lệ).
 *
 * @function isAuthenticated
 * @returns {boolean} Trả về `true` nếu người dùng đã đăng nhập và token còn hợp lệ, ngược lại trả về `false`.
 */
export const isAuthenticated = () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    removeToken();
    return false;
  }

  const storeToken = useAuthStore.getState().token;

  if (!storeToken) {
    useAuthStore.getState().loginSuccess(token);
    console.log(useAuthStore.getState().token);
  }

  return true;
};