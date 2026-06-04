import './AuthLayout.css'

// Component AuthLayout: khung bố cục chung cho tất cả trang auth
// Chia đôi màn hình: bên trái là banner, bên phải là form
// Responsive: mobile thì ẩn banner, chỉ hiện form
const AuthLayout = ({ banner, form }) => {
  return (
    // Container fullscreen, background tối
    <div className="auth-layout">

      {/* Cột trái: hiển thị banner (ẩn trên mobile) */}
      <div className="auth-layout__banner">
        {banner}
      </div>

      {/* Cột phải: hiển thị form đăng ký / đăng nhập */}
      <div className="auth-layout__form">
        {form}
      </div>

    </div>
  )
}

export default AuthLayout