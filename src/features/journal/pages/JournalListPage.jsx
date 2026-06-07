import React from 'react';
import { Container, Pagination } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import JournalStatsCards from '../components/JournalStatsCards';
import JournalSearchBar from '../components/JournalSearchBar';
import JournalTable from '../components/JournalTable';
import useJournalList from '../hooks/useJournalList';

export default function JournalListPage() {
  const {
    journals,
    pagination,
    isLoading,
    loadingStats,
    error,
    stats,
    searchInput,
    setSearchInput,
    quartile,
    setQuartile,
    isOpenAccess,
    setIsOpenAccess,
    handleSearchSubmit,
    handlePageChange,
    refetch
  } = useJournalList();

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  // Clear all filters handler
  const handleClearAll = () => {
    setSearchInput('');
    setQuartile('all');
    setIsOpenAccess('all');
    // Force reset page and refetch via hook states indirectly
    window.location.reload();
  };

  // Build Pagination list items
  const renderPaginationItems = () => {
    const items = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
      items.push(
        <Pagination.Item 
          key={p} 
          active={p === pagination.page}
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
    <div 
      className="min-vh-100 text-main" 
      style={{ 
        backgroundColor: 'var(--bg-main)', 
        paddingTop: '100px', 
        paddingBottom: '80px' 
      }}
    >
      {/* Top Navigation */}
      <Header />

      <Container>
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0" style={{ fontSize: '0.8rem' }}>
            <li className="breadcrumb-item">
              <span 
                className="text-muted-custom" 
                style={{ cursor: 'pointer' }} 
                onClick={() => window.location.href = '/'}
              >
                Home
              </span>
            </li>
            <li className="breadcrumb-item active text-primary" aria-current="page">
              Tạp chí
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="text-start mb-4">
          <h1 className="font-display fw-bold mb-2 text-main" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}>
            Tạp chí
          </h1>
          <p className="text-muted-custom fs-6 mb-0">
            Danh sách tạp chí khoa học trong hệ thống
          </p>
        </div>

        {/* Statistic Cards */}
        <JournalStatsCards stats={stats} loading={loadingStats} />

        {/* Search & Filter Bar */}
        <JournalSearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          quartile={quartile}
          setQuartile={setQuartile}
          isOpenAccess={isOpenAccess}
          setIsOpenAccess={setIsOpenAccess}
          onSubmit={handleSearchSubmit}
          onClear={handleClearAll}
        />

        {/* Error State */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <Icon icon="lucide:alert-circle" width="18" />
            <div>{error}</div>
          </div>
        )}

        {/* Table & Loading Skeleton wrapper */}
        {isLoading ? (
          <div 
            className="p-4 border border-light" 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderRadius: '16px' 
            }}
          >
            <div className="skeleton-shimmer mb-3" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-shimmer mb-2" style={{ width: '100%', height: '60px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : (
          <>
            {/* Journal Table */}
            <JournalTable 
              journals={journals} 
              page={pagination.page} 
              limit={pagination.limit} 
            />

            {/* Pagination Controls */}
            {journals.length > 0 && totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="mb-0 custom-pagination gap-1">
                  <Pagination.Prev 
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  />
                  {renderPaginationItems()}
                  <Pagination.Next 
                    disabled={pagination.page === totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
