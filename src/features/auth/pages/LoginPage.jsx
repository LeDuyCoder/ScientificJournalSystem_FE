import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../../../app/layouts/AuthLayout';
import AuthBanner from '../components/AuthBanner';
import LoginForm from '../components/LoginForm';
import SocialAuthButton from '../components/SocialAuthButton';
import Icon from '../../../shared/components/Icon';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to original page or dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLoginSubmit = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(payload.email, payload.password);
      // Redirect on success
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    alert('Đăng nhập bằng Google OAuth đang được cấu hình.');
  };

  return (
    <AuthLayout banner={<AuthBanner />}>
      <div className="mb-4">
        <h2 className="font-display fw-bold mb-1" style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>
          Đăng nhập
        </h2>
        <p className="text-muted-custom text-sm mb-0" style={{ color: 'var(--text-muted) !important' }}>
          Chào mừng trở lại! Vui lòng nhập thông tin đăng nhập của bạn.
        </p>
      </div>

      {/* Google Button */}
      <div className="mb-4">
        <SocialAuthButton onClick={handleGoogleAuth} disabled={isLoading} />
      </div>

      {/* Divider */}
      <div className="d-flex align-items-center justify-content-center mb-4 text-xs font-semibold select-none text-muted-custom" style={{ color: 'var(--text-muted) !important' }}>
        <div className="w-100" style={{ height: '1px', background: 'var(--border)' }} />
        <span className="px-3 text-nowrap" style={{ letterSpacing: '0.05em' }}>HOẶC</span>
        <div className="w-100" style={{ height: '1px', background: 'var(--border)' }} />
      </div>

      {/* Login Form */}
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        apiError={error}
      />

      {/* Redirect to Register */}
      <div className="text-center mt-4 text-sm font-medium">
        <span className="text-muted-custom" style={{ color: '#94a3b8 !important' }}>Chưa có tài khoản? </span>
        <Link to="/register" className="text-decoration-none" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          Đăng ký miễn phí
        </Link>
      </div>
    </AuthLayout>
  );
}
