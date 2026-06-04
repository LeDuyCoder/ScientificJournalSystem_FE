import { useTranslation } from 'react-i18next'
import { MdOutlineEmail } from 'react-icons/md'
import InputField from '../../../../shared/components/InputField/InputField'
import PasswordInput from '../../../../shared/components/PasswordInput/PasswordInput'
import Button from '../../../../shared/components/Button/Button'
import SocialAuthButton from '../SocialAuthButton/SocialAuthButton'
import FormDivider from '../FormDivider/FormDivider'
import useSignUp from '../../hooks/useSignUp'
import './SignUpForm.css'

const SignUpForm = () => {
  // Lấy hàm t để dịch text trong form
  // Thêm i18n vào để dùng hàm changeLanguage
  const { t, i18n } = useTranslation('auth')

  // Hàm chuyển đổi ngôn ngữ: nếu đang VI thì đổi sang EN và ngược lại
  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(newLang)
  }

  const {
    formData,
    errors,
    loading,
    apiError,
    isSuccess,
    handleChange,
    handleSubmit,
  } = useSignUp()

  // Màn hình thành công sau khi đăng ký
  if (isSuccess) {
    return (
      <div className="signup-form signup-form--success">
        <div className="signup-form__success-icon">✅</div>
        {/* Text thành công lấy từ file dịch */}
        <h2 className="signup-form__title">{t('signUp.successTitle')}</h2>
        <p className="signup-form__description">{t('signUp.successDescription')}</p>
      </div>
    )
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit} noValidate>
      {/* Nút chuyển ngôn ngữ: đặt góc trên phải form, chỉ dùng để test */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={toggleLanguage}
          style={{
            background: 'transparent',
            border: '1px solid #2d3748',
            borderRadius: '6px',
            color: '#94a3b8',
            padding: '4px 10px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {/* Hiện ngôn ngữ đang dùng */}
          {i18n.language === 'vi' ? '🇺🇸 EN' : '🇻🇳 VI'}
        </button>
      </div>

      {/* Header */}
      <div className="signup-form__header">
        <h2 className="signup-form__title">{t('signUp.title')}</h2>
        <p className="signup-form__description">{t('signUp.description')}</p>
      </div>

      <SocialAuthButton />
      <FormDivider />

      {/* Họ + Tên */}
      <div className="signup-form__name-row">
        <InputField
          label={t('signUp.firstName')}
          placeholder={t('signUp.firstNamePlaceholder')}
          value={formData.firstName}
          onChange={handleChange('firstName')}
          error={errors.firstName}
          required
        />
        <InputField
          label={t('signUp.lastName')}
          placeholder={t('signUp.lastNamePlaceholder')}
          value={formData.lastName}
          onChange={handleChange('lastName')}
          error={errors.lastName}
          required
        />
      </div>

      {/* Email */}
      <InputField
        label={t('signUp.email')}
        type="email"
        placeholder={t('signUp.emailPlaceholder')}
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        icon={<MdOutlineEmail size={16} />}
        required
      />

      {/* Mật khẩu */}
      <PasswordInput
        label={t('signUp.password')}
        placeholder={t('signUp.passwordPlaceholder')}
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
        required
      />

      {/* Xác nhận mật khẩu */}
      <PasswordInput
        label={t('signUp.confirmPassword')}
        placeholder={t('signUp.confirmPasswordPlaceholder')}
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={errors.confirmPassword}
        required
      />

      {/* Checkbox điều khoản */}
      <div className="signup-form__terms">
        <input
          type="checkbox"
          id="terms"
          className="signup-form__checkbox"
          checked={formData.agreeTerms}
          onChange={handleChange('agreeTerms')}
        />
        <label htmlFor="terms" className="signup-form__terms-label">
          {t('signUp.terms')}{' '}
          <a href="#" className="signup-form__terms-link">
            {t('signUp.termsLink')}
          </a>
          {' '}{t('signUp.and')}{' '}
          <a href="#" className="signup-form__terms-link">
            {t('signUp.privacyLink')}
          </a>
        </label>
      </div>

      {/* Lỗi checkbox */}
      {errors.agreeTerms && (
        <span className="signup-form__terms-error">{errors.agreeTerms}</span>
      )}

      {/* Lỗi API */}
      {apiError && (
        <div className="signup-form__api-error">{apiError}</div>
      )}

      {/* Nút submit */}
      <Button type="submit" variant="primary" loading={loading} disabled={loading}>
        {t('signUp.submitButton')}
      </Button>

      {/* Link đăng nhập */}
      <p className="signup-form__login-link">
        {t('signUp.loginText')}{' '}
        <a href="#" className="signup-form__terms-link">
          {t('signUp.loginLink')}
        </a>
      </p>

    </form>
  )
}

export default SignUpForm