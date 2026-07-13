import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Spinner } from 'react-bootstrap';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import { Icon } from '@iconify/react';

const InviteMemberModal = ({ show, onHide, onInvite, actionLoading }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    await onInvite(email, role);
    setEmail('');
    setRole('MEMBER');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-main">
          <Icon icon="lucide:user-plus" width="24" className="me-2 text-primary" />
          {t("project.moiThanhVienMoi", "Mời thành viên mới")}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="inviteEmail">
            <Form.Label className="small fw-medium text-muted-custom">{t("project.diaChiEmail", "Địa chỉ Email")}</Form.Label>
            <Form.Control 
              type="email" 
              placeholder={t("project.nhapEmailNguoiMuonMoi", "Nhập email người dùng...")} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-2"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="inviteRole">
            <Form.Label className="small fw-medium text-muted-custom">{t("project.vaiTro", "Quyền hạn")}</Form.Label>
            <Form.Select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="py-2"
            >
              <option value="VIEWER">Viewer ({t("project.nguoiXem", "Người xem")})</option>
              <option value="MEMBER">Member ({t("project.thanhVien", "Thành viên")})</option>
              <option value="ADMIN">Admin ({t("project.quanTriVien", "Quản trị viên")})</option>
              <option value="OWNER">Owner ({t("project.chuSoHuu", "Chủ sở hữu")})</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <PrimaryButton variant="outline" className="px-4" onClick={onHide} disabled={actionLoading}>
            {t("admin.huy", "Hủy")}
          </PrimaryButton>
          <PrimaryButton type="submit" className="px-4" disabled={!email || actionLoading}>
            {actionLoading ? <Spinner size="sm" /> : t("project.guiLoiMoi", "Gửi lời mời")}
          </PrimaryButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InviteMemberModal;
