/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\keywords\components\KeywordArticleList.jsx
 */
import { Pagination } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import KeywordArticleItem from './KeywordArticleItem';

/**
 * Danh sách bài báo theo keyword với trạng thái và phân trang.
 */
export default function KeywordArticleList({ articles, loading, error, pagination, onPageChange, onViewDetail, onRetry }) {
  const totalPages = pagination?.total_pages || 1;
  const currentPage = pagination?.page || 1;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    pages.push(<Pagination.Prev key="prev" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />);
    if (start > 1) pages.push(<Pagination.Item key={1} onClick={() => onPageChange(1)}>1</Pagination.Item>);
    if (start > 2) pages.push(<Pagination.Ellipsis key="start" disabled />);
    Array.from({ length: end - start + 1 }, (_, index) => start + index).forEach((pageNumber) => {
      pages.push(<Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => onPageChange(pageNumber)}>{pageNumber}</Pagination.Item>);
    });
    if (end < totalPages - 1) pages.push(<Pagination.Ellipsis key="end" disabled />);
    if (end < totalPages) pages.push(<Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>{totalPages}</Pagination.Item>);
    pages.push(<Pagination.Next key="next" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} />);

    return <Pagination className="keyword-article-pagination justify-content-center mt-4 mb-0">{pages}</Pagination>;
  };

  if (loading) {
    return (
      <div className="keyword-article-list">
        {[1, 2, 3].map((item) => (
          <div key={item} className="keyword-article-skeleton">
            <LoadingSkeleton width="160px" height="18px" className="mb-3" />
            <LoadingSkeleton width="80%" height="28px" className="mb-3" />
            <LoadingSkeleton width="100%" height="44px" className="mb-4" />
            <LoadingSkeleton width="140px" height="38px" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="keyword-article-state">
        <Icon icon="lucide:alert-triangle" width="42" className="keyword-article-state-icon mb-3" />
        <h3 className="keyword-article-state-title">Không thể tải danh sách bài báo</h3>
        <p className="text-muted-custom mb-4">{error}</p>
        <button type="button" className="btn keyword-article-retry px-4" onClick={onRetry}>Thử lại</button>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="keyword-article-state">
        <Icon icon="lucide:file-x" width="42" className="text-muted-custom mb-3" />
        <h3 className="keyword-article-state-title">Keyword này chưa có bài báo liên quan</h3>
        <p className="text-muted-custom mb-0">Hãy thử keyword khác để khám phá thêm xu hướng nghiên cứu.</p>
      </div>
    );
  }

  return (
    <>
      <div className="keyword-article-list">
        {articles.map((article) => (
          <KeywordArticleItem key={article.article_id} article={article} onViewDetail={onViewDetail} />
        ))}
      </div>
      {renderPagination()}
    </>
  );
}
