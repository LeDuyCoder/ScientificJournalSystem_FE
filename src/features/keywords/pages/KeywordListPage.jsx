/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\keywords\pages\KeywordListPage.jsx
 */
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import KeywordSearchBar from '../components/KeywordSearchBar';
import KeywordSortDropdown from '../components/KeywordSortDropdown';
import KeywordList from '../components/KeywordList';
import { useKeywords } from '../hooks/useKeywords';

/**
 * Trang danh sách Keywords.
 * Route: /keywords
 */
export default function KeywordListPage() {
  const navigate = useNavigate();
  const { keywords, pagination, loading, error, filters, actions } = useKeywords();

  const handleSearch = (q) => {
    actions.setKeyword(q);
  };

  const handleClearSearch = () => {
    actions.setKeyword('');
  };

  const handleSortChange = (sortBy, sortOrder) => {
    actions.setSort(sortBy, sortOrder);
  };

  const handlePageChange = (page) => {
    actions.setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewArticles = (keywordId) => {
    navigate(`/keywords/${keywordId}/articles`);
  };

  return (
    <div className="grid-bg min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--bg-main)' }}>
      <Header />

      <Container className="pb-5 flex-grow-1" style={{ paddingTop: '88px' }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ fontSize: '0.88rem' }}>
            <li className="breadcrumb-item active text-main fw-semibold" aria-current="page">Keywords</li>
          </ol>
        </nav>

        <div
          className="position-relative overflow-hidden mb-4 p-4 p-lg-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="position-absolute top-0 end-0 h-100 w-50" style={{ background: 'radial-gradient(circle at top right, rgba(var(--primary-rgb, 59, 130, 246), 0.10), transparent 55%)', pointerEvents: 'none' }} />
          <div className="position-relative z-1">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
              <Icon icon="lucide:tags" width="18" style={{ color: 'var(--primary)' }} />
              <span className="text-muted-custom fw-bold text-uppercase" style={{ fontSize: '0.76rem', letterSpacing: '0.08em' }}>Research Keywords</span>
            </div>
            <h1 className="font-display fw-bold text-main mb-3" style={{ fontSize: 'clamp(2.1rem, 4vw, 3.4rem)', lineHeight: 1.1 }}>
              Khám phá Keywords
            </h1>
            <p className="text-muted-custom mb-3" style={{ fontSize: '1.05rem', maxWidth: '680px', lineHeight: 1.75 }}>
              Tìm kiếm các từ khóa nghiên cứu và mở nhanh danh sách bài báo liên quan trong hệ thống ResearchPulse.
            </p>
            {pagination.total > 0 && (
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                <Icon icon="lucide:database" width="16" style={{ color: 'var(--primary)' }} />
                <span className="text-muted-custom" style={{ fontSize: '0.9rem' }}>
                  Tổng cộng <strong className="text-main">{pagination.total.toLocaleString()}</strong> keyword trong hệ thống
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex align-items-start gap-3 flex-wrap mb-4 p-3 p-md-4 rounded-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex-grow-1">
            <KeywordSearchBar
              value={filters.keyword}
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />
          </div>
          <KeywordSortDropdown
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onChange={handleSortChange}
          />
        </div>

        {/* Active filter context */}
        {filters.keyword && (
          <div className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
            <span className="text-muted-custom">Kết quả tìm kiếm cho:</span>
            <span
              className="px-3 py-1 rounded-pill text-main fw-semibold"
              style={{ backgroundColor: 'rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.10)' }}
            >
              "{filters.keyword}"
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-muted-custom"
              onClick={handleClearSearch}
              style={{ textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <Icon icon="lucide:x" width="14" className="me-1" />
              Xóa
            </button>
          </div>
        )}

        {/* Keyword grid */}
        <KeywordList
          keywords={keywords}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewArticles={handleViewArticles}
          onRetry={actions.refetch}
        />
      </Container>
    </div>
  );
}
