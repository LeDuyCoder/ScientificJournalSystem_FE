import { Icon } from "@iconify/react";

const AuthBanner = () => {
  return (
    <div className="auth-banner-container w-100 h-100 d-flex align-items-center justify-content-center p-5 min-vh-100">
      {/* Decorative Glow Spots */}
      <div className="auth-glow-spot glow-top-left"></div>
      <div className="auth-glow-spot glow-bottom-right"></div>

      <div className="auth-banner-content w-100">
        {/* Logo */}
        <div className="d-flex align-items-center gap-2 mb-5">
          <div className="d-flex align-items-center justify-content-center rounded" style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)" }}>
            <Icon icon="solar:pulse-bold" className="text-white fs-5" />
          </div>
          <span className="text-white fw-bold fs-5" style={{ letterSpacing: "-0.02em" }}>ResearchPulse</span>
        </div>

        {/* Stats Grid */}
        <div className="d-flex flex-column gap-4 my-5">
          <div>
            <h2 className="fw-bold text-info m-0" style={{ color: "#00C6FF", fontSize: "2.5rem", letterSpacing: "-0.02em" }}>200M+</h2>
            <p className="text-secondary m-0 mt-1" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Bài báo khoa học</p>
          </div>
          <div>
            <h2 className="fw-bold text-info m-0" style={{ color: "#00C6FF", fontSize: "2.5rem", letterSpacing: "-0.02em" }}>48K+</h2>
            <p className="text-secondary m-0 mt-1" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Keywords đang theo dõi</p>
          </div>
          <div>
            <h2 className="fw-bold text-info m-0" style={{ color: "#00C6FF", fontSize: "2.5rem", letterSpacing: "-0.02em" }}>2019-2024</h2>
            <p className="text-secondary m-0 mt-1" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Dữ liệu 5 năm liên tục</p>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="pt-4 border-top border-secondary border-opacity-10 mt-5" style={{ maxWidth: "440px" }}>
          <p className="text-secondary m-0 fst-italic" style={{ fontSize: "0.85rem", lineHeight: "1.6", color: "var(--text-secondary)" }}>
            *ResearchPulse giúp tôi nắm bắt xu hướng nghiên cứu nhanh hơn bao giờ hết.*
          </p>
          <p className="text-muted m-0 mt-2" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            — Sinh viên nghiên cứu, FPT University
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;