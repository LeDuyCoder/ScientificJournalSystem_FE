import { useTranslation } from 'react-i18next'
import { FcGoogle } from 'react-icons/fc'
import './SocialAuthButton.css'

const SocialAuthButton = ({ onClick, disabled = false }) => {
  // Lấy text nút Google từ file dịch
  const { t } = useTranslation('auth')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`social-auth-btn ${disabled ? 'social-auth-btn--disabled' : ''}`}
    >
      <FcGoogle size={20} />
      {/* Text nút thay đổi theo ngôn ngữ */}
      <span>{t('signUp.googleButton')}</span>
    </button>
  )
}

export default SocialAuthButton