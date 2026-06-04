import { useTranslation } from 'react-i18next'
import './FormDivider.css'

const FormDivider = () => {
  // Lấy text "HOẶC" / "OR" từ file dịch
  const { t } = useTranslation('auth')

  return (
    <div className="form-divider">
      <div className="form-divider__line" />
      <span className="form-divider__text">{t('signUp.divider')}</span>
      <div className="form-divider__line" />
    </div>
  )
}

export default FormDivider