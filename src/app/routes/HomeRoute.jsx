/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: app\routes\HomeRoute.jsx
 */
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../shared/utils/auth";
import LandingPage from "../../features/landing/pages/LandingPage";
import { useEffect, useState } from "react";

export default function HomeRoute() {
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

  return isAuth ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}