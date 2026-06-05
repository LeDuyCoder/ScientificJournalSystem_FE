import React from 'react';
import { Container, Pagination, Modal, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import useArticleList from '../hooks/useArticleList';
import ArticleStatsCards from '../components/ArticleStatsCards';
import ArticleFilterBar from '../components/ArticleFilterBar';
import ArticleTable from '../components/ArticleTable';

export default function ArticleListPage() {
  const {
    articles,
    total,
    currentPage,
    totalPages,
    isLoading,
    stats,
    filters,
    updateFilters,
    clearFilters,
    handlePageChange,
    handleDetailClick,
    showAuthModal,
    setShowAuthModal,
    handleAuthRedirect
  } = useArticleList();

  // Render pagination items custom
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];

    // Nút Trước
    items.push(
      <Pagination.Prev 
        key="prev" 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="mx-0.5"
      />
    );

    // Xác định khoảng trang hiển thị
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Trang 1 nếu có ellipsis
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    // Các trang ở giữa
    for (let p = startPage; p <= endPage; p++) {
      items.push(
        <Pagination.Item 
          key={p} 
          active={p === currentPage} 
          onClick={() => handlePageChange(p)}
        >
          {p}
        </Pagination.Item>
      );
    }

    // Trang cuối nếu có ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      items.push(
        <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Nút Tiếp
    items.push(
      <Pagination.Next 
        key="next" 
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="mx-0.5"
      />
    );

    return (
      <Pagination 
        className="justify-content-center m-0 custom-pagination"
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
    <div 
      className="min-vh-100 text-main grid-bg"
      style={{
        backgroundColor: 'var(--bg-main)',
        paddingTop: '90px',
        paddingBottom: '60px'
      }}
    >
      <Header />
      {/* Background gradients */}
      <div className="radial-fade position-fixed w-100 h-100 top-0 start-0 z-0" style={{ pointerEvents: 'none' }} />

      <Container className="position-relative z-1">
        {/* Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-3 text-muted-custom text-xs font-display">
          <span>Trang chủ</span>
          <Icon icon="lucide:chevron-right" width="12" />
          <span className="text-main">Bài báo</span>
        </div>

        {/* Page Header */}
        <div className="mb-4">
          <h1 className="font-display font-weight-bold text-main mb-2" style={{ fontSize: '2rem' }}>
            Kho lưu trữ Bài báo Khoa học
          </h1>
          <p className="text-muted-custom text-sm mb-0" style={{ maxWidth: '680px' }}>
            Duyệt qua, tìm kiếm và lọc hàng nghìn bài báo chất lượng cao được lưu trữ trong hệ thống ResearchPulse.
          </p>
        </div>

        {/* Thẻ thống kê */}
        <ArticleStatsCards stats={stats} isLoading={isLoading} />

        {/* Thanh lọc & Sắp xếp */}
        <ArticleFilterBar 
          filters={filters} 
          updateFilters={updateFilters} 
          clearFilters={clearFilters} 
        />

        {/* Kết quả đếm */}
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="text-muted-custom text-xs">
            Hiển thị <span className="text-main font-weight-bold">{articles.length}</span> trong{' '}
            <span className="text-main font-weight-bold">{total}</span> bài báo khoa học
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <ArticleTable 
          articles={articles} 
          isLoading={isLoading} 
          onDetailClick={handleDetailClick}
          onClearFilters={clearFilters}
        />

        {/* Phân trang */}
        <div className="mt-4">
          {renderPagination()}
        </div>
      </Container>

      {/* Warning Auth Modal */}
      <Modal 
        show={showAuthModal} 
        onHide={() => setShowAuthModal(false)}
        centered
        contentClassName="border-0 shadow-lg text-main"
        style={{
          '--bs-modal-bg': 'var(--bg-card)',
          '--bs-modal-border-radius': '16px'
        }}
      >
        <Modal.Body className="p-4 text-center">
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1px solid var(--border)'
            }}
          >
            <Icon icon="lucide:lock" width="30" height="30" />
          </div>
          <h4 className="font-display font-weight-bold mb-3 text-main">Yêu cầu Đăng nhập</h4>
          <p className="text-muted-custom text-sm mb-4" style={{ lineHeight: '1.6' }}>
            Để xem toàn bộ nội dung chi tiết bài báo, bao gồm tóm tắt học thuật đầy đủ, thông tin các tác giả liên kết và liên kết trích dẫn DOI, vui lòng đăng nhập tài khoản ResearchPulse của bạn.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowAuthModal(false)}
              className="px-4 py-2 text-xs font-semibold rounded-pill text-main border-secondary"
              style={{
                fontSize: '0.85rem'
              }}
            >
              Đóng
            </Button>
            <Button 
              className="btn-primary-glow border-0 px-4 py-2 text-xs font-semibold rounded-pill text-white"
              onClick={handleAuthRedirect}
              style={{
                fontSize: '0.85rem'
              }}
            >
              Đăng nhập ngay
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
