import { useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import ProgressBar from "../components/ProgressBar";
import "./ActivationSuccess.css";

function ActivationSuccess() {
  const INITIAL_TIME = 5;
  const [countdown, setCountdown] = useState(INITIAL_TIME);

  useEffect(() => {
    if (countdown === 0) {
      // TODO: navigate("/dashboard");
      console.log("Redirect dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const progress =
    ((INITIAL_TIME - countdown) / INITIAL_TIME) * 100;

  return (
    <div className="success-page">
      <div className="logo">
        <div className="logo-icon"></div>
        <h4>ResearchPulse</h4>
      </div>

      <div className="success-card">
        <div className="success-icon">
          <BsCheckLg />
        </div>

        <h2>Kích hoạt tài khoản thành công</h2>

        <p className="description">
          Tài khoản của bạn đã được kích hoạt thành công trên hệ thống
          ResearchPulse. Bây giờ bạn có thể truy cập đầy đủ các tính năng.
        </p>

        {countdown > 0 && (
          <p className="countdown">
            Tự động chuyển hướng sau{" "}
            <span>{countdown}</span> giây...
          </p>
        )}

        <ProgressBar progress={progress} />

        <button className="btn dashboard-btn">
          Đi đến Dashboard
        </button>

        <button className="btn home-btn">
          Về trang chủ
        </button>
      </div>

      <p className="support">
        Hỗ trợ kỹ thuật?
        <a href="/"> Liên hệ chúng tôi</a>
      </p>
    </div>
  );
}

export default ActivationSuccess;