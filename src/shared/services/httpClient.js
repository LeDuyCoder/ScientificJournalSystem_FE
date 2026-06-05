import axios from 'axios'

// Axios instance dùng chung cho toàn bộ app
// Tất cả API call đều đi qua đây, không dùng axios trực tiếp
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Lấy từ .env, không hardcode URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: tự động đính kèm token vào header trước khi gửi request
// Sau này khi có login, token sẽ được lấy từ authStore và gắn vào đây
httpClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage nếu có
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: xử lý lỗi tập trung
// Tất cả lỗi từ BE đều đi qua đây trước khi về hook
httpClient.interceptors.response.use(
  (response) => response, // Thành công thì trả về nguyên xi
  (error) => {
    // Lỗi 401: token hết hạn hoặc chưa đăng nhập
    if (error.response?.status === 401) {
      localStorage.removeItem('token') // Xóa token cũ
      window.location.href = '/login'  // Redirect về trang login
    }
    return Promise.reject(error)
  }
)

export default httpClient