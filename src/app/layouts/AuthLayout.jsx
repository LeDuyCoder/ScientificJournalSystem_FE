import './AuthLayout.css'

// Layout dùng chung cho tất cả trang auth: Sign-Up, Login, Forgot Password
// Đặt trong app/layouts vì đây là layout cấp app, không riêng của feature nào
const AuthLayout = ({ banner, form }) => {
  return (
    <div className="auth-layout">

      {/* Cột trái: banner */}
      <div className="auth-layout__banner">
        {banner}
      </div>

      {/* Cột phải: form */}
      <div className="auth-layout__form">
        {form}
      </div>

    </div>
  )
}

export default AuthLayout