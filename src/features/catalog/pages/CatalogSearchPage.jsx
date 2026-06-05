import React, { useState } from 'react';
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
    handleQuartileToggle,
    handleAccessToggle,
    handleAreaToggle,
    handleCategoryToggle,
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
    <div className="min-vh-100 text-white" style={{ backgroundColor: '#090d16', paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Navbar Header */}
      <Header />

      <Container>
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0" style={{ fontSize: '0.8rem' }}>
            <li className="breadcrumb-item">
              <span className="text-secondary" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>Home</span>
            </li>
            <li className="breadcrumb-item active text-info" aria-current="page">Tìm kiếm</li>
          </ol>
        </nav>

        {/* Page Title & Subtitle */}
        <div className="text-start mb-4">
          <h1 className="font-display fw-bold mb-2 text-white" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}>
            Danh mục & Tìm kiếm
          </h1>
          <p className="text-white-50 fs-6 mb-0">
            Tìm kiếm journal, lọc theo lĩnh vực, xem volumes và issues
          </p>
        </div>

        {/* Search Input Panel */}
        <div className="journal-dark-card p-4 mb-4 text-start" style={{ borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
          <Form onSubmit={handleSearchSubmit}>
            <Row className="g-3">
              <Col xs={12}>
                <InputGroup className="border border-white-10 rounded-3 overflow-hidden bg-black-20">
                  <InputGroup.Text className="bg-transparent border-0 text-white-40 pe-0">
                    <Icon icon="lucide:search" width="20" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Tìm journal, tác giả, ISSN..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="bg-transparent border-0 text-white py-3 px-3 fs-6 custom-input-placeholder"
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
        <Row className="g-4">
          {/* Left Column - Filter Panel */}
          <Col lg={4} xl={3}>
            <FilterPanel
              subjectAreas={subjectAreas}
              subjectCategories={subjectCategories}
              selectedAreas={selectedAreas}
              selectedCategories={selectedCategories}
              selectedAccess={selectedAccess}
              selectedQuartiles={selectedQuartiles}
              onAreaToggle={handleAreaToggle}
              onCategoryToggle={handleCategoryToggle}
              onAccessToggle={handleAccessToggle}
              onQuartileToggle={handleQuartileToggle}
              onClearAll={handleClearAll}
              loading={loadingFilters}
            />
          </Col>

          {/* Right Column - Results and list info */}
          <Col lg={8} xl={9}>
            
            {/* Toolbar Panel */}
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4 text-start">
              
              {/* Summary Counter text */}
              <div className="text-white-60 text-sm">
                {loadingJournals ? (
                  <span>Đang tìm kiếm tạp chí...</span>
                ) : (
                  <span>
                    Tìm thấy <strong className="text-info font-monospace">{total}</strong> journals · Trang <span className="font-monospace">{page}/{totalPages}</span>
                  </span>
                )}
              </div>

              {/* Sort Selection & View toggles */}
              <div className="d-flex align-items-center gap-3">
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="dark" 
                    id="sort-dropdown"
                    className="border-white-10 text-white-80 text-xs py-2 px-3 fw-semibold d-flex align-items-center gap-2"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}
                  >
                    <Icon icon="lucide:arrow-up-down" width="14" />
                    <span>
                      {sort === 'relevance' && 'Mặc định'}
                      {sort === 'metric' && 'Metric cao nhất'}
                      {sort === 'name' && 'Tên A-Z'}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bg-[#0e1322] border-white-10">
                    <Dropdown.Item onClick={() => handleSortChange('relevance')} className="text-white-80 hover:bg-white-5 text-xs py-2">Mặc định</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('metric')} className="text-white-80 hover:bg-white-5 text-xs py-2">Metric cao nhất</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('name')} className="text-white-80 hover:bg-white-5 text-xs py-2">Tên A-Z</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <div className="d-flex border border-white-10 rounded-3 overflow-hidden bg-black-20">
                  <Button variant="dark" className="border-0 bg-transparent text-info p-2 d-flex align-items-center">
                    <Icon icon="lucide:list" width="18" />
                  </Button>
                  <Button variant="dark" disabled className="border-0 bg-transparent text-white-30 p-2 d-flex align-items-center">
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
                  <div key={s} className="journal-dark-card p-4 mb-3 text-start" style={{ borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.015)' }}>
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
              <div className="journal-dark-card p-5 text-center my-4" style={{ borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <Icon icon="lucide:alert-triangle" className="text-danger mb-3" width="48" />
                <h4 className="font-display fw-bold mb-2">Không thể tải dữ liệu tìm kiếm</h4>
                <p className="text-white-50 text-sm mb-4">Vui lòng kiểm tra lại kết nối hoặc thử lại sau.</p>
                <Button variant="outline-info" onClick={() => fetchJournals()} className="btn-outline-glow px-4">
                  Thử lại
                </Button>
              </div>
            ) : journals.length === 0 ? (
              // Empty State Card
              <div className="journal-dark-card p-5 text-center my-4" style={{ borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <Icon icon="lucide:folder-search" className="text-warning mb-3" width="48" />
                <h4 className="font-display fw-bold mb-2">Không tìm thấy journal phù hợp</h4>
                <p className="text-white-50 text-sm mb-4">Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc.</p>
                <Button variant="outline-info" onClick={handleClearAll} className="btn-outline-glow px-4">
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
                <Pagination className="custom-pagination border border-white-05 p-1 rounded-3 bg-black-20">
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

          </Col>
        </Row>
      </Container>

      {/* Guest Authentication Interception Modal */}
      <AuthRequiredModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
      />
    </div>
  );
}
