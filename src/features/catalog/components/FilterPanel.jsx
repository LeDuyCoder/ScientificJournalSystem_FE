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
  onAreaToggle,
  onCategoryToggle,
  onAccessToggle,
  onQuartileToggle,
  onClearAll,
  loading = false
}) {
  // If subject areas are selected, filter categories to only those belonging to selected areas.
  // Otherwise, show all categories.
  const visibleCategories = selectedAreas.length > 0
    ? subjectCategories.filter(cat => selectedAreas.includes(cat.subject_area_id))
    : subjectCategories;

  return (
    <div className="journal-dark-card p-4 text-start" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      
      {/* Filter Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-light pb-3">
        <div className="d-flex align-items-center gap-2 text-main fw-bold">
          <Icon icon="lucide:sliders" className="text-primary fs-5" />
          <span className="font-display">Bộ lọc</span>
        </div>
        <Button 
          variant="link" 
          onClick={onClearAll}
          className="text-primary hover:text-dark p-0 text-decoration-none fw-semibold"
          style={{ fontSize: '0.8rem' }}
        >
          Xóa tất cả
        </Button>
      </div>

      {/* 1. Subject Area Filter */}
      <div className="mb-4">
        <h6 className="text-muted-custom fw-bold text-uppercase tracking-wider mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Lĩnh vực (Subject Area)
        </h6>
        {loading ? (
          <div className="text-muted-custom py-2" style={{ fontSize: '0.85rem' }}>Đang tải...</div>
        ) : (
          <div className="d-flex flex-column gap-2 max-h-50 overflow-y-auto pr-1" style={{ maxHeight: '200px' }}>
            {subjectAreas.map((area) => {
              const isChecked = selectedAreas.includes(area.subject_area_id);
              return (
                <div key={area.subject_area_id} className="d-flex align-items-center justify-content-between py-0.5">
                  <Form.Check 
                    type="checkbox"
                    id={`area-${area.subject_area_id}`}
                    label={
                      <span className={`ms-2 text-sm transition-all ${isChecked ? 'text-primary fw-semibold' : 'text-main'}`} style={{ fontSize: '0.875rem' }}>
                        {area.display_name}
                      </span>
                    }
                    checked={isChecked}
                    onChange={() => onAreaToggle(area.subject_area_id)}
                    className="custom-checkbox m-0 d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                  />
                  <span className="text-muted-custom font-monospace" style={{ fontSize: '0.75rem' }}>
                    {area.count?.toLocaleString() || area.journal_count?.toLocaleString() || 0}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-light my-4" />

      {/* 2. Subject Category Filter */}
      <div className="mb-4">
        <h6 className="text-muted-custom fw-bold text-uppercase tracking-wider mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Chuyên ngành (Subject Category)
        </h6>
        {loading ? (
          <div className="text-muted-custom py-2" style={{ fontSize: '0.85rem' }}>Đang tải...</div>
        ) : visibleCategories.length === 0 ? (
          <div className="text-muted-custom py-2 italic text-center" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
            Chọn lĩnh vực để xem chuyên ngành
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 max-h-50 overflow-y-auto pr-1" style={{ maxHeight: '220px' }}>
            {visibleCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.subject_category_id);
              return (
                <div key={cat.subject_category_id} className="d-flex align-items-center justify-content-between py-0.5">
                  <Form.Check 
                    type="checkbox"
                    id={`cat-${cat.subject_category_id}`}
                    label={
                      <span className={`ms-2 text-sm transition-all ${isChecked ? 'text-primary fw-semibold' : 'text-main'}`} style={{ fontSize: '0.875rem' }}>
                        {cat.display_name}
                      </span>
                    }
                    checked={isChecked}
                    onChange={() => onCategoryToggle(cat.subject_category_id)}
                    className="custom-checkbox m-0 d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                  />
                  <span className="text-muted-custom font-monospace" style={{ fontSize: '0.75rem' }}>
                    {cat.count?.toLocaleString() || cat.journal_count?.toLocaleString() || 0}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-light my-4" />

      {/* 3. Access Type Filter */}
      <div className="mb-4">
        <h6 className="text-muted-custom fw-bold text-uppercase tracking-wider mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Loại truy cập
        </h6>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <Form.Check 
              type="checkbox"
              id="access-oa"
              label={
                <span className={`ms-2 transition-all ${selectedAccess.includes('open_access') ? 'text-primary fw-semibold' : 'text-main'}`} style={{ fontSize: '0.875rem' }}>
                  Open Access
                </span>
              }
              checked={selectedAccess.includes('open_access')}
              onChange={() => onAccessToggle('open_access')}
              className="custom-checkbox m-0 d-flex align-items-center"
              style={{ cursor: 'pointer' }}
            />
            <Icon icon="lucide:unlock" className="text-success" width="14" />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <Form.Check 
              type="checkbox"
              id="access-sub"
              label={
                <span className={`ms-2 transition-all ${selectedAccess.includes('subscription') ? 'text-primary fw-semibold' : 'text-main'}`} style={{ fontSize: '0.875rem' }}>
                  Subscription
                </span>
              }
              checked={selectedAccess.includes('subscription')}
              onChange={() => onAccessToggle('subscription')}
              className="custom-checkbox m-0 d-flex align-items-center"
              style={{ cursor: 'pointer' }}
            />
            <Icon icon="lucide:lock" className="text-warning" width="14" />
          </div>
        </div>
      </div>

      <hr className="border-light my-4" />

      {/* 4. Quartile Filter */}
      <div>
        <h6 className="text-muted-custom fw-bold text-uppercase tracking-wider mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Xếp hạng (Quartile)
        </h6>
        <Row className="g-2">
          {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => {
            const isActive = selectedQuartiles.includes(q);
            return (
              <Col xs={6} key={q}>
                <Button
                  className={`w-100 py-2 border font-display fw-bold text-xs`}
                  onClick={() => onQuartileToggle(q)}
                  style={{
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-main)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                    boxShadow: isActive ? '0 4px 10px rgba(255, 122, 51, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {q}
                </Button>
              </Col>
            );
          })}
        </Row>
      </div>

    </div>
  );
}
