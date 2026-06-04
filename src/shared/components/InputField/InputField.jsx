import './InputField.css'

// Component InputField dùng chung cho toàn bộ form trong app
// Nhận vào các props: label, type, placeholder, value, onChange, error, icon, required
const InputField = ({
  label,        // Tên nhãn hiển thị phía trên input
  type = 'text', // Loại input: text, email, ... (mặc định là text)
  placeholder,  // Text gợi ý bên trong input
  value,        // Giá trị hiện tại của input (controlled component)
  onChange,     // Hàm xử lý khi người dùng gõ
  error,        // Chuỗi lỗi, nếu có sẽ hiển thị bên dưới input
  icon,         // Icon hiển thị bên trái input (truyền vào dạng JSX)
  required,     // Nếu true thì hiển thị dấu * đỏ sau label
}) => {
  return (
    // Wrapper bọc toàn bộ: label + input + error message
    <div className="input-field-wrapper">

      {/* Chỉ render label nếu có truyền prop label vào */}
      {label && (
        <label className="input-label">
          {label}
          {/* Chỉ hiện dấu * nếu field là required */}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      {/* Container bọc icon + input, thêm class input-error nếu có lỗi */}
      <div className={`input-container ${error ? 'input-error' : ''}`}>

        {/* Chỉ render icon nếu có truyền vào */}
        {icon && <span className="input-icon">{icon}</span>}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-element"
        />
      </div>

      {/* Hiển thị thông báo lỗi bên dưới input nếu có */}
      {error && <span className="input-error-message">{error}</span>}
    </div>
  )
}

export default InputField