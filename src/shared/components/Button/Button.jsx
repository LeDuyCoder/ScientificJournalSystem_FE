import './Button.css'

// Component Button dùng chung cho toàn app
// Hỗ trợ các trạng thái: disabled, loading, và các variant khác nhau
const Button = ({
  children,           // Nội dung bên trong button (text hoặc JSX)
  onClick,            // Hàm xử lý khi click
  type = 'button',   // Loại button: 'button', 'submit' (mặc định là 'button')
  disabled = false,  // Nếu true thì button không thể click
  loading = false,   // Nếu true thì hiện spinner và disable button
  variant = 'primary', // Kiểu button: 'primary' (xanh gradient) | 'secondary'
  fullWidth = true,  // Mặc định full width, có thể tắt nếu cần
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      // Disable khi prop disabled=true HOẶC đang loading
      disabled={disabled || loading}
      className={[
        'btn-custom',                          // Class base
        `btn-${variant}`,                      // Class theo variant
        fullWidth ? 'btn-full-width' : '',     // Full width nếu cần
        disabled || loading ? 'btn-disabled' : '', // Style mờ khi disabled
      ].join(' ')}
    >
      {/* Nếu đang loading thì hiện spinner, không thì hiện nội dung bình thường */}
      {loading ? (
        <span className="btn-spinner-wrapper">
          {/* Spinner xoay tròn */}
          <span className="btn-spinner" />
          <span>Đang xử lý...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button