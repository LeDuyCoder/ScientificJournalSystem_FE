import React from 'react';
import { Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { EntityCard } from '../../../shared/components/Card';

/**
 * Component JournalCardAdmin - Hiển thị thông tin tạp chí dưới dạng thẻ khối độc lập dành cho Admin.
 * Thỏa mãn tiêu chuẩn: Ứng dụng token class cấu trúc .journal-dark-card từ Design System.
 */
export default function JournalCardAdmin({ journal }) {
  const navigate = useNavigate();
  const id = journal.id || journal.journal_id;
  const title = journal.title || journal.display_name;

  return (
    <Col xs={12} sm={6} lg={4}>
      <EntityCard
        className="h-100"
        title={title}
        subtitle={
          <div className="text-muted-custom small d-flex align-items-center gap-1">
            <Icon icon="lucide:building" width="14" />
            <span className="text-truncate">{journal.publisher || 'Chưa có nhà xuất bản'}</span>
          </div>
        }
        actions={
          <div className="d-flex gap-2">
            <span className="badge bg-dark text-white px-2 py-1 text-uppercase small">
              {journal.subjectCategory || 'General'}
            </span>
            <span className={`badge px-2 py-1 ${
              journal.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
            }`}>
              {journal.status || 'Draft'}
            </span>
          </div>
        }
        meta={
          <div className="bg-light p-3 rounded-3 mt-4" style={{ backgroundColor: 'var(--bg-chip)' }}>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted-custom">Mã số ISSN:</span>
              <span className="fw-medium text-main font-monospace">{journal.issn || '—'}</span>
            </div>
            <div className="d-flex justify-content-between small">
              <span className="text-muted-custom">Tổng biên tập:</span>
              <span className="fw-medium text-main text-truncate" style={{ maxWidth: '150px' }}>
                {journal.editorInChief || 'Chưa chỉ định'}
              </span>
            </div>
          </div>
        }
        footer={
          <div className="d-flex gap-2 w-100 pt-3 border-top mt-auto" style={{ borderColor: 'var(--border)' }}>
            <Button 
              variant="light" 
              className="w-50 text-main btn-custom-sm d-flex align-items-center justify-content-center gap-1"
              onClick={() => navigate('/admin/journals/repository')}
            >
              <Icon icon="lucide:layers" width="14" />
              <span>Kho dữ liệu</span>
            </Button>
            <Button 
              variant="outline-dark" 
              className="w-50 text-main btn-custom-sm d-flex align-items-center justify-content-center gap-1"
              onClick={() => navigate(`/admin/journals/${id}/edit`)}
            >
              <Icon icon="lucide:edit-3" width="14" />
              <span>Sửa đổi</span>
            </Button>
          </div>
        }
      />
    </Col>
  );
}