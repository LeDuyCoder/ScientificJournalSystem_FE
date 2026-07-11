import { useTranslation } from "react-i18next";
import { t } from "i18next";
import React, { useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { useJournalManagement } from '../../../journal/hooks/useJournalManagement';
import PrimaryButton from '../../../../shared/components/Button/PrimaryButton';

/**
 * Component CreateIssueModal - Cửa sổ Modal bật lên để Admin thêm Số phát hành (Issue) mới vào Volume đang chọn.
 * Khớp hoàn toàn với thiết kế Figma Hình 7.
 */
export default function CreateIssueModal({
  show,
  handleClose
}) {
  const { t: _t } = useTranslation();
  const {
    createIssue
  } = useJournalManagement();

  // Khởi tạo state cho Form dữ liệu Số phát hành
  const [formData, setFormData] = useState({
    issueName: '',
    issueNumber: '1',
    publicationYear: '2024'
  });

  // Quản lý thông báo lỗi validate dữ liệu bắt buộc điền
  const [errors, setErrors] = useState({});

  /** Theo dõi thay đổi chữ trong form */
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /** Hàm thực hiện bắt lỗi dữ liệu bỏ trống */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.issueName.trim()) {
      newErrors.issueName = t("admin.tenIssueKhongDuocDeTrong");
    }
    if (!formData.issueNumber.toString().trim()) {
      newErrors.issueNumber = t("admin.soIssueKhongDuocDeTrong");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Xử lý nhấn nút Tạo Issue */
  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert issue number to format "No. X" if it is just a number
    let formattedNumber = formData.issueNumber;
    if (!isNaN(formData.issueNumber)) {
      formattedNumber = `No. ${formData.issueNumber}`;
    }
    createIssue({
      issueName: formData.issueName,
      issueNumber: formattedNumber,
      publicationYear: parseInt(formData.publicationYear, 10),
      status: 'Scheduled'
    });

    // Clean form và đóng pop-up
    setFormData({
      issueName: '',
      issueNumber: '1',
      publicationYear: '2024'
    });
    handleClose();
  };
  return <Modal show={show} onHide={handleClose} centered backdrop="static" className="text-main">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="font-display fw-bold h5 text-main">{t("admin.taoIssueMoi")}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-3 text-start">
          <p className="text-muted-custom small mb-3">{t("admin.dienThongTinChiTietDeBatDauMot")}</p>
          
          {/* Tên Issue */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium small text-main">{t("admin.tenIssue")}<span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="issueName" value={formData.issueName} onChange={handleChange} isInvalid={!!errors.issueName} placeholder={t("admin.viDuSpecialEditionOnAi")} />
            <Form.Control.Feedback type="invalid">{errors.issueName}</Form.Control.Feedback>
          </Form.Group>

          <Row className="g-3 mb-0">
            {/* Số Issue */}
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">{t("admin.soIssue")}<span className="text-danger">*</span></Form.Label>
                <Form.Control type="number" name="issueNumber" value={formData.issueNumber} onChange={handleChange} isInvalid={!!errors.issueNumber} placeholder={t("admin.viDu1")} />
                <Form.Control.Feedback type="invalid">{errors.issueNumber}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Năm xuất bản */}
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">{t("admin.namXuatBan")}</Form.Label>
                <Form.Control type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} placeholder={t("admin.2024")} />
              </Form.Group>
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0">
          <PrimaryButton variant="outline" onClick={handleClose} className="px-3">{t("admin.huy")}</PrimaryButton>
          <PrimaryButton type="submit" className="px-3">{t("admin.taoIssue")}</PrimaryButton>
        </Modal.Footer>
      </Form>
    </Modal>;
}