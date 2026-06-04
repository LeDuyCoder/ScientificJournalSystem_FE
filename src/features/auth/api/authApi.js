import axios from 'axios'

// Base URL lấy từ biến môi trường, tránh hardcode URL
const BASE_URL = import.meta.env.VITE_API_URL

// Hàm gọi API đăng ký tài khoản mới
// Nhận vào object: { email, password, first_name, last_name }
// Trả về data nếu thành công, throw error nếu thất bại
export const registerApi = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/register`,
      userData
    )
    // Trả về data từ response (201 thành công)
    return response.data

  } catch (error) {
    // Lấy thông tin lỗi từ response của BE
    const err = error.response?.data
    throw {
      status: error.response?.status,          // HTTP status code (400, 409, 500...)
      message: err?.message || 'Lỗi server',   // Message lỗi từ BE
    }
  }
}