// httpClient.js
// Axios instance dùng chung cho toàn bộ dự án.
// Tất cả API call đều đi qua đây — không ai gọi axios trực tiếp.

import axios from 'axios';

const httpClient = axios.create({
  // Đọc base URL từ biến môi trường, không hardcode localhost
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // Timeout 10 giây — tránh treo request mãi mãi
  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
// Tự động đính kèm token vào header mỗi request (nếu có)
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────
// Xử lý lỗi chung — ví dụ 401 thì redirect về login
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Có thể mở rộng thêm sau: toast lỗi, refresh token, v.v.
    return Promise.reject(error);
  }
);

export default httpClient;