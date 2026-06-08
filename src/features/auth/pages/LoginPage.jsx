import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../../../app/layouts/AuthLayout';
import AuthBanner from '../components/AuthBanner';
import LoginForm from '../components/LoginForm';
import SocialAuthButton from '../components/SocialAuthButton';
import { toast } from '../../../shared/utils/toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const DASHBOARD_PAGE = "/dashboard";

  /**
   * Xử lý sự kiện submit form đăng nhập của người dùng.
   * 
   * Hàm này thực hiện các bước sau:
   * 1. Bật trạng thái loading và xóa các lỗi cũ.
   * 2. Gọi hàm `login` từ `AuthContext` truyền các thông tin xác thực (email, password, tùy chọn remember_login)
   *    và callback `loginSuccess` từ zustand store để lưu token.
   * 3. Nếu đăng nhập thành công, điều hướng người dùng quay lại trang họ định truy cập trước đó (`from`), 
   *    hoặc trang mặc định (thường là ``/dashboard``). Sử dụng `replace: true` để tránh người dùng quay 
   *    lại trang login khi bấm nút Back trên trình duyệt.
   * 4. Nếu có lỗi xảy ra trong quá trình gọi API, bắt lỗi và hiển thị thông báo lỗi phù hợp lên giao diện.
   * 5. Tắt trạng thái loading bất kể thành công hay thất bại.
   *
   * @async
   * @function handleLoginSubmit
   * @param {Object} payload - Dữ liệu submit từ form đăng nhập.
   * @param {string} payload.email - Địa chỉ email của người dùng.
   * @param {string} payload.password - Mật khẩu của người dùng.
   * @param {boolean} payload.remember_login - Cờ đánh dấu người dùng có muốn ghi nhớ đăng nhập (Remember Me) hay không.
   * @returns {Promise<void>} Promise hoàn thành sau khi quá trình xử lý đăng nhập kết thúc.
   */
  const handleLoginSubmit = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(payload.email, payload.password, payload.remember_login);

      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Xử lý sự kiện đăng nhập bằng tài khoản Google.
   * 
   * Hàm này thực hiện luồng công việc sau:
   * 1. Bật trạng thái loading (`setIsLoading(true)`) và xóa bỏ các lỗi hiển thị cũ (`setError(null)`).
   * 2. Gọi hàm `loginWithGoogle` để khởi chạy luồng xác thực Google (truyền vào hằng số `DASHBOARD_PAGE` làm đích đến sau khi đăng nhập thành công).
   * 3. Nếu xảy ra lỗi trong quá trình đăng nhập, bắt lỗi (`catch`) và hiển thị thông báo "Đăng nhập thất bại" qua thư viện `toast`.
   * 4. Đảm bảo luôn tắt trạng thái loading (`setIsLoading(false)`) ở khối `finally` cho dù đăng nhập thành công hay thất bại.
   *
   * @function handleLoginWithGoogle
   * @returns {void} Hàm không trả về giá trị.
   */
  const handleLoginWithGoogle = () => {
    setIsLoading(true);
    setError(null);
    try {
      try{
        loginWithGoogle(DASHBOARD_PAGE);
      }catch{
        toast.error("Đăng nhập thất bại");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout banner={<AuthBanner />}>
      <div className="mb-4">
        <h2 className="font-display fw-bold mb-1" style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>
          Đăng nhập
        </h2>
        <p className="text-muted-custom text-sm mb-0" style={{ color: 'var(--text-muted) !important' }}>
          Chào mừng trở lại! Vui lòng nhập thông tin đăng nhập của bạn.
        </p>
      </div>

      {/* Google Button */}
      <div className="mb-4">
        <SocialAuthButton onClick={handleLoginWithGoogle} disabled={isLoading} />
      </div>

      {/* Divider */}
      <div className="d-flex align-items-center justify-content-center mb-4 text-xs font-semibold select-none text-muted-custom" style={{ color: 'var(--text-muted) !important' }}>
        <div className="w-100" style={{ height: '1px', background: 'var(--border)' }} />
        <span className="px-3 text-nowrap" style={{ letterSpacing: '0.05em' }}>HOẶC</span>
        <div className="w-100" style={{ height: '1px', background: 'var(--border)' }} />
      </div>

      {/* Login Form */}
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        apiError={error}
      />

      {/* Redirect to Register */}
      <div className="text-center mt-4 text-sm font-medium">
        <span className="text-muted-custom" style={{ color: '#94a3b8 !important' }}>Chưa có tài khoản? </span>
        <Link to="/register" className="text-decoration-none" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          Đăng ký miễn phí
        </Link>
      </div>
    </AuthLayout>
  );
}
