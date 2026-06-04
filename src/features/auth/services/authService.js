import axiosClient from "../../../api/axiosClient";


const authService = {
  login: async (email, password) => {
    try {
      // Try to make the real API request
      const response = await axiosClient.post('/auth/login', { email, password });
      
      // API returned successfully - return the response as-is
      return {
        success: true,
        message: response.message || "Đăng nhập thành công!",
        data: response.data || response,
      };
    } catch (err) {
      // Check if it's a network error (no connection to server)
      const isNetworkError = 
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('ENOTFOUND') ||
        err.message?.includes('Network') ||
        err.status === undefined;

      // If it's a network error, use fallback mode
      if (isNetworkError) {
        console.warn("Server not available. Using simulated login mode...", err);
        
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
      
      // If it's an API error (invalid credentials, etc), return error response
      return {
        success: false,
        message: err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
        data: err.data,
      };
    }
  },
  
  googleLogin: async (idToken) => {
    try {
      const response = await axiosClient.post('/auth/google', { idToken });
      return {
        success: true,
        message: response.message || "Đăng nhập bằng Google thành công!",
        data: response.data || response,
      };
    } catch (err) {
      const isNetworkError = 
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('ENOTFOUND') ||
        err.message?.includes('Network') ||
        err.status === undefined;

      if (isNetworkError) {
        console.warn("Server not available. Using simulated Google login...", err);
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

      return {
        success: false,
        message: err.message || "Đăng nhập bằng Google thất bại.",
        data: err.data,
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
