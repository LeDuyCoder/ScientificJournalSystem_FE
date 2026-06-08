/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: app\routes\PublicRoute.jsx
 */
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../shared/utils/auth";

const PublicRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setIsAuth(result);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  // 🔥 Nếu đã đăng nhập thành công -> Đá ngược về dashboard, không cho xem trang login nữa
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;