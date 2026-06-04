import { useTranslation } from 'react-i18next'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdOutlineRadar } from 'react-icons/md'
import './AuthBanner.css'

// Component AuthBanner đã tích hợp i18n
// Dùng hook useTranslation để lấy text theo ngôn ngữ hiện tại
const AuthBanner = () => {
  // t: hàm dịch, lấy text theo key
  // namespace "auth" tương ứng với file vi.json / en.json
  const { t } = useTranslation('auth')

  // Lấy mảng features từ file dịch
  // returnObjects: true để trả về array thay vì string
  const features = t('banner.features', { returnObjects: true })

  return (
    <div className="auth-banner">

      {/* Grid overlay trang trí */}
      <div className="auth-banner__grid-overlay" />

      <div className="auth-banner__content">

        {/* Logo */}
        <div className="auth-banner__logo">
          <div className="auth-banner__logo-icon">
            <MdOutlineRadar size={22} color="#ffffff" />
          </div>
          {/* Lấy tên app từ file dịch */}
          <span className="auth-banner__logo-text">
            {t('banner.logoText')}
          </span>
        </div>

        {/* Tiêu đề: phần heading + highlight tách riêng để style khác màu */}
        <h1 className="auth-banner__heading">
          {t('banner.heading')}{' '}
          <span className="auth-banner__heading-highlight">
            {t('banner.headingHighlight')}
          </span>
        </h1>

        {/* Mô tả ngắn */}
        <p className="auth-banner__description">
          {t('banner.description')}
        </p>

        {/* Danh sách tính năng lấy từ mảng trong file dịch */}
        <ul className="auth-banner__features">
          {features.map((feature, index) => (
            <li key={index} className="auth-banner__feature-item">
              <AiOutlineCheck
                className="auth-banner__feature-icon"
                size={16}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}

export default AuthBanner