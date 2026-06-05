import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function AuthRequiredModal({ show, onHide }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onHide();
    navigate('/login');
  };

  const handleRegisterClick = () => {
    onHide();
    navigate('/register');
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="journal-dark-card border-0 text-start"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <Modal.Header 
        closeButton 
        closeVariant="white"
        className="border-0 pb-0"
        style={{ backgroundColor: '#0e1322' }}
      >
        <Modal.Title className="font-display fw-bold text-white d-flex align-items-center gap-2" style={{ fontSize: '1.25rem' }}>
          <Icon icon="lucide:shield-alert" className="text-warning" width="22" />
          Yêu cầu đăng nhập
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="py-4" style={{ backgroundColor: '#0e1322', color: '#cbd5e1' }}>
        <p className="mb-0" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
          Bạn cần đăng nhập để sử dụng tính năng theo dõi tạp chí hoặc lưu vào danh mục dự án cá nhân.
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0" style={{ backgroundColor: '#0e1322', gap: '8px' }}>
        <Button 
          variant="dark" 
          onClick={onHide}
          style={{ 
            backgroundColor: '#161c2e', 
            border: '1px solid rgba(255,255,255,0.06)', 
            color: '#cbd5e1',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          Đóng
        </Button>

        <Button 
          variant="outline-info" 
          onClick={handleRegisterClick}
          style={{ 
            borderRadius: '6px', 
            fontSize: '0.9rem', 
            fontWeight: 600,
            border: '1px solid rgba(0, 210, 255, 0.4)'
          }}
        >
          Đăng ký
        </Button>

        <Button 
          onClick={handleLoginClick}
          className="btn-primary-glow border-0"
          style={{ 
            borderRadius: '6px', 
            fontSize: '0.9rem', 
            fontWeight: 600 
          }}
        >
          Đăng nhập
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
