/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\catalog\components\FilterPanel.jsx
 */
import { Form, Button } from 'react-bootstrap';

export default function FilterPanel({
  subjectAreas = [],
  subjectCategories = [],
  selectedAreas = [],
  selectedCategories = [],
  selectedAccess = [],
  selectedQuartiles = [],
  selectedYear = '',
  onAreaSelect,
  onCategorySelect,
  onAccessSelect,
  onQuartileSelect,
  onYearSelect,
  isOaDiamond = false,
  onOaDiamondToggle,
  onClearAll,
  loading = false
}) {
  const visibleCategories = selectedAreas.length > 0
    ? subjectCategories.filter(cat => selectedAreas.includes(String(cat.subject_area_id)))
    : subjectCategories;

  const cleanLabel = (value = '') => {
    const parts = String(value).split(';').map(part => part.trim()).filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : value;
  };

  const pillSelectStyle = {
    borderRadius: '999px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #ececec',
    color: '#374151',
    fontSize: '0.92rem',
    minHeight: '46px',
    paddingLeft: '16px',
    paddingRight: '36px',
    boxShadow: 'none'
  };

  const toggleChipStyle = (active = false) => ({
    borderRadius: '999px',
    backgroundColor: active ? 'rgba(255, 106, 0, 0.10)' : '#ffffff',
    border: active ? '1px solid rgba(255, 106, 0, 0.30)' : '1px solid #ececec',
    color: active ? '#ea580c' : '#374151',
    minHeight: '46px',
    padding: '0 15px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: active ? 600 : 500
  });

  const accessValue = selectedAccess[0] || 'all';

  // Generate year options: current year down to 2015
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

  return (
    <div className="mb-4 text-start d-flex flex-column gap-3">
      <div
        className="journal-dark-card p-3 p-lg-4"
        style={{
          borderRadius: '20px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)'
        }}
      >
        <div className="d-flex flex-column gap-3">
          <div className="d-flex flex-column flex-xl-row align-items-stretch align-items-xl-center justify-content-between gap-3">
            <div className="d-flex flex-wrap gap-3 flex-grow-1">
              <Form.Select
                value={selectedAreas[0] || 'all'}
                onChange={(e) => onAreaSelect(e.target.value)}
                disabled={loading}
                className="border-0"
                style={{ ...pillSelectStyle, width: '260px', maxWidth: '100%' }}
              >
                <option value="all">All subject areas</option>
                {subjectAreas.map((area) => (
                  <option key={area.subject_area_id} value={area.subject_area_id} title={area.display_name}>
                    {cleanLabel(area.display_name)}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                value={selectedCategories[0] || 'all'}
                onChange={(e) => onCategorySelect(e.target.value)}
                disabled={loading}
                className="border-0"
                style={{ ...pillSelectStyle, width: '300px', maxWidth: '100%' }}
              >
                <option value="all">All subject categories</option>
                {visibleCategories.map((cat) => (
                  <option key={cat.subject_category_id} value={cat.subject_category_id} title={cat.display_name}>
                    {cleanLabel(cat.display_name)}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                value="all"
                disabled
                className="border-0"
                title="Zone filter sẽ được bật khi backend cung cấp endpoint phù hợp"
                style={{ ...pillSelectStyle, width: '170px', maxWidth: '100%', opacity: 0.72 }}
              >
                <option value="all">Zone</option>
              </Form.Select>

              <Form.Select
                value={selectedQuartiles[0] || 'all'}
                onChange={(e) => onQuartileSelect(e.target.value)}
                className="border-0"
                style={{ ...pillSelectStyle, width: '150px', maxWidth: '100%' }}
              >
                <option value="all">All quartiles</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </Form.Select>

              <Form.Select
                value={selectedYear || 'all'}
                onChange={(e) => onYearSelect(e.target.value)}
                className="border-0"
                style={{ ...pillSelectStyle, width: '120px', maxWidth: '100%' }}
              >
                <option value="all">All years</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Form.Select>
            </div>

            <Button
              variant="link"
              onClick={onClearAll}
              className="text-decoration-none fw-semibold px-2 align-self-start align-self-xl-center"
              style={{ color: '#f97316', fontSize: '0.95rem' }}
            >
              Clear filters
            </Button>
          </div>

          <div className="d-flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => onAccessSelect(accessValue === 'open_access' ? 'all' : 'open_access')}
              style={toggleChipStyle(accessValue === 'open_access')}
            >
              <Form.Check
                type="switch"
                checked={accessValue === 'open_access'}
                readOnly
                className="m-0"
              />
              <span>Only Open Access Journals</span>
            </button>

            <button
              type="button"
              onClick={() => onOaDiamondToggle && onOaDiamondToggle(!isOaDiamond)}
              style={toggleChipStyle(isOaDiamond)}
            >
              <Form.Check
                type="switch"
                checked={isOaDiamond}
                readOnly
                className="m-0"
              />
              <span>Only OA Diamond</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
