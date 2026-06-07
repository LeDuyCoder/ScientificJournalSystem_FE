import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../shared/utils/auth";
import LandingPage from "../../features/landing/pages/LandingPage";

export default function HomeRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}