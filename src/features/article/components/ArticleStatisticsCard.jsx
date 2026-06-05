import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function ArticleStatisticsCard({ article }) {
  if (!article) return null;

  // Extracted metrics
  const citations = article.citations !== undefined ? article.citations : 0;
  const quartile = article.quartile || article.journal?.quartile || 'Q1';
  const volume = article.volume || '—';
  const issue = article.issue || '—';
  const pages = article.pages || '—';

  // SCImago Journal metrics (with fallback values if not present)
  const sjr = article.journal?.sjr || article.sjr || '1.85';
  const hIndex = article.journal?.h_index || article.h_index || '98';
  const citeScore = article.journal?.cite_score || article.cite_score || '7.6';

  return (
    <Card 
      className="journal-dark-card border-0 p-4" 
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)'
      }}
    >
      <h5 className="font-display font-weight-bold text-main mb-3 d-flex align-items-center gap-2 border-bottom border-light pb-2">
        <Icon icon="lucide:bar-chart-3" className="text-primary" />
        Thống kê chỉ số (Metrics)
      </h5>

      <div className="d-flex flex-column gap-3">
        {/* Citations Count */}
        <div className="p-3 rounded-3 text-center" style={{ backgroundColor: 'var(--bg-section)' }}>
          <div className="text-muted-custom text-xs font-semibold mb-1 uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>
            SỐ LƯỢT TRÍCH DẪN (CITATIONS)
          </div>
          <div className="d-flex align-items-center justify-content-center gap-1.5 text-primary fs-3" style={{ fontWeight: 700 }}>
            <Icon icon="lucide:award" />
            <span>{citations}</span>
          </div>
        </div>

        {/* Info Grid */}
        <Row className="g-2 text-sm text-main">
          {/* Quartile */}
          <Col xs={6}>
            <div className="p-2.5 rounded-3 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
              <div className="text-muted-custom text-xxs font-semibold uppercase" style={{ fontSize: '0.65rem' }}>Quartile</div>
              <div className="font-weight-bold mt-1 text-xs d-flex align-items-center gap-1" style={{ fontWeight: 700 }}>
                <Icon icon="lucide:shield-check" className="text-success" />
                <span>{quartile}</span>
              </div>
            </div>
          </Col>

          {/* Cite Score */}
          <Col xs={6}>
            <div className="p-2.5 rounded-3 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
              <div className="text-muted-custom text-xxs font-semibold uppercase" style={{ fontSize: '0.65rem' }}>CiteScore</div>
              <div className="font-weight-bold mt-1 text-xs text-primary" style={{ fontWeight: 700 }}>
                {citeScore}
              </div>
            </div>
          </Col>

          {/* SJR */}
          <Col xs={6}>
            <div className="p-2.5 rounded-3 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
              <div className="text-muted-custom text-xxs font-semibold uppercase" style={{ fontSize: '0.65rem' }}>SJR Index</div>
              <div className="font-weight-bold mt-1 text-xs" style={{ fontWeight: 700 }}>
                {sjr}
              </div>
            </div>
          </Col>

          {/* H-Index */}
          <Col xs={6}>
            <div className="p-2.5 rounded-3 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
              <div className="text-muted-custom text-xxs font-semibold uppercase" style={{ fontSize: '0.65rem' }}>H-Index</div>
              <div className="font-weight-bold mt-1 text-xs" style={{ fontWeight: 700 }}>
                {hIndex}
              </div>
            </div>
          </Col>
        </Row>

        {/* Publication details */}
        <div className="border-top border-light pt-3 mt-1">
          <div className="d-flex justify-content-between align-items-center text-xs mb-2">
            <span className="text-muted-custom">Volume:</span>
            <span className="text-main font-semibold" style={{ fontWeight: 600 }}>{volume}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center text-xs mb-2">
            <span className="text-muted-custom">Issue:</span>
            <span className="text-main font-semibold" style={{ fontWeight: 600 }}>{issue}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center text-xs">
            <span className="text-muted-custom">Số trang (Pages):</span>
            <span className="text-main font-semibold" style={{ fontWeight: 600 }}>{pages}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
