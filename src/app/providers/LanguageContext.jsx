import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

// Translation object for login page and other UI elements
export const translations = {
  en: {
    // Login Form
    login_title: "Sign In",
    login_subtitle: "Welcome back! Please enter your details.",
    email_label: "Email",
    password_label: "Password",
    email_placeholder: "name@email.com",
    password_placeholder: "Enter password",
    remember_me: "Remember me",
    forgot_password: "Forgot password?",
    sign_in_button: "Sign In",
    processing: "Processing...",
    no_account: "Don't have an account?",
    sign_up_free: "Sign up for free",

    // Error Messages
    email_required: "Email is required",
    email_invalid: "Email is invalid",
    password_required: "Password is required",
    password_min: "Password must be at least 6 characters",

    // API Messages
    login_success: "Sign in successful!",
    login_failed: "Sign in failed. Please check your information.",
    google_login_success: "Google sign in successful!",
    google_login_failed: "Google sign in failed.",

    // Language & Theme
    language: "Language",
    theme: "Theme",
    english: "English",
    vietnamese: "Vietnamese",
  },
  vi: {
    // Login Form
    login_title: "Đăng nhập",
    login_subtitle: "Chào mừng trở lại! Vui lòng nhập thông tin.",
    email_label: "Email",
    password_label: "Mật khẩu",
    email_placeholder: "name@email.com",
    password_placeholder: "Nhập mật khẩu",
    remember_me: "Ghi nhớ đăng nhập",
    forgot_password: "Quên mật khẩu?",
    sign_in_button: "Đăng nhập",
    processing: "Đang xử lý...",
    no_account: "Chưa có tài khoản?",
    sign_up_free: "Đăng ký miễn phí",

    // Error Messages
    email_required: "Email không được để trống",
    email_invalid: "Email không hợp lệ",
    password_required: "Mật khẩu không được để trống",
    password_min: "Mật khẩu phải có ít nhất 6 ký tự",

    // API Messages
    login_success: "Đăng nhập thành công!",
    login_failed: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
    google_login_success: "Đăng nhập bằng Google thành công!",
    google_login_failed: "Đăng nhập bằng Google thất bại.",

    // Language & Theme
    language: "Ngôn ngữ",
    theme: "Giao diện",
    english: "English",
    vietnamese: "Tiếng Việt",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("vi");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && ["en", "vi"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    } else {
      document.documentElement.lang = "vi";
    }
  }, []);

  const changeLanguage = (lang) => {
    if (["en", "vi"].includes(lang)) {
      setLanguage(lang);
      localStorage.setItem("language", lang);
      document.documentElement.lang = lang;
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.vi[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
