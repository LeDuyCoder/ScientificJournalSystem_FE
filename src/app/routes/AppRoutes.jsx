import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ROUTES from './routePaths'
import SignUpPage from '../../features/auth/pages/SignUpPage'

// File định nghĩa toàn bộ route của app
// Tất cả route đều đăng ký tại đây, không đăng ký rải rác ở component khác
// Sau này thêm feature mới thì import page vào đây và thêm Route
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect từ "/" về "/sign-up" tạm thời, sau đổi về dashboard */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SIGN_UP} replace />} />

        {/* Auth routes */}
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />

        {/* Các route khác sẽ thêm vào đây sau khi có feature */}
        {/* <Route path={ROUTES.LOGIN} element={<LoginPage />} /> */}
        {/* <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes