import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { EntityCard } from '../../../shared/components/Card';

/**
 * Component JournalCard - Hiển thị thông tin tạp chí dưới dạng thẻ khối độc lập (Card View).
 * Tuân thủ chuẩn: Ứng dụng class cấu trúc .journal-dark-card từ Design System.
 * @param {Object} journal - Dữ liệu chi tiết của một tạp chí cụ thể
 */
export default function JournalCard({ journal }) {
  const navigate = useNavigate();

  return (
    <Col xs={12} sm={6} lg={4}>
      <EntityCard
        className="h-100"
        title={journal.title}
        subtitle={
          <div className="text-muted-custom small d-flex align-items-center gap-1">
            <i className="bi bi-building"></i>
            <span className="text-truncate">{journal.publisher}</span>
          </div>
        }
        actions={
          <div className="d-flex gap-2">
            <span className="badge bg-dark-solid text-white text-uppercase" style={{ fontSize: '0.75rem' }}>
              {journal.subjectCategory}
            </span>
            <span className={`badge ${journal.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
              {journal.status}
            </span>
          </div>
        }
        meta={
          <div className="bg-light p-3 rounded-3 mt-4" style={{ backgroundColor: 'var(--bg-chip)' }}>
            <Row className="g-2 text-main small">
              <Col xs={6}>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Mã số ISSN:</span>
                <span className="fw-medium">{journal.issn}</span>
              </Col>
              <Col xs={6}>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Nhà xuất bản:</span>
                <span className="fw-medium text-truncate d-block">{journal.publisher}</span>
              </Col>
            </Row>
          </div>
        }
        footer={
          <div className="d-flex gap-2 w-100 pt-2 border-top mt-auto" style={{ borderColor: 'var(--border)' }}>
            <Button 
              variant="light" 
              className="w-50 text-main btn-custom-sm"
              onClick={() => navigate('/admin/journals/repository')}
            >
              <i className="bi bi-layers me-1"></i> Kho dữ liệu
            </Button>
            <Button 
              variant="outline-dark" 
              className="w-50 text-main btn-custom-sm"
              onClick={() => navigate(`/admin/journals/${journal.id}/edit`)}
            >
              <i className="bi bi-pencil me-1"></i> Sửa đổi
            </Button>
          </div>
        }
      />
    </Col>
  );
}