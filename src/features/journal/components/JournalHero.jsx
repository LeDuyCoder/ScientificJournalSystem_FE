import React from 'react';
import { Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function JournalHero({
  journal,
  isFollowing,
  isAddingToProject,
  onFollow,
  onAddToProject,
  loading
}) {
  if (loading || !journal) {
    return (
      <div 
        className="journal-dark-card p-4 p-md-5 mb-4 position-relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}
      >
        <Row className="gy-4">
          <Col lg={8}>
            <div className="d-flex gap-2 mb-3">
              <div className="skeleton-shimmer" style={{ width: '60px', height: '24px', borderRadius: '12px' }} />
              <div className="skeleton-shimmer" style={{ width: '100px', height: '24px', borderRadius: '12px' }} />
            </div>
            <div className="skeleton-shimmer mb-3" style={{ width: '80%', height: '40px', borderRadius: '4px' }} />
            <div className="skeleton-shimmer mb-4" style={{ width: '95%', height: '60px', borderRadius: '4px' }} />
            <div className="d-flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-shimmer" style={{ width: '80px', height: '32px', borderRadius: '16px' }} />
              ))}
            </div>
          </Col>
          <Col lg={4} className="text-lg-end">
            <div className="skeleton-shimmer mb-2 ms-lg-auto" style={{ width: '120px', height: '48px', borderRadius: '4px' }} />
            <div className="skeleton-shimmer mb-3 ms-lg-auto" style={{ width: '160px', height: '20px', borderRadius: '4px' }} />
            <div className="d-flex gap-2 justify-content-lg-end">
              <div className="skeleton-shimmer" style={{ width: '110px', height: '38px', borderRadius: '6px' }} />
              <div className="skeleton-shimmer" style={{ width: '140px', height: '38px', borderRadius: '6px' }} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  const {
    display_name,
    description,
    publisher_name,
    is_open_access,
    quartile = 'Q1',
    metric_value,
    metric_name = 'Impact Factor',
    metric_year = '2024',
    subject_categories = [],
    is_following
  } = journal;

  return (
    <div className="journal-dark-card p-4 p-md-5 mb-4 position-relative overflow-hidden" 
         style={{ 
           borderRadius: '16px',
           backgroundColor: 'var(--bg-card)',
           border: '1px solid var(--border)',
           borderTop: '3px solid var(--primary)', 
           boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)' 
         }}>
      {/* Decorative background glow */}
      <div className="position-absolute" style={{
        top: '-150px',
        right: '-150px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <Row className="gy-4 align-items-start position-relative" style={{ zIndex: 1 }}>
        <Col lg={8} md={7}>
          {/* Badges */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {quartile && (
              <Badge 
                className="px-3 py-2 font-display" 
                style={{ 
                  fontWeight: 700, 
                  borderRadius: '6px',
                  backgroundColor: quartile === 'Q1' ? 'rgba(47, 198, 70, 0.12)' 
                                 : quartile === 'Q2' ? 'var(--primary-light)' 
                                 : 'var(--bg-section)',
                  color: quartile === 'Q1' ? 'var(--q1-color)' 
                       : quartile === 'Q2' ? 'var(--primary)' 
                       : 'var(--text-muted)',
                  border: quartile === 'Q1' ? '1px solid rgba(47, 198, 70, 0.3)' : '1px solid var(--border)'
                }}
              >
                {quartile}
              </Badge>
            )}
            {is_open_access && (
              <Badge 
                className="px-3 py-2" 
                style={{ 
                  backgroundColor: 'rgba(25, 135, 84, 0.08)', 
                  color: '#198754', 
                  border: '1px solid rgba(25, 135, 84, 0.2)', 
                  borderRadius: '6px' 
                }}
              >
                Open Access
              </Badge>
            )}
            {publisher_name && (
              <Badge 
                className="px-3 py-2" 
                style={{ 
                  backgroundColor: 'var(--bg-main)', 
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)', 
                  borderRadius: '6px' 
                }}
              >
                {publisher_name}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display fw-bold text-main mb-3" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>
            {display_name}
          </h1>

          {/* Description */}
          <p className="text-muted-custom mb-4 leading-relaxed" style={{ fontSize: '1.05rem', maxWidth: '750px' }}>
            {description || 'Chưa có mô tả chi tiết phạm vi nghiên cứu cho tạp chí này.'}
          </p>

          {/* Subject Category tags */}
          <div className="d-flex flex-wrap gap-2">
            {subject_categories.map((cat, idx) => (
              <Badge 
                key={cat.id || idx} 
                className="px-3 py-2 font-display hover-pills"
                style={{ 
                  backgroundColor: 'var(--bg-main)', 
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)', 
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.85rem'
                }}
              >
                {cat.display_name}
              </Badge>
            ))}
          </div>
        </Col>

        {/* Metric and Action Buttons */}
        <Col lg={4} md={5} className="text-md-end text-start mt-lg-2">
          {metric_value ? (
            <div className="mb-4">
              <div className="font-display fw-bold text-primary d-inline-block" style={{ fontSize: '4rem', lineHeight: '1' }}>
                {metric_value}
              </div>
              <div className="text-muted-custom text-uppercase fw-semibold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                {metric_name} {metric_year}
              </div>
            </div>
          ) : (
            <div className="mb-4 text-muted-custom italic">
              Chưa có dữ liệu ranking
            </div>
          )}

          {/* Buttons */}
          <div className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
            <Button
              variant={is_following ? 'outline-success' : 'outline-primary'}
              onClick={onFollow}
              disabled={isFollowing}
              className="d-flex align-items-center gap-2 px-3 py-2"
              style={{
                borderRadius: '8px',
                border: is_following ? '1px solid rgba(25, 135, 84, 0.3)' : '1px solid var(--primary)',
                backgroundColor: is_following ? 'rgba(25, 135, 84, 0.05)' : 'var(--bg-main)',
                color: is_following ? '#198754' : 'var(--primary)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              {isFollowing ? (
                <Spinner animation="border" size="sm" variant={is_following ? 'success' : 'primary'} />
              ) : is_following ? (
                <>
                  <Icon icon="lucide:check" width="16" />
                  Đang theo dõi
                </>
              ) : (
                <>
                  <Icon icon="lucide:plus" width="16" />
                  Theo dõi
                </>
              )}
            </Button>

            <Button
              onClick={onAddToProject}
              disabled={isAddingToProject}
              className="btn-primary-glow d-flex align-items-center gap-2 px-3 py-2 text-white border-0"
              style={{
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              {isAddingToProject ? (
                <Spinner animation="border" size="sm" variant="light" />
              ) : (
                <>
                  <Icon icon="lucide:folder-plus" width="16" />
                  Thêm vào Project
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
