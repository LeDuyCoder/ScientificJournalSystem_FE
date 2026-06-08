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

      <Container className="py-5 flex-grow-1">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ fontSize: '0.88rem' }}>
            <li className="breadcrumb-item">
              <span
                role="button"
                tabIndex={0}
                onClick={() => navigate('/dashboard')}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard')}
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Dashboard
              </span>
            </li>
            <li className="breadcrumb-item active text-main fw-semibold" aria-current="page">Keywords</li>
          </ol>
        </nav>

        {/* Page header */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-2">
            <Icon icon="lucide:tag" width="28" style={{ color: 'var(--text-muted)' }} />
            <h1 className="font-display fw-bold text-main mb-0" style={{ fontSize: '2rem' }}>
              Khám phá Keywords
            </h1>
          </div>
          <p className="text-muted-custom" style={{ fontSize: '1.05rem', maxWidth: '600px' }}>
            Tìm kiếm và khám phá từ khóa nghiên cứu. Mỗi keyword liên kết đến các bài báo khoa học liên quan.
          </p>
          <p className="text-muted-custom" style={{ fontSize: '0.88rem' }}>
            {pagination.total > 0 && (
              <span>Tổng cộng <strong className="text-main">{pagination.total.toLocaleString()}</strong> keyword trong hệ thống</span>
            )}
          </p>
        </div>

        {/* Search & Sort bar */}
        <div className="d-flex align-items-start gap-3 flex-wrap mb-4">
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
