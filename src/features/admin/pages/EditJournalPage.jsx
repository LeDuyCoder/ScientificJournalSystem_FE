import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useJournalManagement } from '../../journal/hooks/useJournalManagement';
import AdminLayout from '../../../app/layouts/AdminLayout';

/**
 * EditJournalPage - Màn hình chỉnh sửa thông tin Tạp chí dành cho Admin (Figma Screen Page 12).
 */
export default function EditJournalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { journals, updateJournal, fetchInitialData } = useJournalManagement();

  // Dynamic route base path detection
  const isPreview = window.location.pathname.startsWith('/admin-preview');
  const basePath = isPreview ? '/admin-preview' : '/admin';

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    title: '',
    issn: '',
    onlineIssn: '',
    aimScope: '',
    visibility: 'Public', // Toggle: Public vs Private
    editorInChief: '',
    subjectCategory: '',
    subjectArea: ''
  });

  const [errors, setErrors] = useState({});

  // Nạp dữ liệu ban đầu nếu store rỗng
  useEffect(() => {
    if (journals.length === 0) {
      fetchInitialData();
    }
  }, [journals, fetchInitialData]);

  // Tìm nạp dữ liệu Tạp chí đang sửa và đổ vào Form
  useEffect(() => {
    if (journals.length > 0) {
      const journal = journals.find((j) => j.id === id);
      if (journal) {
        setFormData({
          title: journal.title || journal.display_name || '',
          issn: journal.issn || '',
          onlineIssn: journal.onlineIssn || '',
          aimScope: journal.aimScope || '',
          visibility: journal.visibility || 'Public',
          editorInChief: journal.editorInChief || '',
          subjectCategory: journal.subjectCategory || '',
          subjectArea: journal.subjectArea || ''
        });
      }
    }
  }, [journals, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggleVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      visibility: prev.visibility === 'Public' ? 'Private' : 'Public'
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tên tạp chí không được để trống';
    if (!formData.issn.trim()) newErrors.issn = 'Mã số ISSN không được để trống';
    if (!formData.subjectCategory) newErrors.subjectCategory = 'Vui lòng chọn danh mục chính';
    if (!formData.subjectArea.trim()) newErrors.subjectArea = 'Lĩnh vực nghiên cứu cụ thể không được trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateJournal(id, formData);
    navigate(`${basePath}/journals`);
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-column gap-3 text-start">
        {/* Breadcrumb & Navigation */}
        <div>
          <div className="admin-breadcrumb mb-2">
            <span className="cursor-pointer text-muted-custom" onClick={() => navigate(`${basePath}/journals`)}>
              Journals
            </span>
            <Icon icon="lucide:chevron-right" className="mx-1" />
            <span className="admin-breadcrumb__current">Edit Journal</span>
          </div>
          <h2 className="font-display fw-bold text-main mb-1">Edit Journal</h2>
          <p className="text-muted-custom small mb-0">
            Modify general information, editorial settings, and visibility for your journal.
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="mt-2">
          <Row className="g-4">
            {/* Left Column: General Information */}
            <Col xs={12} lg={8}>
              <Card className="border p-4 shadow-none bg-white rounded-3">
                <h5 className="font-display fw-bold text-main border-bottom pb-2.5 mb-4">
                  General Information
                </h5>

                {/* Journal Title */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium small text-main">Journal Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                    placeholder="Enter official journal title..."
                  />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>

                {/* Print & Online ISSN */}
                <Row className="g-3 mb-4">
                  <Col xs={12} sm={6}>
                    <Form.Group>
                      <Form.Label className="fw-medium small text-main">Print ISSN <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="issn"
                        value={formData.issn}
                        onChange={handleChange}
                        isInvalid={!!errors.issn}
                        placeholder="e.g. 1937-4771"
                      />
                      <Form.Control.Feedback type="invalid">{errors.issn}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group>
                      <Form.Label className="fw-medium small text-main">Online ISSN</Form.Label>
                      <Form.Control
                        type="text"
                        name="onlineIssn"
                        value={formData.onlineIssn}
                        onChange={handleChange}
                        placeholder="e.g. 1937-478X"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Aim & Scope */}
                <Form.Group className="mb-0">
                  <Form.Label className="fw-medium small text-main">Aim and Scope</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="aimScope"
                    value={formData.aimScope}
                    onChange={handleChange}
                    placeholder="Describe the editorial aims, scopes, and target audience..."
                  />
                </Form.Group>
              </Card>
            </Col>

            {/* Right Column: Visibility & Editorial Board */}
            <Col xs={12} lg={4}>
              <div className="d-flex flex-column gap-4">
                {/* Visibility Card */}
                <Card className="border p-4 shadow-none bg-white rounded-3">
                  <h5 className="font-display fw-bold text-main border-bottom pb-2.5 mb-3">
                    Visibility
                  </h5>
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div>
                      <div className="fw-bold text-main small mb-0.5">Publicly Listed</div>
                      <small className="text-muted-custom">Visible in main index</small>
                    </div>
                    <Form.Check
                      type="switch"
                      id="visibility-switch"
                      checked={formData.visibility === 'Public'}
                      onChange={handleToggleVisibility}
                      style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                    />
                  </div>
                </Card>

                {/* Editorial Board Card */}
                <Card className="border p-4 shadow-none bg-white rounded-3">
                  <h5 className="font-display fw-bold text-main border-bottom pb-2.5 mb-4">
                    Editorial Board
                  </h5>

                  {/* Editor-in-Chief */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium small text-main">Editor-in-Chief</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Icon icon="lucide:user" className="text-muted" />
                      </span>
                      <Form.Control
                        type="text"
                        name="editorInChief"
                        value={formData.editorInChief}
                        onChange={handleChange}
                        placeholder="Doctor/Professor name..."
                        className="border-start-0"
                      />
                    </div>
                  </Form.Group>

                  {/* Category Selector */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium small text-main">Broad Category <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="subjectCategory"
                      value={formData.subjectCategory}
                      onChange={handleChange}
                      isInvalid={!!errors.subjectCategory}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">-- Choose category --</option>
                      <option value="STEM (Science, Tech, Engineering, Math)">STEM (Science, Tech, Engineering, Math)</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Environmental Science">Environmental Science</option>
                      <option value="Medical Science">Medical Science</option>
                      <option value="Social Sciences">Social Sciences</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.subjectCategory}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Specific Research Area */}
                  <Form.Group className="mb-0">
                    <Form.Label className="fw-medium small text-main">Specific Research Area <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="subjectArea"
                      value={formData.subjectArea}
                      onChange={handleChange}
                      isInvalid={!!errors.subjectArea}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">-- Choose area --</option>
                      <option value="Computational Physics">Computational Physics</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Renewable Energy">Renewable Energy</option>
                      <option value="Medical Ethics">Medical Ethics</option>
                      <option value="Sociology">Sociology</option>
                      <option value="Neural Networks">Neural Networks</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.subjectArea}</Form.Control.Feedback>
                  </Form.Group>
                </Card>
              </div>
            </Col>
          </Row>

          {/* Form Actions Footer */}
          <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top" style={{ borderColor: 'var(--border)' }}>
            <Button
              variant="light"
              className="py-2.5 px-4 font-sans text-main border btn-custom-sm"
              onClick={() => navigate(`${basePath}/journals`)}
            >
              Cancel Changes
            </Button>
            <Button
              type="submit"
              className="btn-primary-glow py-2.5 px-4"
            >
              Update Journal
            </Button>
          </div>
        </Form>
      </div>
    </AdminLayout>
  );
}
