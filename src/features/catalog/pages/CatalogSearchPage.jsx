import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Pagination, Dropdown } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useCatalogSearch } from '../hooks/useCatalogSearch';
import FilterPanel from '../components/FilterPanel';
import JournalResultCard from '../components/JournalResultCard';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import AuthRequiredModal from '../../journal/components/AuthRequiredModal';
import Header from '../../landing/components/Header';
import useAuth from '../../auth/hooks/useAuth';

export default function CatalogSearchPage() {
  const auth = useAuth ? useAuth() : { user: null };
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
    search,
    page,
    limit,
    sort,
    selectedAreas,
    selectedCategories,
    selectedAccess,
    selectedQuartiles,
    followedJournals,
    showAuthModal,
    setShowAuthModal,
    handleSearchSubmit,
    searchForTag,
    onAreaSelect,
    onCategorySelect,
    onAccessSelect,
    onQuartileSelect,
    handleClearAll,
    handleSortChange,
    handlePageChange,
    handleFollowJournal,
    fetchJournals
  } = useCatalogSearch(user);

  const totalPages = Math.ceil(total / limit) || 1;

  // Build Pagination Item array
  const renderPaginationItems = () => {
    const items = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
      items.push(
        <Pagination.Item 
          key={p} 
          active={p === page}
          onClick={() => handlePageChange(p)}
          className="mx-0.5"
        >
          {p}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <div className="min-vh-100 text-main" style={{ backgroundColor: 'var(--bg-main)', paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Navbar Header */}
      <Header />

      <Container>
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0" style={{ fontSize: '0.8rem' }}>
            <li className="breadcrumb-item">
              <span className="text-muted-custom" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>Home</span>
            </li>
            <li className="breadcrumb-item active text-primary" aria-current="page">Tìm kiếm</li>
          </ol>
        </nav>

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
                <InputGroup className="border border-light rounded-3 overflow-hidden bg-white">
                  <InputGroup.Text className="bg-transparent border-0 text-muted-custom pe-0">
                    <Icon icon="lucide:search" width="20" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Tìm journal, tác giả, ISSN..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="bg-transparent border-0 text-main py-3 px-3 fs-6 custom-input-placeholder"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  <Button 
                    type="submit" 
                    className="btn-primary-glow border-0 px-4 text-white font-display fw-bold"
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
                  Tìm thấy <strong className="text-primary font-monospace">{total}</strong> journals · Trang <span className="font-monospace">{page}/{totalPages}</span>
                </span>
              )}
            </div>

            {/* Sort Selection & View toggles */}
            <div className="d-flex align-items-center gap-3">
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="light" 
                  id="sort-dropdown"
                  className="border border-light text-main text-xs py-2 px-3 fw-semibold d-flex align-items-center gap-2"
                  style={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px' }}
                >
                  <Icon icon="lucide:arrow-up-down" width="14" />
                  <span>
                    {sort === 'relevance' && 'Mặc định'}
                    {sort === 'metric' && 'Metric cao nhất'}
                    {sort === 'name' && 'Tên A-Z'}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-white border-light">
                  <Dropdown.Item onClick={() => handleSortChange('relevance')} className="text-main hover:bg-light text-xs py-2">Mặc định</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange('metric')} className="text-main hover:bg-light text-xs py-2">Metric cao nhất</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange('name')} className="text-main hover:bg-light text-xs py-2">Tên A-Z</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div className="d-flex border border-light rounded-3 overflow-hidden bg-white">
                <Button variant="light" className="border-0 bg-transparent text-primary p-2 d-flex align-items-center">
                  <Icon icon="lucide:list" width="18" />
                </Button>
                <Button variant="light" disabled className="border-0 bg-transparent text-muted-custom p-2 d-flex align-items-center">
                  <Icon icon="lucide:grid" width="18" />
                </Button>
              </div>
            </div>

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
            // List cards map
            <div className="d-flex flex-column">
              {journals.map((journal) => (
                <JournalResultCard
                  key={journal.id}
                  journal={journal}
                  isFollowed={!!followedJournals[journal.id]}
                  onFollow={handleFollowJournal}
                  onTagClick={searchForTag}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !loadingJournals && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination className="custom-pagination border border-light p-1 rounded-3 bg-white">
                <Pagination.Prev 
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                />
                {renderPaginationItems()}
                <Pagination.Next 
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                />
              </Pagination>
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
