import httpClient from '../../../shared/services/httpClient'

// API layer: chỉ xử lý gọi HTTP, không chứa logic nghiệp vụ
// Dùng httpClient thay vì axios trực tiếp để dùng chung base URL và interceptor
export const registerApi = async (userData) => {
  try {
    const response = await httpClient.post('/api/v1/auth/register', userData)
    return response.data
  } catch (error) {
    // Chuẩn hóa error format để hook xử lý nhất quán
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || 'Lỗi server',
    }
  }
}