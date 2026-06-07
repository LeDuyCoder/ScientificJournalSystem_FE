import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function FilterPanel({
  subjectAreas = [],
  subjectCategories = [],
  selectedAreas = [],
  selectedCategories = [],
  selectedAccess = [],
  selectedQuartiles = [],
  onAreaSelect,
  onCategorySelect,
  onAccessSelect,
  onQuartileSelect,
  onClearAll,
  loading = false
}) {
  // Filter categories to only those belonging to the selected area.
  // If no area is selected, show all categories.
  const visibleCategories = selectedAreas.length > 0
    ? subjectCategories.filter(cat => selectedAreas.includes(String(cat.subject_area_id)))
    : subjectCategories;

  return (
    <div className="journal-dark-card p-3 mb-4 text-start" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <Row className="align-items-end g-3">
        {/* 1. Subject Area Select */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label className="text-muted-custom fw-semibold mb-2" style={{ fontSize: '0.75rem' }}>
              Lĩnh vực (Subject Area)
            </Form.Label>
            {loading ? (
              <div className="text-muted-custom py-1" style={{ fontSize: '0.85rem' }}>Đang tải...</div>
            ) : (
              <Form.Select
                value={selectedAreas[0] || 'all'}
                onChange={(e) => onAreaSelect(e.target.value)}
                className="bg-white text-main border-light py-2"
                style={{ borderRadius: '8px', fontSize: '0.875rem' }}
              >
                <option value="all">Tất cả lĩnh vực</option>
                {subjectAreas.map((area) => (
                  <option key={area.subject_area_id} value={area.subject_area_id}>
                    {area.display_name}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        </Col>

        {/* 2. Subject Category Select */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label className="text-muted-custom fw-semibold mb-2" style={{ fontSize: '0.75rem' }}>
              Chuyên ngành (Subject Category)
            </Form.Label>
            {loading ? (
              <div className="text-muted-custom py-1" style={{ fontSize: '0.85rem' }}>Đang tải...</div>
            ) : (
              <Form.Select
                value={selectedCategories[0] || 'all'}
                onChange={(e) => onCategorySelect(e.target.value)}
                disabled={selectedAreas.length === 0}
                className="bg-white text-main border-light py-2"
                style={{ borderRadius: '8px', fontSize: '0.875rem' }}
              >
                <option value="all">Tất cả chuyên ngành</option>
                {visibleCategories.map((cat) => (
                  <option key={cat.subject_category_id} value={cat.subject_category_id}>
                    {cat.display_name}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        </Col>

        {/* 3. Access Type Select */}
        <Col xs={12} md={6} lg={2.5}>
          <Form.Group>
            <Form.Label className="text-muted-custom fw-semibold mb-2" style={{ fontSize: '0.75rem' }}>
              Loại truy cập
            </Form.Label>
            <Form.Select
              value={selectedAccess[0] || 'all'}
              onChange={(e) => onAccessSelect(e.target.value)}
              className="bg-white text-main border-light py-2"
              style={{ borderRadius: '8px', fontSize: '0.875rem' }}
            >
              <option value="all">Tất cả loại truy cập</option>
              <option value="open_access">Open Access</option>
              <option value="subscription">Subscription</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* 4. Quartile Select */}
        <Col xs={12} md={6} lg={2.5}>
          <Form.Group>
            <Form.Label className="text-muted-custom fw-semibold mb-2" style={{ fontSize: '0.75rem' }}>
              Xếp hạng (Quartile)
            </Form.Label>
            <Form.Select
              value={selectedQuartiles[0] || 'all'}
              onChange={(e) => onQuartileSelect(e.target.value)}
              className="bg-white text-main border-light py-2"
              style={{ borderRadius: '8px', fontSize: '0.875rem' }}
            >
              <option value="all">Tất cả hạng (Quartile)</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* 5. Clear All Button */}
        <Col xs={12} lg={1} className="d-flex justify-content-lg-center">
          <Button 
            variant="link" 
            onClick={onClearAll}
            className="text-primary hover:text-dark p-0 text-decoration-none fw-semibold d-flex align-items-center gap-1 py-2"
            style={{ fontSize: '0.875rem' }}
          >
            <Icon icon="lucide:rotate-ccw" width="14" />
            <span>Xóa lọc</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
}
