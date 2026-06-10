/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\catalog\pages\CatalogSearchPage.jsx
 */
import { Container, Row, Col, Form, Button, InputGroup, Pagination, Dropdown, Breadcrumb } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useCatalogSearch } from '../hooks/useCatalogSearch';
import FilterPanel from '../components/FilterPanel';
import JournalTable from '../components/JournalTable';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import AuthRequiredModal from '../../../shared/components/AuthRequiredModal';
import Header from '../../landing/components/Header';
import useAuth from '../../auth/hooks/useAuth';

export default function CatalogSearchPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user } = auth;

  const {
    searchInput,
    setSearchInput,
    subjectAreas,
    subjectCategories,
    loadingFilters,
    journals,
    total,
    loadingJournals,
    error,
    page,
    sort,
    selectedAreas,
    selectedCategories,
    selectedAccess,
    selectedQuartiles,
    selectedYear,
    selectedZone,
    zones,
    isOaDiamond,
    followedJournals,
    showAuthModal,
    setShowAuthModal,
    handleSearchSubmit,
    onAreaSelect,
    onCategorySelect,
    onAccessSelect,
    onQuartileSelect,
    onYearSelect,
    onZoneSelect,
    handleOaDiamondToggle,
    handleClearAll,
    handleSortChange,
    handlePageChange,
    handleFollowJournal,
    fetchJournals
  } = useCatalogSearch(user);

  const totalPages = Math.ceil(total / 10) || 1;

  // Pagination giống trang Article List (ellipsis + sliding window)
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];

    // Nút Trước
    items.push(
      <Pagination.Prev 
        key="prev" 
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="mx-0.5"
      />
    );

    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Trang 1 nếu có ellipsis
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} active={1 === page} onClick={() => handlePageChange(1)}>1</Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    // Các trang ở giữa
    for (let p = startPage; p <= endPage; p++) {
      items.push(
        <Pagination.Item key={p} active={p === page} onClick={() => handlePageChange(p)}>{p}</Pagination.Item>
      );
    }

    // Trang cuối nếu có ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      items.push(
        <Pagination.Item key={totalPages} active={totalPages === page} onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>
      );
    }

    // Nút Tiếp
    items.push(
      <Pagination.Next 
        key="next" 
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
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
    <div className="min-vh-100 text-main" style={{ backgroundColor: 'var(--bg-main)', paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Navbar Header */}
      <Header />

      <Container>
        {/* Breadcrumbs */}
        <div aria-label="breadcrumb" className="mb-4">
          <Breadcrumb className="mb-0 custom-breadcrumb d-flex align-items-center">
            <Breadcrumb.Item
              onClick={() => navigate('/')}
              className="font-display d-flex align-items-center"
              linkProps={{ style: { cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1, color: 'var(--text-muted)', textDecoration: 'none' } }}
            >
              Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item active className="font-display d-flex align-items-center" style={{ fontSize: '0.9rem', lineHeight: 1, color: 'var(--text-muted)' }}>
              Tìm kiếm
            </Breadcrumb.Item>

          </Breadcrumb>
        </div>

        {/* Page Title & Subtitle */}
        <div className="text-start mb-4">
          <h1 className="font-display fw-bold mb-2 text-main" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}>
            Danh mục & Tìm kiếm
          </h1>
          <p className="text-muted-custom fs-6 mb-0">
            Tìm kiếm journal, lọc theo lĩnh vực, xem volumes và issues
          </p>
        </div>

        {/* Search Input Panel */}
        <div className="journal-dark-card p-4 mb-4 text-start" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Form onSubmit={handleSearchSubmit}>
            <Row className="g-3">
              <Col xs={12}>
                <InputGroup className="border border-light rounded-pill overflow-hidden p-1 bg-white align-items-center">
                  <InputGroup.Text className="bg-transparent border-0 text-muted-custom pe-0 py-2 ps-3">
                    <Icon icon="lucide:search" width="18" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Tìm journal, tác giả, ISSN..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="bg-transparent border-0 text-main py-2 px-3 fs-6 custom-input-placeholder shadow-none"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  <Button 
                    type="submit" 
                    className="btn-primary-glow border-0 px-4 py-2 text-white font-display fw-bold rounded-pill me-1"
                  >
                    Tìm kiếm
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Catalog Main Layout */}
        <div className="w-100">
          {/* Horizontal Top Filter Panel */}
          <FilterPanel
            subjectAreas={subjectAreas}
            subjectCategories={subjectCategories}
            selectedAreas={selectedAreas}
            selectedCategories={selectedCategories}
            selectedAccess={selectedAccess}
            selectedQuartiles={selectedQuartiles}
            onAreaSelect={onAreaSelect}
            onCategorySelect={onCategorySelect}
            onAccessSelect={onAccessSelect}
            onQuartileSelect={onQuartileSelect}
            selectedYear={selectedYear}
            selectedZone={selectedZone}
            zones={zones}
            onYearSelect={onYearSelect}
            onZoneSelect={onZoneSelect}
            isOaDiamond={isOaDiamond}
            onOaDiamondToggle={handleOaDiamondToggle}
            onClearAll={handleClearAll}
            loading={loadingFilters}
          />

          {/* Toolbar Panel */}
          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4 text-start">
            
            {/* Summary Counter text */}
            <div className="text-muted-custom text-sm">
              {loadingJournals ? (
                <span>Đang tìm kiếm tạp chí...</span>
              ) : (
                <span>
                  Tìm thấy <strong className="font-monospace" style={{ color: 'var(--text-main, #111)' }}>{total}</strong> journals · Trang <span className="font-monospace">{page}/{totalPages}</span>
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="light" 
                  id="sort-dropdown"
                  className="border border-light text-main text-xs py-2 px-3 fw-semibold d-flex align-items-center gap-2"
                  style={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px' }}
                >
                  <Icon icon="lucide:arrow-up-down" width="14" />
                  <span>
                    {sort === 'metric' && 'Mặc định'}
                    {sort === 'name' && 'Tên A-Z'}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-white border-light">
                  <Dropdown.Item onClick={() => handleSortChange('metric')} className="text-main hover:bg-light text-xs py-2">Mặc định</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange('name')} className="text-main hover:bg-light text-xs py-2">Tên A-Z</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

          </div>

          {/* Main Result Area */}
          {loadingJournals ? (
            // 3 Skeleton list cards loading placeholder
            <div>
              {[1, 2, 3].map((s) => (
                <div key={s} className="journal-dark-card p-4 mb-3 text-start" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <LoadingSkeleton width="60%" height="1.4rem" className="mb-3" />
                  <LoadingSkeleton width="45%" height="0.8rem" className="mb-3" />
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <LoadingSkeleton width="50px" height="1.2rem" />
                    <LoadingSkeleton width="100px" height="1.2rem" />
                    <LoadingSkeleton width="120px" height="1.2rem" />
                  </div>
                </div>
              ))}
            </div>
          ) : error && journals.length === 0 ? (
            // Error State Card
            <div className="journal-dark-card p-5 text-center my-4" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Icon icon={error?.includes('đăng nhập') ? 'lucide:lock' : 'lucide:alert-triangle'} 
                className={error?.includes('đăng nhập') ? 'text-warning mb-3' : 'text-danger mb-3'} 
                width="48" 
              />
              <h4 className="font-display fw-bold mb-2 text-main">
                {error?.includes('đăng nhập') ? 'Cần đăng nhập để tìm kiếm' : 'Không thể tải dữ liệu tìm kiếm'}
              </h4>
              <p className="text-muted-custom text-sm mb-4">{error}</p>
              {error?.includes('đăng nhập') ? (
                <Button variant="outline-primary" onClick={() => window.location.href = '/login'} className="px-4">
                  Đăng nhập
                </Button>
              ) : (
                <Button variant="outline-primary" onClick={() => fetchJournals()} className="px-4">
                  Thử lại
                </Button>
              )}
            </div>
          ) : journals.length === 0 ? (
            // Empty State Card
            <div className="journal-dark-card p-5 text-center my-4" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Icon icon="lucide:folder-search" className="text-warning mb-3" width="48" />
              <h4 className="font-display fw-bold mb-2 text-main">Không tìm thấy journal phù hợp</h4>
              <p className="text-muted-custom text-sm mb-4">Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc.</p>
              <Button variant="outline-primary" onClick={handleClearAll} className="px-4">
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <JournalTable
              journals={journals}
              followedJournals={followedJournals}
              onFollow={handleFollowJournal}
            />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !loadingJournals && (
            <div className="d-flex justify-content-center mt-5">
              {renderPagination()}
            </div>
          )}
        </div>
      </Container>

      {/* Guest Authentication Interception Modal */}
      <AuthRequiredModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
      />
    </div>
  );
}
