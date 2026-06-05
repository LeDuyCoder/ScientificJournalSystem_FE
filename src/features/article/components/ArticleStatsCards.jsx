import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function ArticleStatsCards({ stats, isLoading }) {
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const statItems = [
    {
      label: 'Tổng bài báo',
      value: stats?.totalArticles || 0,
      icon: 'lucide:file-text',
      color: 'var(--primary)',
      bgGradient: 'linear-gradient(135deg, var(--primary-light) 0%, rgba(199, 238, 255, 0) 100%)'
    },
    {
      label: 'Open Access',
      value: stats?.openAccessCount || 0,
      icon: 'lucide:unlock',
      color: '#10b981', // Emerald
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 100%)'
    },
    {
      label: 'Tổng tác giả',
      value: stats?.authorsCount || 0,
      icon: 'lucide:users',
      color: '#8b5cf6', // Violet
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 100%)'
    },
    {
      label: 'Lĩnh vực nghiên cứu',
      value: stats?.topicsCount || 0,
      icon: 'lucide:layers',
      color: '#f59e0b', // Amber
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0) 100%)'
    }
  ];

  if (isLoading) {
    return (
      <Row className="g-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Col key={i} xs={12} sm={6} md={3}>
            <Card 
              className="border-0 shadow-sm position-relative overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                height: '100px'
              }}
            >
              <div 
                className="position-absolute w-100 h-100" 
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.03), transparent)',
                  animation: 'shimmer 1.5s infinite',
                  transform: 'translateX(-100%)'
                }}
              />
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="bg-secondary opacity-25 rounded mb-2" style={{ width: '80px', height: '14px' }} />
                  <div className="bg-secondary opacity-25 rounded" style={{ width: '120px', height: '24px' }} />
                </div>
                <div className="bg-secondary opacity-10 rounded-circle" style={{ width: '40px', height: '40px' }} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row className="g-3 mb-4">
      {statItems.map((item, index) => (
        <Col key={index} xs={12} sm={6} md={3}>
          <Card 
            className="border-0 shadow-sm h-100 transition-all duration-300"
            style={{
              backgroundColor: 'var(--bg-card)',
              backgroundImage: item.bgGradient,
              borderLeft: '1px solid var(--border)',
              borderRight: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              borderTop: `3px solid ${item.color}`,
              borderRadius: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 10px 20px rgba(0, 0, 0, 0.05), 0 0 15px ${item.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Card.Body className="d-flex align-items-center justify-content-between p-3">
              <div>
                <div className="text-muted-custom font-weight-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {item.label}
                </div>
                <h3 className="text-main mb-0 font-display font-weight-bold" style={{ fontSize: '1.75rem' }}>
                  {formatNumber(item.value)}
                </h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: item.color.startsWith('var') ? 'var(--primary-light)' : `${item.color}15`,
                  color: item.color
                }}
              >
                <Icon icon={item.icon} width="22" height="22" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
