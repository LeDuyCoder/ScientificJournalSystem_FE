import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\components\AuthRequiredModal.jsx
 */
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import PrimaryButton from './Button/PrimaryButton';
export default function AuthRequiredModal({
  show,
  onHide
}) {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const handleLoginClick = () => {
    onHide();
    navigate('/login');
  };
  const handleRegisterClick = () => {
    onHide();
    navigate('/register');
  };
  return <Modal show={show} onHide={onHide} centered contentClassName="border-0 text-start bg-white rounded-3 shadow" style={{
    backdropFilter: 'blur(4px)'
  }}>
      <Modal.Header closeButton className="border-0 pb-0" style={{
      backgroundColor: 'var(--bg-card)'
    }}>
        <Modal.Title className="font-display fw-bold text-main d-flex align-items-center gap-2" style={{
        fontSize: '1.25rem'
      }}>
          <Icon icon="lucide:shield-alert" className="text-warning" width="22" />{t("common.yeuCauDangNhap")}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-4" style={{
      backgroundColor: 'var(--bg-card)',
      color: 'var(--text-main)'
    }}>
        <p className="mb-0" style={{
        fontSize: '1rem',
        lineHeight: '1.5'
      }}>{t("common.banCanDangNhapDeSuDungTinhNang")}</p>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0" style={{
      backgroundColor: 'var(--bg-card)',
      gap: '8px'
    }}>

        <PrimaryButton variant="outline" onClick={handleRegisterClick}>{t("common.dangKy")}</PrimaryButton>

        <PrimaryButton onClick={handleLoginClick}>{t("signIn")}</PrimaryButton>
      </Modal.Footer>
    </Modal>;
}