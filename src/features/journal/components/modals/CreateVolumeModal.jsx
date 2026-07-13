import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import PrimaryButton from '../../../../shared/components/Button/PrimaryButton';
import { useJournalManagement } from '../../hooks/useJournalManagement';

/**
 * Component CreateVolumeModal - Cửa sổ Modal bật lên để Admin tạo Tập (Volume) mới.
 * Đáp ứng Issue #76: Các trường gồm Volume number, Publication year, Frequency, Description.
 */
export default function CreateVolumeModal({
  show,
  handleClose
}) {
  const { t: _t } = useTranslation();
  const {
    createVolume
  } = useJournalManagement();

  // Trạng thái quản lý dữ liệu nhập vào của Form
  const [formData, setFormData] = useState({
    volumeNumber: '',
    publicationYear: new Date().getFullYear(),
    frequency: 'Quarterly',
    description: ''
  });

  // Quản lý thông báo hiển thị lỗi validate chữ đỏ
  const [errors, setErrors] = useState({});

  /** Xử lý cập nhật text liên tục khi gõ */
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

  /** Kiểm tra dữ liệu Form hợp lệ trước khi submit */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.volumeNumber.trim()) newErrors.volumeNumber = t("journal.soHieuVolumeKhongDuocTrongViDu");
    if (!formData.publicationYear) newErrors.publicationYear = t("journal.namXuatBanKhongDuocTrong");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Xử lý lưu mảng dữ liệu cục bộ */
  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;
    createVolume({
      volumeNumber: formData.volumeNumber,
      publicationYear: parseInt(formData.publicationYear),
      frequency: formData.frequency,
      description: formData.description
    });

    // Reset sạch form và đóng modal
    setFormData({
      volumeNumber: '',
      publicationYear: new Date().getFullYear(),
      frequency: 'Quarterly',
      description: ''
    });
    handleClose();
  };
  return <Modal show={show} onHide={handleClose} centered backdrop="static" className="text-main">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="font-display fw-bold h5 text-main">{t("journal.taoTapMoiCreateNewVolume")}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-3 text-start">
          
          {/* Số hiệu Volume */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium small text-main">{t("journal.soVolumeVolumeNumber")}<span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="volumeNumber" value={formData.volumeNumber} onChange={handleChange} isInvalid={!!errors.volumeNumber} placeholder={t("journal.viDuVolume3Volume4")} />
            <Form.Control.Feedback type="invalid">{errors.volumeNumber}</Form.Control.Feedback>
          </Form.Group>

          <Row className="g-3 mb-3">
            {/* Năm xuất bản */}
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">{t("journal.namXuatBanPublicationYear")}<span className="text-danger">*</span></Form.Label>
                <Form.Control type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} isInvalid={!!errors.publicationYear} />
                <Form.Control.Feedback type="invalid">{errors.publicationYear}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Tần suất ra số */}
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">{t("journal.tanSuatXuatBanFrequency")}</Form.Label>
                <Form.Select name="frequency" value={formData.frequency} onChange={handleChange}>
                  <option value="Quarterly">{t("journal.hangQuyQuarterly")}</option>
                  <option value="Bi-annual">{t("journal.nuaNamMotLanBiannual")}</option>
                  <option value="Annual">{t("journal.hangNamAnnual")}</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Ghi chú nội bộ */}
          <Form.Group className="mb-0">
            <Form.Label className="fw-medium small text-main">{t("journal.moTaGhiChuNoiBoInternalNotes")}</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} placeholder={t("journal.nhapCacGhiChuHoacMoTaNganGonVe")} />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0">
          <PrimaryButton variant="outline" onClick={handleClose}>{t("admin.huy")}</PrimaryButton>
          <PrimaryButton type="submit">{t("journal.taoVolume")}</PrimaryButton>
        </Modal.Footer>
      </Form>
    </Modal>;
}