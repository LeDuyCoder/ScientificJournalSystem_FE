/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\journal\components\JournalMetadataGrid.jsx
 */
import { Row, Col } from 'react-bootstrap';

export default function JournalMetadataGrid({ journal, loading }) {
  if (loading || !journal) {
    return (
      <div 
        className="journal-dark-card p-4 mb-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px'
        }}
      >
        <Row className="gy-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Col lg={2} md={4} sm={6} key={i}>
              <div className="skeleton-shimmer mb-2" style={{ width: '60px', height: '14px' }} />
              <div className="skeleton-shimmer" style={{ width: '100px', height: '24px' }} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  const {
    issn,
    publisher_name,
    country_name,
    region_name,
    coverage
  } = journal;

  const issnParts = String(issn || '').split(',').map(s => s.trim());
  const displayIssn = issnParts[0] || '';
  const displayEIssn = issnParts[1] || '';

  const metadataItems = [
    { label: 'ISSN', value: displayIssn },
    { label: 'E-ISSN', value: displayEIssn },
    { label: 'Publisher', value: publisher_name },
    { label: 'Quốc gia', value: country_name },
    { label: 'Khu vực', value: region_name },
    { label: 'Coverage', value: coverage }
  ];

  return (
    <div 
      className="journal-dark-card p-4 mb-4" 
      style={{ 
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px'
      }}
    >
      <Row className="gy-4 text-start">
        {metadataItems.map((item, idx) => (
          <Col lg={2} md={4} xs={6} key={idx}>
            <div className="text-muted-custom text-uppercase fw-semibold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              {item.label}
            </div>
            <div className="text-main fw-bold font-display" style={{ fontSize: '1.1rem' }}>
              {item.value !== undefined && item.value !== null && item.value !== '' ? item.value : 'Chưa cập nhật'}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
