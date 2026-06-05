import React from 'react';
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
    e_issn,
    country_name,
    established_year,
    h_index,
    cite_score
  } = journal;

  const metadataItems = [
    { label: 'ISSN', value: issn },
    { label: 'E-ISSN', value: e_issn },
    { label: 'Quốc gia', value: country_name },
    { label: 'Năm thành lập', value: established_year },
    { label: 'H-Index', value: h_index },
    { label: 'Cite Score', value: cite_score }
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
              {item.value !== undefined && item.value !== null ? item.value : 'Chưa cập nhật'}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
