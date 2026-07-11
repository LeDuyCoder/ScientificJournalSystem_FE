import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated as checkAuthStatus } from "../../shared/utils/auth";
import { getDefaultLang } from "./languageRouting";
const ProtectedRoute = () => {
  const {
    t
  } = useTranslation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [loading, setLoading] = useState(true);
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
  const lang = getDefaultLang();
  return isAuthenticated ? <Outlet /> : <Navigate to={`/${lang}/login`} replace />;
};
export default ProtectedRoute;