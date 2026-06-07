import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function JournalStatsCards({ stats, loading }) {
  const cardData = [
    {
      title: 'Tổng journals',
      value: stats.totalJournals.toLocaleString('vi-VN'),
      icon: 'lucide:book-open',
      color: '#FF7A33', // Primary orange
      bgColor: 'rgba(255, 122, 51, 0.08)'
    },
    {
      title: 'Q1 Journals',
      value: stats.q1Journals.toLocaleString('vi-VN'),
      icon: 'lucide:award',
      color: '#2FC646', // Q1 green
      bgColor: 'rgba(47, 198, 70, 0.08)'
    },
    {
      title: 'Quốc gia',
      value: stats.totalCountries.toLocaleString('vi-VN'),
      icon: 'lucide:globe',
      color: '#3385FF', // Blue
      bgColor: 'rgba(51, 133, 255, 0.08)'
    },
    {
      title: 'Open Access',
      value: stats.openAccessJournals.toLocaleString('vi-VN'),
      icon: 'lucide:unlock',
      color: '#A033FF', // Purple
      bgColor: 'rgba(160, 51, 255, 0.08)'
    }
  ];

  if (loading) {
    return (
      <Row className="g-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Col lg={3} md={6} xs={12} key={i}>
            <Card 
              className="p-4" 
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border)', 
                borderRadius: '16px' 
              }}
            >
              <div className="skeleton-shimmer mb-2" style={{ width: '40%', height: '14px' }} />
              <div className="skeleton-shimmer" style={{ width: '60%', height: '32px' }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row className="g-4 mb-4">
      {cardData.map((item, idx) => (
        <Col lg={3} md={6} xs={12} key={idx}>
          <Card 
            className="h-100 transition-all duration-300 card-hover-lift"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border)', 
              borderRadius: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <Card.Body className="p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted-custom font-semibold text-xs text-uppercase d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  {item.title}
                </span>
                <span className="text-main fw-bold font-display" style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
                  {item.value}
                </span>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: item.bgColor,
                  color: item.color
                }}
              >
                <Icon icon={item.icon} width="22" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
