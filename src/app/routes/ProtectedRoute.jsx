import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../shared/utils/auth";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = () => {
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

  console.log(useAuthStore.getState());
  console.log(useUserStore.getState());

  if (loading) return <div>Đang kiểm tra quyền truy cập...</div>;

  // 🔥 THAY CHILDREN THÀNH OUTLET: 
  // Nếu hợp lệ thì cho phép hiển thị các Route con nằm trong Layout này
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;