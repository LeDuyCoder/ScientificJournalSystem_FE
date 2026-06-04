import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import InputField from '../InputField/InputField'
import './PasswordInput.css'

// Component PasswordInput mở rộng từ InputField
// Thêm chức năng toggle hiện/ẩn mật khẩu bằng icon mắt
const PasswordInput = ({
  label,       // Nhãn hiển thị phía trên input
  placeholder, // Text gợi ý bên trong input
  value,       // Giá trị hiện tại (controlled)
  onChange,    // Hàm xử lý khi người dùng gõ
  error,       // Chuỗi lỗi nếu có
  required,    // Hiện dấu * nếu true
}) => {
  // State kiểm soát việc hiện hay ẩn mật khẩu
  // false = ẩn (type="password"), true = hiện (type="text")
  const [showPassword, setShowPassword] = useState(false)

  // Hàm toggle: đảo ngược trạng thái showPassword
  const toggleShow = () => setShowPassword((prev) => !prev)

  // Icon khóa hiển thị bên trái input
  const lockIcon = <span className="lock-icon">🔒</span>

  // Icon mắt bên phải: đổi giữa mở/đóng tùy trạng thái showPassword
  const eyeIcon = (
    <span className="eye-icon" onClick={toggleShow}>
      {showPassword
        ? <AiOutlineEyeInvisible size={18} /> // Đang hiện → click để ẩn
        : <AiOutlineEye size={18} />           // Đang ẩn → click để hiện
      }
    </span>
  )

  return (
    // Wrapper thêm class để position icon mắt bên phải
    <div className="password-input-wrapper">

      {/* Dùng lại InputField, chỉ thay type và thêm icon */}
      <InputField
        label={label}
        type={showPassword ? 'text' : 'password'} // Đổi type theo trạng thái
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        required={required}
        icon={lockIcon} // Icon khóa bên trái
      />

      {/* Icon mắt đặt đè lên góc phải của input */}
      <span className="eye-icon-wrapper">{eyeIcon}</span>
    </div>
  )
}

export default PasswordInput