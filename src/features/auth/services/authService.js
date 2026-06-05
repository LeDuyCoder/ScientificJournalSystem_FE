import { registerApi } from '../api/authApi'

// Service layer cho auth feature
// Đứng giữa hook và api, xử lý logic nghiệp vụ nhẹ như map data
// Hook gọi service, service gọi api — không để hook gọi api trực tiếp
const authService = {

  // Đăng ký tài khoản mới
  // Nhận formData từ hook, map sang format BE yêu cầu rồi gọi api
  register: async (formData) => {
    return await registerApi({
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName, // Map camelCase → snake_case cho BE
      last_name: formData.lastName,
    })
  },

}

export default authService