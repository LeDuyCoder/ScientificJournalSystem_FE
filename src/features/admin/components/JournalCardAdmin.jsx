import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

/**
 * Component JournalCardAdmin - Hiển thị thông tin tạp chí dưới dạng thẻ khối độc lập dành cho Admin.
 * Thỏa mãn tiêu chuẩn: Ứng dụng token class cấu trúc .journal-dark-card từ Design System.
 */
export default function JournalCardAdmin({ journal }) {
  const navigate = useNavigate();
  const id = journal.id || journal.journal_id;
  const title = journal.title || journal.display_name;

  // Dynamic route base path detection
  const isPreview = window.location.pathname.startsWith('/admin-preview');
  const basePath = isPreview ? '/admin-preview' : '/admin';

  // Get index clean representation
  const idStr = id ? String(id) : '';
  const cleanId = idStr.replace(/\D/g, '') || '101';
  const displayId = `ID: #${cleanId}`;

  // Avatar selector fallback
  const mockAvatars = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100"
  ];
  const charSum = journal.editorInChief ? journal.editorInChief.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : 0;
  const avatarUrl = mockAvatars[charSum % mockAvatars.length];

  const isPublished = journal.status === 'Active' || journal.status === 'Published';
  const isReview = journal.status === 'Under Review' || journal.status === 'Draft';
  const statusClass = isPublished
    ? 'admin-status-dot admin-status-dot--accent'
    : isReview
      ? 'admin-status-dot admin-status-dot--warning'
      : 'admin-status-dot admin-status-dot--muted';

  return (
    <Col xs={12} sm={6} lg={4}>
      <Card
        className="journal-dark-card h-100 shadow-sm border-1 transition-hover admin-clickable-card"
        onClick={() => navigate(`${basePath}/journals/repository`)}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navigate(`${basePath}/journals/repository`);
          }
        }}
      >
        <Card.Body className="d-flex flex-column p-4 text-start">
          
          {/* Header Row: ID & Category Badge */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted-custom small fw-semibold font-monospace">{displayId}</span>
            <span className="badge bg-dark text-white px-2.5 py-1 text-uppercase text-xs fw-bold">
              {journal.subjectCategory || 'General'}
            </span>
          </div>

          {/* Title and ISSN */}
          <Card.Title className="font-display fw-bold text-main mb-1 line-clamp-2 h5">
            {title}
          </Card.Title>
          <div className="text-muted-custom font-monospace small mb-3">
            ISSN: {journal.issn || '—'}
          </div>

          {/* Metadata Grid (2x2 Grid) */}
          <div className="bg-light p-3 rounded-3 mb-3" style={{ backgroundColor: 'var(--bg-chip)', fontSize: '0.8rem' }}>
            <Row className="g-2">
              <Col xs={6} className="border-end border-bottom pb-1.5" style={{ borderColor: 'var(--border)' }}>
                <span className="text-muted-custom text-xs d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Publisher</span>
                <span className="text-main fw-bold text-truncate d-block">{journal.publisher || 'ResearchPulse'}</span>
              </Col>
              <Col xs={6} className="ps-3 border-bottom pb-1.5" style={{ borderColor: 'var(--border)' }}>
                <span className="text-muted-custom text-xs d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Type</span>
                <span className="text-main fw-bold d-block">{journal.type || 'Journal'}</span>
              </Col>
              <Col xs={6} className="border-end pt-1.5" style={{ borderColor: 'var(--border)' }}>
                <span className="text-muted-custom text-xs d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Coverage</span>
                <span className="text-main fw-bold d-block">{journal.coverage || '1980-2026'}</span>
              </Col>
              <Col xs={6} className="ps-3 pt-1.5">
                <span className="text-muted-custom text-xs d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Region</span>
                <span className="text-main fw-bold text-truncate d-block">{journal.country || 'Vietnam'}</span>
              </Col>
            </Row>
          </div>

          {/* Open Access tag list */}
          <div className="d-flex gap-1.5 mb-3 flex-wrap">
            <span className="badge admin-status-badge admin-status-badge--accent text-xs py-1 px-2.5 rounded-pill">
              OPEN ACCESS
            </span>
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle text-xs py-1 px-2.5 rounded-pill">
              DIAMOND OA
            </span>
          </div>

          {/* Editor-in-Chief Profile */}
          <div className="d-flex align-items-center gap-2.5 bg-light p-2.5 rounded-3 mb-4 mt-auto" style={{ backgroundColor: 'var(--bg-chip)' }}>
            <img 
              src={avatarUrl} 
              alt={journal.editorInChief} 
              className="rounded-circle"
              style={{ width: '36px', height: '36px', objectFit: 'cover' }}
            />
            <div className="text-truncate">
              <span className="fw-bold text-main d-block text-truncate" style={{ fontSize: '0.85rem' }}>
                {journal.editorInChief || 'Chưa chỉ định'}
              </span>
              <span className="text-muted-custom text-xs text-uppercase fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.02em' }}>
                Editor-in-Chief
              </span>
            </div>
          </div>

          {/* Footer status & Admin Controls */}
          <div className="d-flex justify-content-between align-items-center pt-3 border-top w-100" style={{ borderColor: 'var(--border)' }}>
            {/* Status Dot */}
            <div className="d-flex align-items-center gap-1.5">
              <span className={statusClass} />
              <span className="fw-bold text-uppercase text-main" style={{ fontSize: '0.75rem' }}>
                {journal.status || 'Draft'}
              </span>
            </div>
            
            {/* Control Actions */}
            <div className="d-flex gap-1.5">
              <Button 
                variant="light" 
                size="sm"
                className="btn-custom-sm d-inline-flex align-items-center justify-content-center p-2 rounded-2 border"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`${basePath}/journals/repository`);
                }}
                title="View repository log"
              >
                <Icon icon="lucide:eye" width="14" />
              </Button>
              <Button 
                variant="outline-dark" 
                size="sm"
                className="btn-custom-sm d-inline-flex align-items-center justify-content-center p-2 rounded-2"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`${basePath}/journals/${id}/edit`);
                }}
                title="Edit configurations"
              >
                <Icon icon="lucide:edit-2" width="14" />
              </Button>
            </div>
          </div>

        </Card.Body>
      </Card>
    </Col>
  );
}
