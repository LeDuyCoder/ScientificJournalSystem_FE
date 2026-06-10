/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\keywords\pages\KeywordArticlesPage.jsx
 */
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
    handlePageChange(1);
  };

  return (
    <div className="grid-bg min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--bg-main)' }}>
      <Header />

      <Container className="pb-5 flex-grow-1" style={{ paddingTop: '88px' }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ fontSize: '0.88rem' }}>
            <li className="breadcrumb-item">
              <span
                role="button"
                tabIndex={0}
                onClick={() => navigate('/keywords')}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/keywords')}
                className="text-decoration-none text-muted-custom hover-text-main"
                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              >
                Keywords
              </span>
            </li>
            <li className="breadcrumb-item active text-main fw-semibold" aria-current="page">Bài báo theo keyword</li>
          </ol>
        </nav>

        <div
          className="position-relative overflow-hidden mb-5 p-4 p-lg-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="position-absolute top-0 end-0 h-100 w-50" style={{ background: 'radial-gradient(circle at top right, rgba(var(--primary-rgb, 59, 130, 246), 0.10), transparent 55%)', pointerEvents: 'none' }} />
          <div className="position-relative z-1">
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
                <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <Icon icon="lucide:tag" width="16" style={{ color: 'var(--primary)' }} />
                  <span className="text-muted-custom fw-bold text-uppercase" style={{ fontSize: '0.76rem', letterSpacing: '0.08em' }}>
                    Research Keyword
                  </span>
                </div>
                <h1 className="font-display fw-bold text-main mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.12 }}>
                  {keyword.display_name}
                </h1>
                <p className="text-muted-custom mb-0" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
                  {pagination.total > 0
                    ? <><strong className="text-main">{pagination.total.toLocaleString()}</strong> bài báo đang được liên kết với keyword này.</>
                    : 'Keyword này hiện chưa có bài báo liên kết trong hệ thống.'}
                </p>
              </div>
            ) : null}
          </div>
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
