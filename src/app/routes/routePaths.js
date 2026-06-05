// File định nghĩa tất cả các đường dẫn route trong app
// Dùng chung cho toàn team, tránh hardcode string path ở nhiều nơi
// Ví dụ: thay vì viết '/sign-up' nhiều chỗ, chỉ cần ROUTES.SIGN_UP
const ROUTES = {
  // Auth routes
  SIGN_UP: '/sign-up',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Main routes (thêm sau khi có feature)
  DASHBOARD: '/dashboard',
  HOME: '/',
}

export default ROUTES