import { useEffect } from "react";
import AuthBanner from "../components/AuthBanner";
import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  useEffect(() => {
    document.title = "Đăng nhập | ResearchPulse";
  }, []);

  return (
    <div className="container-fluid p-0 overflow-hidden">
      <div className="row g-0 min-vh-100">
        
        {/* LEFT BANNER (Hidden on Mobile/Tablet < lg breakpoint) */}
        <div className="col-lg-6 d-none d-lg-flex p-0 align-items-center justify-content-center">
          <AuthBanner />
        </div>

        {/* RIGHT FORM (Full width on smaller screens, 50% on desktop) */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center auth-form-container px-4 py-5">
          <div className="w-100" style={{ maxWidth: "440px" }}>
            <LoginForm />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;