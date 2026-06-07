import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function JournalTable({ journals, page, limit }) {
  const navigate = useNavigate();

  // Quartile badge styling helper
  const renderQuartileBadge = (quartile) => {
    let color = 'var(--text-muted)';
    let bgColor = 'var(--bg-chip)';
    let border = '1px solid var(--border)';

    if (quartile === 'Q1') {
      color = '#ffffff';
      bgColor = 'var(--q1-color)'; // Q1 Green
      border = '1px solid var(--q1-color)';
    } else if (quartile === 'Q2') {
      color = '#ffffff';
      bgColor = '#E2B93B'; // Yellow/Gold
      border = '1px solid #E2B93B';
    } else if (quartile === 'Q3') {
      color = '#ffffff';
      bgColor = 'var(--primary)'; // Orange
      border = '1px solid var(--primary)';
    } else if (quartile === 'Q4') {
      color = 'var(--text-main)';
      bgColor = 'var(--bg-section)';
      border = '1px solid var(--border)';
    }

    return (
      <Badge 
        className="font-display fw-bold px-2 py-1"
        style={{ 
          borderRadius: '6px', 
          fontSize: '0.75rem',
          backgroundColor: bgColor,
          color: color,
          border: border
        }}
      >
        {quartile}
      </Badge>
    );
  };

  if (journals.length === 0) {
    return (
      <div 
        className="text-center py-5 border border-light" 
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '16px' 
        }}
      >
        <Icon icon="lucide:search-x" width="48" className="text-muted-custom mb-3" />
        <h5 className="font-display text-main fw-semibold">Không tìm thấy tạp chí nào</h5>
        <p className="text-muted-custom text-xs">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn.</p>
      </div>
    );
  }

  return (
    <div 
      className="table-responsive shadow-sm"
      style={{
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-card)'
      }}
    >
      <Table hover className="align-middle mb-0 text-start" style={{ minWidth: '800px' }}>
        <thead style={{ backgroundColor: 'var(--bg-section)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            <th className="py-3.5 ps-4 text-muted-custom font-semibold text-xs text-uppercase" style={{ width: '60px' }}>#</th>
            <th className="py-3.5 text-muted-custom font-semibold text-xs text-uppercase">Tên Journal</th>
            <th className="py-3.5 text-muted-custom font-semibold text-xs text-uppercase">Publisher</th>
            <th className="py-3.5 text-muted-custom font-semibold text-xs text-uppercase">Quartile</th>
            <th className="py-3.5 text-muted-custom font-semibold text-xs text-uppercase">Metric / IF</th>
            <th className="py-3.5 text-muted-custom font-semibold text-xs text-uppercase">Quốc gia</th>
            <th className="py-3.5 text-muted-custom font-semibold text-xs text-uppercase">Open Access</th>
            <th className="py-3.5 pe-4 text-end text-muted-custom font-semibold text-xs text-uppercase" style={{ width: '120px' }}>Chi tiết</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {journals.map((journal, index) => {
            const displayIndex = (page - 1) * limit + index + 1;
            const id = journal.journal_id;
            
            return (
              <tr key={id} className="transition-all duration-150" style={{ cursor: 'pointer' }} onClick={() => navigate(`/journals/${id}`)}>
                <td className="ps-4 text-muted-custom fw-semibold font-monospace" style={{ fontSize: '0.85rem' }}>
                  {displayIndex}
                </td>
                <td className="py-3">
                  <div className="text-main fw-bold font-display" style={{ fontSize: '0.95rem' }}>
                    {journal.display_name}
                  </div>
                  {journal.issn && (
                    <div className="text-muted-custom text-xxs font-monospace mt-0.5" style={{ fontSize: '0.75rem' }}>
                      ISSN: {journal.issn}
                    </div>
                  )}
                </td>
                <td className="text-muted-custom font-medium" style={{ fontSize: '0.85rem' }}>
                  {journal.publisher || '—'}
                </td>
                <td>
                  {renderQuartileBadge(journal.quartile)}
                </td>
                <td>
                  <div className="d-flex align-items-center gap-1.5">
                    <span className="text-main fw-bold font-monospace" style={{ fontSize: '0.9rem' }}>
                      {journal.metric_value}
                    </span>
                    <span className="text-muted-custom font-normal text-xxs" style={{ fontSize: '0.7rem' }}>
                      SJR
                    </span>
                  </div>
                </td>
                <td className="text-muted-custom font-medium" style={{ fontSize: '0.85rem' }}>
                  {journal.country || '—'}
                </td>
                <td>
                  {journal.is_open_access ? (
                    <Badge 
                      bg="success" 
                      className="d-inline-flex align-items-center gap-1 px-2.5 py-1 border border-success-20"
                      style={{ 
                        borderRadius: '6px', 
                        fontSize: '0.72rem', 
                        backgroundColor: 'rgba(40, 167, 69, 0.08)', 
                        color: '#28a745' 
                      }}
                    >
                      <Icon icon="lucide:unlock" width="10" />
                      <span>OA</span>
                    </Badge>
                  ) : (
                    <span className="text-muted-custom font-normal font-monospace">—</span>
                  )}
                </td>
                <td className="pe-4 text-end" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary-dark font-semibold text-xs p-0 text-decoration-none d-inline-flex align-items-center gap-1"
                    onClick={() => navigate(`/journals/${id}`)}
                  >
                    <span>Chi tiết</span>
                    <Icon icon="lucide:arrow-right" width="14" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
