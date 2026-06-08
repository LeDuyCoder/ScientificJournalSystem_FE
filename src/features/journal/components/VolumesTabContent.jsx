import { useState } from 'react';
import { Spinner, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';

const MONTH_NAMES = [
  '', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export default function VolumesTabContent({
  volumes = [],
  issuesByVolume = {},
  issueErrors = {},
  journalId,
  onVolumeExpand,
  loading,
  error = false,
  volumePagination,
  issuePaginationByVolume = {},
  onVolumePageChange,
  onIssuePageChange
}) {
  const navigate = useNavigate();
  const [expandedVolumes, setExpandedVolumes] = useState({});

  /** Toggle accordion mở/đóng volume; trigger lazy load nếu chưa có data */
  const toggleVolume = (volumeId) => {
    const isNowExpanded = !expandedVolumes[volumeId];
    setExpandedVolumes(prev => ({ ...prev, [volumeId]: isNowExpanded }));

    if (isNowExpanded && onVolumeExpand) {
      onVolumeExpand(volumeId);
    }
  };

  /** Điều hướng đến trang bài báo theo issue */
  const handleViewArticles = (e, issueId) => {
    e.stopPropagation();
    const query = new URLSearchParams({ issue_id: issueId });
    if (journalId) query.set('journal_id', journalId);
    navigate(`/articles?${query.toString()}`);
  };

  /** Render compact pagination controls. */
  const renderPagination = (pagination, onPageChange, prefix) => {
    const totalPages = pagination?.total_pages || 1;
    const currentPage = pagination?.page || 1;
    if (totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    if (startPage > 1) pages.push(1);
    if (startPage > 2) pages.push('ellipsis-start');
    for (let page = startPage; page <= endPage; page += 1) pages.push(page);
    if (endPage < totalPages - 1) pages.push('ellipsis-end');
    if (endPage < totalPages) pages.push(totalPages);

    const buttonStyle = (active = false) => ({
      minWidth: '32px',
      height: '32px',
      borderRadius: '8px',
      border: active ? '1px solid #111' : '1px solid rgba(0,0,0,0.10)',
      backgroundColor: active ? '#111' : 'var(--bg-card)',
      color: active ? '#fff' : 'var(--text-muted)',
      fontSize: '0.82rem',
      fontWeight: 600,
      cursor: active ? 'default' : 'pointer',
    });

    return (
      <div className="d-flex align-items-center justify-content-center gap-1 flex-wrap mt-3">
        <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} style={buttonStyle(false)}>
          <Icon icon="lucide:chevron-left" width="14" />
        </button>
        {pages.map((page) => page.toString().startsWith('ellipsis') ? (
          <span key={`${prefix}-${page}`} className="px-1 text-muted-custom">…</span>
        ) : (
          <button key={`${prefix}-${page}`} type="button" onClick={() => onPageChange(page)} style={buttonStyle(page === currentPage)}>
            {page}
          </button>
        ))}
        <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} style={buttonStyle(false)}>
          <Icon icon="lucide:chevron-right" width="14" />
        </button>
      </div>
    );
  };

  // ─── Loading volumes ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="journal-dark-card p-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
      >
        {[1, 2, 3].map(i => (
          <div key={i} className="mb-3 p-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <LoadingSkeleton width="200px" height="24px" className="mb-2" />
            <LoadingSkeleton width="120px" height="16px" />
          </div>
        ))}
      </div>
    );
  }

  // ─── Error volumes ─────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="journal-dark-card p-5 text-center"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
      >
        <Icon icon="lucide:alert-triangle" width="40" className="mb-3 text-danger" />
        <p className="mb-0 text-muted-custom">Không thể tải danh sách volumes. Vui lòng thử lại.</p>
      </div>
    );
  }

  // ─── Empty volumes ────────────────────────────────────────────────────
  if (!volumes || volumes.length === 0) {
    return (
      <div
        className="journal-dark-card p-5 text-center text-muted-custom"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
      >
        <Icon icon="lucide:folder-x" width="40" className="mb-3 text-muted-custom" />
        <p className="mb-0">Journal này chưa có dữ liệu volume.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {volumes.map((vol) => {
        const volumeId = vol.volume_id || vol.id;
        const volumeYear = vol.publication_year || vol.year;
        const isExpanded = !!expandedVolumes[volumeId];
        const issues = issuesByVolume[volumeId];
        const issueError = issueErrors[volumeId];
        const issuePagination = issuePaginationByVolume[volumeId];

        return (
          <div
            key={volumeId}
            className="journal-dark-card overflow-hidden"
            style={{
              borderRadius: '12px',
              backgroundColor: 'var(--bg-card)',
              transition: 'all 0.2s ease',
              border: isExpanded ? '1.5px solid rgba(0,0,0,0.18)' : '1px solid var(--border)'
            }}
          >
            {/* Volume Header */}
            <div
              className="p-3 d-flex align-items-center justify-content-between"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => toggleVolume(volumeId)}
            >
              <div className="d-flex align-items-center gap-3">
                <Icon
                  icon={isExpanded ? 'lucide:folder-open' : 'lucide:folder'}
                  style={{ color: 'var(--text-muted)' }}
                  width="20"
                />
                <div>
                  <span className="text-main fw-bold font-display" style={{ fontSize: '1.02rem' }}>
                    Volume {vol.volume_number || 'N/A'}
                  </span>
                  <span className="text-muted-custom fw-normal ms-2" style={{ fontSize: '0.9rem' }}>
                    · {volumeYear || 'Chưa cập nhật'}
                  </span>
                  {vol.issue_count !== undefined && vol.issue_count > 0 && (
                    <Badge
                      className="ms-2 px-2 py-1"
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0,0,0,0.07)',
                        color: 'var(--text-muted)',
                        border: '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      {vol.issue_count} issue
                    </Badge>
                  )}
                </div>
              </div>
              <span className="text-muted-custom d-flex align-items-center">
                <Icon icon={isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'} width="18" />
              </span>
            </div>

            {/* Issues Panel */}
            {isExpanded && (
              <div
                className="px-4 pb-3 pt-1"
                style={{
                  borderTop: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-main)'
                }}
              >
                {/* Loading issues */}
                {issues === undefined && !issueError ? (
                  <div className="d-flex align-items-center gap-2 py-3 text-muted-custom" style={{ fontSize: '0.9rem' }}>
                    <Spinner animation="border" size="sm" />
                    Đang tải danh sách issue...
                  </div>

                ) : issueError ? (
                  /* Error loading issues */
                  <div className="d-flex align-items-center gap-2 py-3 text-danger" style={{ fontSize: '0.88rem' }}>
                    <Icon icon="lucide:alert-triangle" width="16" />
                    Không thể tải danh sách issues. Vui lòng thử lại.
                  </div>

                ) : !issues || issues.length === 0 ? (
                  /* Empty issues */
                  <div className="text-muted-custom py-3 text-start" style={{ fontSize: '0.9rem' }}>
                    <Icon icon="lucide:inbox" width="14" className="me-1" />
                    Volume này chưa có issue.
                  </div>

                ) : (
                  <div className="d-flex flex-column gap-2 py-2">
                    {issues.map((issue) => {
                      const issueId = issue.issue_id || issue.id;
                      const issueYear = issue.publication_year || issue.year;
                      const issueMonth = issue.month ? MONTH_NAMES[issue.month] || `Tháng ${issue.month}` : null;

                      return (
                        <div
                          key={issueId}
                          className="d-flex align-items-center justify-content-between rounded"
                          style={{
                            padding: '10px 14px',
                            borderLeft: '2px solid rgba(0,0,0,0.12)',
                            backgroundColor: 'var(--bg-card)',
                          }}
                        >
                          {/* Issue Info */}
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <Icon icon="lucide:file-stack" style={{ color: 'var(--text-muted)' }} width="15" />
                            <span className="text-main fw-semibold font-display" style={{ fontSize: '0.93rem' }}>
                              Issue {issue.issue_number || 'N/A'}
                            </span>
                            {(issueMonth || issueYear) && (
                              <span className="text-muted-custom" style={{ fontSize: '0.83rem' }}>
                                · {[issueMonth, issueYear].filter(Boolean).join(' ')}
                              </span>
                            )}
                            {issue.article_count !== undefined && (
                              <Badge
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(0,0,0,0.06)',
                                  color: 'var(--text-muted)',
                                  border: '1px solid rgba(0,0,0,0.08)'
                                }}
                              >
                                {issue.article_count} bài báo
                              </Badge>
                            )}
                          </div>

                          {/* CTA Button */}
                          <button
                            type="button"
                            onClick={(e) => handleViewArticles(e, issueId)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 13px',
                              borderRadius: '7px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              backgroundColor: '#111',
                              color: '#fff',
                              border: '1px solid #111',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}
                          >
                            <Icon icon="lucide:book-open" width="13" />
                            <span>Xem bài báo</span>
                          </button>
                        </div>
                      );
                    })}
                    {renderPagination(
                      issuePagination,
                      (nextPage) => onIssuePageChange && onIssuePageChange(volumeId, nextPage),
                      `issue-${volumeId}`
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {renderPagination(
        volumePagination,
        (nextPage) => onVolumePageChange && onVolumePageChange(nextPage),
        'volume'
      )}
    </div>
  );
}
