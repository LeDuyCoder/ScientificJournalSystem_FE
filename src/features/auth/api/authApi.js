// authApi.js
// Tập trung tất cả các API call liên quan đến auth.
// Chỉ gọi endpoint và trả về response, không chứa logic.

import httpClient from '../../../shared/services/httpClient';

// Đăng nhập bằng email/password
export const loginApi = (data) => {
  return httpClient.post('/auth/login', data);
};

// Đăng ký tài khoản mới
export const registerApi = (data) => {
  return httpClient.post('/auth/register', data);
};

// Lấy thông tin profile người dùng hiện tại
export const getProfileApi = () => {
  return httpClient.get('/auth/profile');
};

// Đăng nhập bằng Google
export const loginGoogleApi = (idToken) => {
  return httpClient.post('/auth/google', { idToken });
};

// Cập nhật thông tin profile
export const updateProfileApi = (data) => {
  return httpClient.put('/auth/profile', data);
};

// Xóa tài khoản
export const deleteAccountApi = () => {
  return httpClient.delete('/auth/account');
};

// Xác thực kích hoạt tài khoản qua email
// GET /api/v1/auth/verify?token=<activation_token>
export const verifyAccountApi = (token) => {
  return httpClient.get('/auth/verify', { params: { token } });
};

// Default export gom tất cả — dùng trong useVerifyAccount
const authApi = {
  verifyAccount: verifyAccountApi,
};

export default authApi;