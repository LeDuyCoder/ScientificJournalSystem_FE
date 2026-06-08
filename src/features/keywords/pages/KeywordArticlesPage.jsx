import { Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import KeywordArticleList from '../components/KeywordArticleList';
import { useKeywordArticles } from '../hooks/useKeywordArticles';

/**
 * Trang bài báo theo Keyword.
 * Route: /keywords/:keywordId/articles
 */
export default function KeywordArticlesPage() {
  const { keywordId } = useParams();
  const navigate = useNavigate();

  const {
    keyword,
    articles,
    pagination,
    loadingKeyword,
    loadingArticles,
    keywordError,
    articlesError,
    handlePageChange,
  } = useKeywordArticles(keywordId);

  const handleViewDetail = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleRetry = () => {
    window.location.reload();
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
            <li className="breadcrumb-item">
              <span
                role="button"
                tabIndex={0}
                onClick={() => navigate('/keywords')}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/keywords')}
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Keywords
              </span>
            </li>
            <li className="breadcrumb-item active text-main fw-semibold" aria-current="page">Bài báo liên quan</li>
          </ol>
        </nav>

        {/* Keyword header */}
        <div className="mb-5">
          {loadingKeyword ? (
            <>
              <LoadingSkeleton width="200px" height="14px" className="mb-3" />
              <LoadingSkeleton width="400px" height="36px" className="mb-3" />
              <LoadingSkeleton width="280px" height="18px" />
            </>
          ) : keywordError ? (
            <div className="d-flex align-items-center gap-3">
              <Icon icon="lucide:alert-circle" width="28" className="text-danger" />
              <div>
                <h1 className="font-display fw-bold text-main mb-1" style={{ fontSize: '1.8rem' }}>Keyword không tìm thấy</h1>
                <p className="text-muted-custom mb-0">ID: {keywordId}</p>
              </div>
            </div>
          ) : keyword ? (
            <div>
              <div className="text-uppercase text-muted-custom mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
                Research keyword
              </div>
              <h1 className="font-display fw-bold text-main mb-2" style={{ fontSize: '2.2rem' }}>
                {keyword.display_name}
              </h1>
              <p className="text-muted-custom" style={{ fontSize: '1rem' }}>
                {pagination.total > 0 && (
                  <><strong className="text-main">{pagination.total.toLocaleString()}</strong> bài báo liên quan đến keyword này</>
                )}
              </p>
            </div>
          ) : null}
        </div>

        {/* Articles list */}
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="font-display fw-bold text-main mb-0" style={{ fontSize: '1.3rem' }}>
              Bài báo liên quan
            </h2>
            <button
              type="button"
              className="btn btn-link btn-sm text-muted-custom d-flex align-items-center gap-2"
              onClick={() => navigate('/keywords')}
              style={{ textDecoration: 'none', fontSize: '0.9rem' }}
            >
              <Icon icon="lucide:arrow-left" width="16" />
              Quay lại keywords
            </button>
          </div>

          <KeywordArticleList
            articles={articles}
            loading={loadingArticles}
            error={articlesError}
            pagination={pagination}
            onPageChange={(page) => {
              handlePageChange(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDetail={handleViewDetail}
            onRetry={handleRetry}
          />
        </div>
      </Container>
    </div>
  );
}
