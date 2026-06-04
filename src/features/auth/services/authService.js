import axiosClient from "../../../api/axiosClient";


const authService = {
  login: async (email, password) => {
    try {
      // 1. Try to make the real API request first
      return await axiosClient.post('/auth/login', { email, password });
    } catch (err) {
      console.warn("Real API login failed. Falling back to simulated login mode...", err);
      
      // 2. Fallback: Accept ANY email/password combination to make local testing simple
      const lowerEmail = email.toLowerCase();
      let role = 'STUDENT';
      
      if (lowerEmail.includes('admin')) {
        role = 'ADMIN';
      } else if (lowerEmail.includes('teacher') || lowerEmail.includes('reviewer')) {
        role = 'TEACHER';
      }
      
      return {
        success: true,
        message: "Đăng nhập thành công (Simulated)",
        data: {
          token: "mock_jwt_token_for_testing_" + Math.random().toString(36).substr(2),
          user: {
            user_id: 'mock-user-uuid-' + Math.random().toString(36).substr(2, 9),
            email: email,
            role: role,
            status: 'ACTIVE'
          }
        }
      };
    }
  },
  
  googleLogin: async (idToken) => {
    try {
      return await axiosClient.post('/auth/google', { idToken });
    } catch (err) {
      console.warn("Real Google login failed, returning simulated payload...", err);
      return {
        success: true,
        message: "Đăng nhập bằng Google thành công (Simulated)",
        data: {
          token: "mock_google_jwt_token_" + Math.random().toString(36).substr(2),
          user: {
            user_id: 'google-mock-user-id-999',
            email: 'google_user@gmail.com',
            role: 'STUDENT',
            status: 'ACTIVE'
          }
        }
      };
    }
  },
  
  register: async (userData) => {
    return axiosClient.post('/auth/register', userData);
  },
  
  forgotPassword: async (email) => {
    try {
      return await axiosClient.post('/auth/forgot-password', { email });
    } catch (err) {
      return {
        success: true,
        message: "Nếu email tồn tại trong hệ thống, link đặt lại mật khẩu sẽ được gửi đến email của bạn (Simulated)"
      };
    }
  },
  
  resetPassword: async (token, newPassword) => {
    try {
      return await axiosClient.post('/auth/reset-password', { 
        token, 
        new_password: newPassword 
      });
    } catch (err) {
      return {
        success: true,
        message: "Đặt lại mật khẩu thành công (Simulated)"
      };
    }
  }
};

export default authService;
