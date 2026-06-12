/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\keywords\components\KeywordList.jsx
 */
import { Row, Col, Pagination } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import KeywordListItem from './KeywordListItem';

/**
 * Danh sách keyword kèm loading, empty, error và pagination.
 */
export default function KeywordList({ keywords, loading, error, pagination, onPageChange, onViewArticles, onRetry }) {
  const totalPages = pagination?.total_pages || 1;
  const currentPage = pagination?.page || 1;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    items.push(<Pagination.Prev key="prev" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />);
    if (startPage > 1) {
      items.push(<Pagination.Item key={1} onClick={() => onPageChange(1)}>1</Pagination.Item>);
      if (startPage > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }
    Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).forEach((pageNumber) => {
      items.push(
        <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => onPageChange(pageNumber)}>
          {pageNumber}
        </Pagination.Item>
      );
    });
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      items.push(<Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>{totalPages}</Pagination.Item>);
    }
    items.push(<Pagination.Next key="next" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} />);

    return <Pagination className="keyword-pagination justify-content-center mt-4 mb-0">{items}</Pagination>;
  };

  if (loading) {
    return (
      <Row className="g-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Col md={6} xl={4} key={item}>
            <div className="keyword-skeleton-card">
              <LoadingSkeleton width="120px" height="14px" className="mb-3" />
              <LoadingSkeleton width="80%" height="28px" className="mb-3" />
              <LoadingSkeleton width="140px" height="22px" className="mb-4" />
              <LoadingSkeleton width="180px" height="40px" />
            </div>
          </Col>
        ))}
      </Row>
    );
  }

  if (error) {
    return (
      <div className="keyword-state-card">
        <Icon icon="lucide:alert-triangle" width="42" className="keyword-state-icon mb-3" />
        <h3 className="keyword-state-title mb-2">Không thể tải danh sách keywords</h3>
        <p className="text-muted-custom mb-4">{error}</p>
        <button type="button" onClick={onRetry} className="btn keyword-retry-btn px-4">Thử lại</button>
      </div>
    );
  }

  if (!keywords || keywords.length === 0) {
    return (
      <div className="keyword-state-card">
        <Icon icon="lucide:inbox" width="42" className="text-muted-custom mb-3" />
        <h3 className="keyword-state-title mb-2">Không tìm thấy keyword phù hợp</h3>
        <p className="text-muted-custom mb-0">Thử đổi từ khóa tìm kiếm hoặc reset bộ lọc.</p>
      </div>
    );
  }

  return (
    <>
      <Row className="g-3">
        {keywords.map((keyword) => (
          <Col md={6} xl={4} key={keyword.keyword_id}>
            <KeywordListItem keyword={keyword} onViewArticles={onViewArticles} />
          </Col>
        ))}
      </Row>
      {renderPagination()}
    </>
  );
}
