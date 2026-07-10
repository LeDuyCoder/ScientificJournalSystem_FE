import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\components\LoginRequiredModal.jsx
 */
import { Modal, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
export default function LoginRequiredModal({
  show,
  onHide
}) {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const handleLogin = () => {
    onHide();
    navigate('/login');
  };
  const handleRegister = () => {
    onHide();
    navigate('/register');
  };
  return <Modal show={show} onHide={onHide} centered contentClassName="border-0 shadow-lg" style={{
    backdropFilter: 'blur(4px)'
  }}>
      <div className="p-4 text-center rounded-3 bg-white" style={{
      border: '1px solid var(--border)'
    }}>
        {/* Header Icon */}
        <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        border: '1px solid rgba(255, 122, 51, 0.2)'
      }}>
          <Icon icon="lucide:lock" className="text-primary" width="30" />
        </div>

        {/* Modal Title */}
        <h4 className="font-display fw-bold text-main mb-2">{t("article.dangNhapDeLuuBaiBao")}</h4>
        
        {/* Modal Content */}
        <p className="text-muted-custom text-sm mb-4 leading-relaxed" style={{
        fontSize: '0.9rem'
      }}>{t("article.banCanDangNhapTaiKhoanResearch")}</p>

        {/* Buttons Grid */}
        <div className="d-flex flex-column gap-2">
          <PrimaryButton className="w-100" onClick={handleLogin}>{t("article.dangNhapNgay")}</PrimaryButton>
          
          <PrimaryButton variant="outline" className="w-100" onClick={handleRegister}>{t("article.dangKyTaiKhoan")}</PrimaryButton>

          <Button variant="link" className="w-full text-muted-custom hover:text-dark text-xs mt-1 p-0 text-decoration-none font-semibold" onClick={onHide}>{t("article.dongCuaSo")}</Button>
        </div>
      </div>
    </Modal>;
}