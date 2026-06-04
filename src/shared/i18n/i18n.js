import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import file dịch của từng feature
import authVI from '../../features/auth/locales/vi.json'
import authEN from '../../features/auth/locales/en.json'

// Cấu hình i18n cho toàn app
i18n
  .use(initReactI18next) // Kết nối i18n với React
  .init({
    resources: {
      vi: {
        auth: authVI, // Namespace "auth" cho tiếng Việt
      },
      en: {
        auth: authEN, // Namespace "auth" cho tiếng Anh
      },
    },
    lng: 'vi',           // Ngôn ngữ mặc định là tiếng Việt
    fallbackLng: 'en',   // Nếu không tìm thấy key thì fallback sang tiếng Anh
    interpolation: {
      escapeValue: false, // React đã tự escape XSS rồi, không cần escape thêm
    },
  })

export default i18n