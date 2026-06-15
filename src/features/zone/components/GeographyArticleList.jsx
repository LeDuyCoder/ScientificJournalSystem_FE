import React from 'react';
import { Table, Card, Pagination, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function GeographyArticleList({ 
  articles = [], 
  loading = false, 
  total = 0, 
  page = 1, 
  totalPages = 1, 
  onPageChange, 
  onDetailClick,
  countryName = ''
}) {

  // Copy DOI to clipboard helper
  const handleCopyDoi = (e, doi) => {
    e.stopPropagation();
    if (!doi) return;
    navigator.clipboard.writeText(doi);
    alert('Đã sao chép mã DOI vào bộ nhớ tạm: ' + doi);
  };

  // Assign colors to topics from dev branch
  const getTopicStyle = (topic) => {
    if (!topic) return { bg: 'var(--bg-main)', color: 'var(--text-muted)' };
    const name = String(topic).toLowerCase();
    if (name.includes('machine learning') || name.includes('ml')) {
      return { bg: 'var(--primary-light)', color: 'var(--primary)' };
    }
    if (name.includes('computer science') || name.includes('cs')) {
      return { bg: 'rgba(6, 182, 212, 0.1)', color: '#0891b2' };
    }
    if (name.includes('medicine') || name.includes('bio')) {
      return { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669' };
    }
    if (name.includes('physic')) {
      return { bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706' };
    }
    return { bg: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed' };
  };

  // Render skeletons for loading state
  const renderSkeletons = () => (
    <tbody>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
          <td className="ps-3 py-3" style={{ width: '40px' }}>
            <div className="skeleton-shimmer" style={{ width: '15px', height: '14px' }} />
          </td>
          <td className="py-3">
            <div className="skeleton-shimmer mb-2" style={{ width: '80%', height: '18px' }} />
            <div className="skeleton-shimmer" style={{ width: '45%', height: '12px' }} />
          </td>
          <td className="py-3">
            <div className="skeleton-shimmer" style={{ width: '120px', height: '14px' }} />
          </td>
          <td className="py-3 text-center">
            <div className="skeleton-shimmer mx-auto" style={{ width: '40px', height: '14px' }} />
          </td>
          <td className="py-3">
            <div className="skeleton-shimmer" style={{ width: '100px', height: '12px' }} />
          </td>
          <td className="py-3">
            <div className="skeleton-shimmer" style={{ width: '90px', height: '20px', borderRadius: '4px' }} />
          </td>
          <td className="py-3 text-center">
            <div className="skeleton-shimmer mx-auto" style={{ width: '25px', height: '16px', borderRadius: '3px' }} />
          </td>
          <td className="pe-3 text-end py-3">
            <div className="skeleton-shimmer ms-auto" style={{ width: '50px', height: '16px' }} />
          </td>
        </tr>
      ))}
    </tbody>
  );

  // Custom pagination renderer
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];

    items.push(
      <Pagination.Prev 
        key="prev" 
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="mx-0.5"
      />
    );

    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} active={1 === page} onClick={() => onPageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      items.push(
        <Pagination.Item 
          key={p} 
          active={p === page} 
          onClick={() => onPageChange(p)}
        >
          {p}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      items.push(
        <Pagination.Item key={totalPages} active={totalPages === page} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next 
        key="next" 
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="mx-0.5"
      />
    );

    return (
      <Pagination 
        className="justify-content-center m-0 custom-pagination mt-4"
        style={{
          '--bs-pagination-bg': 'var(--bg-card)',
          '--bs-pagination-border-color': 'var(--border)',
          '--bs-pagination-color': 'var(--text-muted)',
          '--bs-pagination-hover-color': 'var(--primary)',
          '--bs-pagination-hover-bg': 'var(--bg-main)',
          '--bs-pagination-hover-border-color': 'var(--border)',
          '--bs-pagination-active-bg': 'var(--primary)',
          '--bs-pagination-active-border-color': 'var(--primary)',
          '--bs-pagination-active-color': '#ffffff',
          '--bs-pagination-disabled-bg': 'var(--bg-main)',
          '--bs-pagination-disabled-color': 'var(--text-muted)',
          '--bs-pagination-disabled-border-color': 'var(--border)'
        }}
      >
        {items}
      </Pagination>
    );
  };

  return (
    <div className="mt-4 p-4 journal-dark-card">
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h3 className="font-display fw-bold text-main mb-1" style={{ fontSize: '1.25rem' }}>
            Danh sách bài báo khoa học tại {countryName}
          </h3>
          {!loading && articles.length > 0 && (
            <p className="text-muted-custom mb-0 text-xs font-sans">
              Hiển thị bài báo thứ <span className="fw-semibold text-main">{(page - 1) * 10 + 1}</span> - <span className="fw-semibold text-main">{Math.min(page * 10, total)}</span> trong tổng số <span className="fw-semibold text-main">{total}</span> bài báo.
            </p>
          )}
        </div>
      </div>

      {loading && articles.length === 0 ? (
        <div className="w-100 rounded-3 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <Table responsive hover className="m-0 bg-transparent text-main border-0 geography-table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="bg-transparent text-muted-custom py-3 ps-3 text-xs" style={{ width: '40px' }}>#</th>
                <th className="bg-transparent text-muted-custom py-3 text-xs">TÊN BÀI BÁO</th>
                <th className="bg-transparent text-muted-custom py-3 text-xs">JOURNAL</th>
                <th className="bg-transparent text-muted-custom py-3 text-xs text-center" style={{ width: '80px' }}>NĂM</th>
                <th className="bg-transparent text-muted-custom py-3 text-xs">DOI</th>
                <th className="bg-transparent text-muted-custom py-3 text-xs">TOPIC</th>
                <th className="bg-transparent text-muted-custom py-3 text-xs text-center" style={{ width: '60px' }}>OA</th>
                <th className="bg-transparent text-muted-custom py-3 text-xs text-end pe-3">CHI TIẾT</th>
              </tr>
            </thead>
            {renderSkeletons()}
          </Table>
        </div>
      ) : articles.length === 0 ? (
        <div 
          className="text-center p-5 rounded-3 d-flex flex-column align-items-center justify-content-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            minHeight: '220px'
          }}
        >
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444'
            }}
          >
            <Icon icon="lucide:file-x" width="24" height="24" />
          </div>
          <h5 className="text-main font-weight-bold mb-1 font-display" style={{ fontSize: '1rem' }}>Không có bài báo nào</h5>
          <p className="text-muted-custom mb-0 text-xs max-w-md font-sans">
            Hiện tại chưa có bài báo khoa học nào thuộc các tạp chí tại quốc gia này được lưu trữ trong hệ thống.
          </p>
        </div>
      ) : (
        <>
          {/* Table for Desktop & Tablet */}
          <div 
            className="w-100 rounded-3 overflow-hidden d-none d-md-block shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)'
            }}
          >
            <Table responsive hover className="m-0 bg-transparent text-main border-0 geography-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="bg-transparent text-muted-custom py-3 ps-3 text-xs" style={{ width: '40px', letterSpacing: '0.05em' }}>#</th>
                  <th className="bg-transparent text-muted-custom py-3 text-xs" style={{ letterSpacing: '0.05em' }}>TÊN BÀI BÁO</th>
                  <th className="bg-transparent text-muted-custom py-3 text-xs" style={{ letterSpacing: '0.05em' }}>JOURNAL</th>
                  <th className="bg-transparent text-muted-custom py-3 text-xs text-center" style={{ width: '80px', letterSpacing: '0.05em' }}>NĂM</th>
                  <th className="bg-transparent text-muted-custom py-3 text-xs" style={{ letterSpacing: '0.05em' }}>DOI</th>
                  <th className="bg-transparent text-muted-custom py-3 text-xs" style={{ letterSpacing: '0.05em' }}>TOPIC</th>
                  <th className="bg-transparent text-muted-custom py-3 text-xs text-center" style={{ width: '60px', letterSpacing: '0.05em' }}>OA</th>
                  <th className="bg-transparent text-muted-custom py-3 text-xs text-end pe-3" style={{ width: '80px', letterSpacing: '0.05em' }}>CHI TIẾT</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) => {
                  const topicStyle = getTopicStyle(article.topic_name);
                  return (
                    <tr 
                      key={article.article_id}
                      onClick={() => onDetailClick(article.article_id)}
                      className="align-middle geography-article-row"
                    >
                      <td className="text-muted-custom ps-3 font-sans" style={{ fontSize: '0.8rem' }}>
                        {(page - 1) * 10 + index + 1}
                      </td>
                      <td style={{ maxWidth: '380px' }} className="py-3">
                        <div className="geography-article-title line-clamp-2">
                          {article.title}
                        </div>
                        {article.abstract && (
                          <div className="text-muted-custom mt-1 text-xs text-truncate font-sans">
                            {article.abstract}
                          </div>
                        )}
                      </td>
                      <td style={{ maxWidth: '180px' }}>
                        <div className="text-main text-sm text-truncate font-sans" style={{ fontWeight: 500 }}>
                          {article.journal_name}
                        </div>
                      </td>
                      <td className="text-center font-sans" style={{ color: 'var(--text-muted)' }}>
                        {article.publication_year}
                      </td>
                      <td style={{ maxWidth: '140px' }}>
                        {article.doi ? (
                          <div className="d-flex align-items-center gap-1 font-sans">
                            <span className="text-muted-custom text-xs text-truncate" style={{ fontSize: '0.75rem' }}>
                              {article.doi}
                            </span>
                            <Button 
                              variant="link" 
                              className="p-0 text-muted-custom hover:text-dark d-flex align-items-center"
                              onClick={(e) => handleCopyDoi(e, article.doi)}
                              title="Copy DOI"
                            >
                              <Icon icon="lucide:copy" width="12" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted text-xs font-sans">—</span>
                        )}
                      </td>
                      <td>
                        <span 
                          className="geography-topic-badge"
                          style={{
                            backgroundColor: topicStyle.bg,
                            color: topicStyle.color,
                            border: 'none'
                          }}
                        >
                          {article.topic_name || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td className="text-center">
                        {article.is_open_access ? (
                          <span className="geography-oa-badge">
                            OA
                          </span>
                        ) : (
                          <span className="text-muted-custom text-xs">—</span>
                        )}
                      </td>
                      <td className="text-end pe-3">
                        <span className="geography-link-accent">
                          Chi tiết
                          <Icon icon="lucide:arrow-right" width="12" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* Cards list for Mobile */}
          <div className="d-block d-md-none">
            <div className="d-flex flex-column gap-3">
              {articles.map((article, index) => {
                const topicStyle = getTopicStyle(article.topic_name);
                return (
                  <Card 
                    key={article.article_id}
                    onClick={() => onDetailClick(article.article_id)}
                    className="journal-dark-card shadow-sm geography-article-row border-0"
                  >
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted-custom text-xs font-sans">#{(page - 1) * 10 + index + 1}</span>
                        <div className="d-flex gap-1.5 align-items-center">
                          <span 
                            className="geography-topic-badge" 
                            style={{ 
                              fontSize: '0.65rem', 
                              padding: '0.15rem 0.45rem',
                              backgroundColor: topicStyle.bg,
                              color: topicStyle.color,
                              border: 'none'
                            }}
                          >
                            {article.topic_name || 'Chưa phân loại'}
                          </span>
                          {article.is_open_access && (
                            <span className="geography-oa-badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                              OA
                            </span>
                          )}
                        </div>
                      </div>

                      <h6 className="geography-article-title mb-2" style={{ lineHeight: '1.4', fontSize: '0.9rem' }}>
                        {article.title}
                      </h6>

                      <div className="pt-2 border-top border-light d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div>
                          <div className="text-primary text-xs font-weight-semibold font-sans" style={{ fontSize: '0.75rem' }}>
                            {article.journal_name}
                          </div>
                          <div className="text-muted-custom text-xs font-sans mt-0.5" style={{ fontSize: '0.7rem' }}>
                            Năm: {article.publication_year} {article.doi ? ` · DOI: ${article.doi}` : ''}
                          </div>
                        </div>
                        <span className="geography-link-accent" style={{ fontSize: '0.75rem' }}>
                          Chi tiết
                          <Icon icon="lucide:arrow-right" width="12" />
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Render pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
}
