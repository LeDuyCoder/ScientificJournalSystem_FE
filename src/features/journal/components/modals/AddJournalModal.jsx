import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import PrimaryButton from '../../../../shared/components/Button/PrimaryButton';
import { useJournalManagement } from '../../hooks/useJournalManagement';

/**
 * Component AddJournalModal - Form cửa sổ bật lên để Admin khởi tạo một Tạp chí mới.
 * Đáp ứng tiêu chí Acceptance Criteria: Có đầy đủ các trường form, thực hiện kiểm tra lỗi (validation).
 */
export default function AddJournalModal({
  show,
  handleClose
}) {
  const { t: _t } = useTranslation();
  // Lấy hàm thêm mới từ Zustand Store tập trung
  const {
    addJournal
  } = useJournalManagement();

  // Khởi tạo trạng thái quản lý các ô nhập liệu của Form
  const [formData, setFormData] = useState({
    title: '',
    issn: '',
    onlineIssn: '',
    publisher: '',
    subjectCategory: '',
    subjectArea: '',
    publisher: ''
  });

  // State lưu trữ thông báo lỗi khi validate dữ liệu đầu vào
  const [errors, setErrors] = useState({});

  /** Xử lý cập nhật thay đổi chữ khi người dùng gõ vào ô input */
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

  /** Hàm thực hiện kiểm tra tính hợp lệ của dữ liệu trước khi lưu */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = t("admin.tenTapChiKhongDuocDeTrong");
    if (!formData.issn.trim()) newErrors.issn = t("admin.maSoIssnKhongDuocDeTrong");
    if (!formData.publisher.trim()) newErrors.publisher = t("journal.nhaXuatBanKhongDuocDeTrong");
    if (!formData.subjectCategory) newErrors.subjectCategory = t("admin.vuiLongChonDanhMucChinh");
    if (!formData.subjectArea.trim()) newErrors.subjectArea = t("admin.linhVucNghienCuuCuTheKhongDuoc");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Xử lý submit lưu dữ liệu */
  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;
    addJournal(formData);
    setFormData({
      title: '',
      issn: '',
      onlineIssn: '',
      publisher: '',
      subjectCategory: '',
      subjectArea: '',
      publisher: ''
    });
    handleClose();
  };
  return <Modal show={show} onHide={handleClose} centered backdrop="static" className="text-main">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="font-display fw-bold h4 text-main">{t("journal.themTapChiMoi")}</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-4">
          
          {/* Tên Journal */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium small text-main">{t("journal.tenTapChiJournalTitle")}<span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} isInvalid={!!errors.title} placeholder={t("journal.nhapTenChinhThucCuaTapChi")} />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>

          {/* Mã số định danh quốc tế ISSN */}
          <Row className="g-3 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">Print ISSN <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="issn" value={formData.issn} onChange={handleChange} isInvalid={!!errors.issn} placeholder={t("journal.viDu19374771")} />
                <Form.Control.Feedback type="invalid">{errors.issn}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">Online ISSN</Form.Label>
                <Form.Control type="text" name="onlineIssn" value={formData.onlineIssn} placeholder={t("journal.viDu1937478x")} />
              </Form.Group>
            </Col>
          </Row>

          {/* Nhà xuất bản */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium small text-main">{t("admin.nhaXuatBanPublisher")}<span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="publisher" value={formData.publisher} onChange={handleChange} isInvalid={!!errors.publisher} placeholder={t("journal.nhapTenNhaXuatBan")} />
            <Form.Control.Feedback type="invalid">{errors.publisher}</Form.Control.Feedback>
          </Form.Group>

          {/* Danh mục phân loại và Lĩnh vực nghiên cứu */}
          <Row className="g-3 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">{t("journal.danhMucSubjectCategory")}<span className="text-danger">*</span></Form.Label>
                <Form.Select name="subjectCategory" value={formData.subjectCategory} onChange={handleChange} isInvalid={!!errors.subjectCategory}>
                  <option value="">{t("journal.chonDanhMuc")}</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Environmental Science">Environmental Science</option>
                  <option value="Medical Science">Medical Science</option>
                  <option value="Social Sciences">Social Sciences</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.subjectCategory}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">{t("journal.linhVucSubjectArea")}<span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="subjectArea" value={formData.subjectArea} onChange={handleChange} isInvalid={!!errors.subjectArea} placeholder={t("journal.viDuArtificialIntelligence")} />
                <Form.Control.Feedback type="invalid">{errors.subjectArea}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Nhà xuất bản */}
          <Form.Group className="mb-0">
            <Form.Label className="fw-medium small text-main">{t("admin.nhaXuatBanPublisher")}</Form.Label>
            <Form.Control type="text" name="publisher" value={formData.publisher} placeholder={t("journal.nhapTenGiaoSuTienSi")} />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0">
          <PrimaryButton variant="outline" onClick={handleClose}>{t("journal.huyBo")}</PrimaryButton>
          <PrimaryButton type="submit">{t("journal.taoTapChi")}</PrimaryButton>
        </Modal.Footer>
      </Form>
    </Modal>;
}