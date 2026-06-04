import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import authService from "../services/authService";
import SocialAuthButton from "./SocialAuthButton";
import { loginSchema } from "../validations/loginSchema";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleCredentialResponse = async (response) => {
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const idToken = response.credential;
      const result = await authService.googleLogin(idToken);
      if (result && result.success) {
        setSuccessMsg(result.message || "Đăng nhập bằng Google thành công!");
        
        // Save token and user details to localStorage
        if (result.data) {
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
        }
      } else {
        setErrorMsg(result.message || "Đăng nhập bằng Google thất bại.");
      }
    } catch (err) {
      console.error("Google Login error:", err);
      setErrorMsg(err.message || "Đăng nhập bằng Google thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleInitGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "507803783351-bj5gvnsud9cl3k71r53j47bqo9tq50u3.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          {
            theme: "filled_blue",
            size: "large",
            width: "392",
            text: "continue_with",
            shape: "rectangular",
          }
        );
      }
    };

    // Load Google GSI client script if not already present
    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client?hl=vi";
      script.async = true;
      script.defer = true;
      script.onload = handleInitGoogle;
      document.body.appendChild(script);
    } else {
      handleInitGoogle();
    }
  }, []);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await authService.login(data.email, data.password);
      if (response && response.success) {
        setSuccessMsg(response.message || "Đăng nhập thành công!");
        
        // Save token and user details to localStorage
        if (response.data) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        reset({ email: "", password: "", rememberMe: false });
      } else {
        setErrorMsg(response.message || "Đăng nhập không thành công.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="auth-form-title mb-1">Đăng nhập</h2>
        <p className="auth-form-subtitle mb-4">Chào mừng trở lại! Vui lòng nhập thông tin.</p>
      </div>

      {/* SUCCESS ALERTS */}
      {successMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4 bg-success bg-opacity-10 border-success border-opacity-20 text-success py-2 px-3 rounded">
          <Icon icon="lucide:check-circle" />
          <span className="small">{successMsg}</span>
        </div>
      )}

      {/* ERROR ALERTS */}
      {errorMsg && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger py-2 px-3 rounded">
          <Icon icon="lucide:alert-circle" />
          <span className="small">{errorMsg}</span>
        </div>
      )}

      {/* SOCIAL LOGIN */}
      <div className="mb-4 position-relative" style={{ height: "40px" }}>
        {/* Invisible Google official button iframe on top to capture clicks */}
        <div
          id="google-signin-btn"
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ opacity: 0, zIndex: 10, cursor: "pointer", overflow: "hidden" }}
        ></div>
        {/* Custom Styled SocialAuthButton underneath */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1 }}>
          <SocialAuthButton disabled={isLoading} />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="divider-container">
        <div className="divider-line"></div>
        <span className="divider-text">HOẶC</span>
        <div className="divider-line"></div>
      </div>

      {/* LOGIN FORM */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* EMAIL */}
        <div className="form-group">
          <label htmlFor="email" className="form-label-custom">
            Email <span className="text-danger">*</span>
          </label>
          <div className="input-wrapper">
            <span className="input-icon-left">
              <Icon icon="lucide:mail" width="18" height="18" style={{ color: "#9CA3AF" }} />
            </span>
            <input
              id="email"
              type="email"
              placeholder="name@email.com"
              disabled={isLoading}
              className={`input-custom input-custom-has-icon ${errors.email ? "is-invalid-custom" : ""}`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <div className="invalid-feedback-custom">
              <Icon icon="lucide:alert-circle" width="14" height="14" />
              <span>{errors.email.message}</span>
            </div>
          )}
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label htmlFor="password" className="form-label-custom m-0">
              Mật khẩu <span className="text-danger">*</span>
            </label>
            <a href="#" className="action-link" style={{ fontSize: "0.825rem" }}>
              Quên mật khẩu?
            </a>
          </div>
          <div className="input-wrapper">
            <span className="input-icon-left">
              <Icon icon="lucide:lock" width="18" height="18" style={{ color: "#FBBF24" }} />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
              className={`input-custom input-custom-has-icon input-custom-password ${
                errors.password ? "is-invalid-custom" : ""
              }`}
              {...register("password")}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                width="18"
                height="18"
              />
            </button>
          </div>
          {errors.password && (
            <div className="invalid-feedback-custom">
              <Icon icon="lucide:alert-circle" width="14" height="14" />
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        {/* ADDITIONAL ACTIONS */}
        <div className="mb-4">
          <label className="action-check-label">
            <input
              type="checkbox"
              className="action-checkbox"
              disabled={isLoading}
              {...register("rememberMe")}
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>
        </div>

        {/* MAIN SUBMIT BUTTON */}
        <button type="submit" disabled={isLoading} className="btn-submit">
          {isLoading ? (
            <>
              <div className="spinner-custom"></div>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <span>Đăng nhập</span>
            </>
          )}
        </button>
      </form>

      {/* BOTTOM SECTION */}
      <div className="text-center mt-4">
        <p className="auth-footer-text m-0">
          Chưa có tài khoản?{" "}
          <a href="#" className="action-link fw-semibold ms-1">
            Đăng ký miễn phí
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;