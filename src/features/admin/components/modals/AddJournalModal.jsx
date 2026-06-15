import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useJournalManagement } from '../../../journal/hooks/useJournalManagement';

/**
 * Component AddJournalModal - Form cửa sổ bật lên để Admin khởi tạo một Tạp chí mới.
 * Đáp ứng tiêu chí Acceptance Criteria: Có đầy đủ các trường form, thực hiện kiểm tra lỗi (validation).
 */
export default function AddJournalModal({ show, handleClose }) {
  // Lấy hàm thêm mới từ Zustand Store tập trung
  const { addJournal } = useJournalManagement();

  // Khởi tạo trạng thái quản lý các ô nhập liệu của Form
  const [formData, setFormData] = useState({
    title: '',
    issn: '',
    onlineIssn: '',
    publisher: '',
    subjectCategory: '',
    subjectArea: '',
    editorInChief: '',
    aimScope: '',
    visibility: 'Public',
    broadCategory: 'Technology',
    specificResearchArea: ''
  });

  // State lưu trữ thông báo lỗi khi validate dữ liệu đầu vào
  const [errors, setErrors] = useState({});

  /** Xử lý cập nhật thay đổi chữ khi người dùng gõ vào ô input */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /** Hàm thực hiện kiểm tra tính hợp lệ của dữ liệu trước khi lưu */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tên tạp chí không được để trống';
    if (!formData.issn.trim()) newErrors.issn = 'Mã số ISSN không được để trống';
    if (!formData.subjectCategory) newErrors.subjectCategory = 'Vui lòng chọn danh mục chính';
    if (!formData.subjectArea) newErrors.subjectArea = 'Lĩnh vực nghiên cứu cụ thể không được trống';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Xử lý submit lưu dữ liệu */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addJournal({
      ...formData,
      publisher: 'ResearchPulse Press',
      country: 'Vietnam',
      broadCategory: formData.subjectCategory,
      specificResearchArea: formData.subjectArea
    });
    
    setFormData({
      title: '',
      issn: '',
      onlineIssn: '',
      publisher: '',
      subjectCategory: '',
      subjectArea: '',
      editorInChief: '',
      aimScope: '',
      visibility: 'Public',
      broadCategory: 'Technology',
      specificResearchArea: ''
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" className="text-main">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="font-display fw-bold h4 text-main">Thêm Journal Mới</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-4 text-start">
          
          {/* Tên Journal */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium small text-main">Tên Journal <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              isInvalid={!!errors.title}
              placeholder="Nhập tên journal đầy đủ"
            />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>

          {/* Row 2: Mã ISSN & Danh mục */}
          <Row className="g-3 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">Mã ISSN <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="issn"
                  value={formData.issn}
                  onChange={handleChange}
                  isInvalid={!!errors.issn}
                  placeholder="Ví dụ: 1234-5678"
                />
                <Form.Control.Feedback type="invalid">{errors.issn}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">Danh mục <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="subjectCategory"
                  value={formData.subjectCategory}
                  onChange={handleChange}
                  isInvalid={!!errors.subjectCategory}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Environmental Science">Environmental Science</option>
                  <option value="Medical Science">Medical Science</option>
                  <option value="Social Sciences">Social Sciences</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.subjectCategory}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3: Tổng biên tập & Lĩnh vực nghiên cứu */}
          <Row className="g-3 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">Tổng biên tập</Form.Label>
                <Form.Control
                  type="text"
                  name="editorInChief"
                  value={formData.editorInChief}
                  onChange={handleChange}
                  placeholder="Tên tổng biên tập"
                />
              </Form.Group>
            </Col>
            
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main">Lĩnh vực nghiên cứu <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="subjectArea"
                  value={formData.subjectArea}
                  onChange={handleChange}
                  isInvalid={!!errors.subjectArea}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Chọn lĩnh vực</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Medical Ethics">Medical Ethics</option>
                  <option value="Sociology">Sociology</option>
                  <option value="General Science">General Science</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.subjectArea}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0">
          <Button variant="light" onClick={handleClose} className="btn-custom-sm text-main">
            Hủy
          </Button>
          <Button type="submit" className="btn-primary-glow px-4">
            + Create Journal
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
