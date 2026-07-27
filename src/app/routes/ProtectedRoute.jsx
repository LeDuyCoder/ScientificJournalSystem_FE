import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated as checkAuthStatus } from "../../shared/utils/auth";
import { getDefaultLang } from "./languageRouting";
const ProtectedRoute = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const lang = getDefaultLang();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkAuthStatus();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  
  if (loading) return <div>{t("common.dangKiemTraQuyenTruyCap")}</div>;
  
  return isAuthenticated ? <Outlet /> : <Navigate to={{pathname: '/' + lang + '/login'}} state={{ from: location }} replace />;
};
export default ProtectedRoute;
