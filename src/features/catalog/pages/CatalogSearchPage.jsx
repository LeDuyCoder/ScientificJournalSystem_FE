import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\catalog\pages\CatalogSearchPage.jsx
 */
import { Container, Dropdown, Breadcrumb } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useCatalogSearch } from '../hooks/useCatalogSearch';
import FilterPanel from '../components/FilterPanel';
import JournalTable from '../components/JournalTable';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import AuthRequiredModal from '../../../shared/components/AuthRequiredModal';
import Header from '../../landing/components/Header';
import useAuth from '../../auth/hooks/useAuth';
import AdminPagination from '../../../shared/components/Pagination';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import '../components/CatalogSearch.css';
export default function CatalogSearchPage() {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    user
  } = auth;
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
  const pageLimit = 10;
  const totalPages = Math.ceil(total / pageLimit) || 1;
  return <div className="min-vh-100 text-main catalog-search-page">
      {/* Navbar Header */}
      <Header />

      <Container className="catalog-shell">
        {/* Breadcrumbs */}
        <div aria-label="breadcrumb" className="catalog-breadcrumb">
          <Breadcrumb className="mb-0 custom-breadcrumb d-flex align-items-center">
            <Breadcrumb.Item onClick={() => navigate('/')} className="d-flex align-items-center" linkProps={{
            style: {
              cursor: 'pointer'
            }
          }}>{t("home")}</Breadcrumb.Item>
            <Breadcrumb.Item active className="d-flex align-items-center">{t("search")}</Breadcrumb.Item>

          </Breadcrumb>
        </div>

        {/* Page Title & Subtitle */}
        <section className="catalog-hero text-start">
          <h1 className="catalog-title">{t("catalog.danhMucTimKiem")}</h1>
          <p className="catalog-subtitle">{t("catalog.timKiemJournalLocTheoLinhVucXe")}</p>
        </section>

        {/* Catalog Main Layout */}
        <div className="w-100">
          {/* Toolbar Filter Panel */}
          <FilterPanel searchInput={searchInput} setSearchInput={setSearchInput} onSearchSubmit={handleSearchSubmit} subjectAreas={subjectAreas} subjectCategories={subjectCategories} selectedAreas={selectedAreas} selectedCategories={selectedCategories} selectedAccess={selectedAccess} selectedQuartiles={selectedQuartiles} onAreaSelect={onAreaSelect} onCategorySelect={onCategorySelect} onAccessSelect={onAccessSelect} onQuartileSelect={onQuartileSelect} selectedYear={selectedYear} selectedZone={selectedZone} zones={zones} onYearSelect={onYearSelect} onZoneSelect={onZoneSelect} isOaDiamond={isOaDiamond} onOaDiamondToggle={handleOaDiamondToggle} onClearAll={handleClearAll} loading={loadingFilters} />

          {/* Toolbar Panel */}
          <div className="catalog-toolbar d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 text-start">
            
            {/* Summary Counter text */}
            <div className="text-muted-custom catalog-count">
              {loadingJournals ? <span>{t("catalog.dangTimKiemTapChi")}</span> : <span>{t("catalog.timThay")}<strong>{total}</strong> journals · Trang <span className="catalog-number">{page}/{totalPages}</span>
                </span>}
            </div>

            {/* Sort Dropdown */}
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="sort-dropdown" className="catalog-sort-toggle">
                  <Icon icon="lucide:arrow-up-down" width="14" />
                  <span>
                    {sort === 'metric' && t("catalog.macDinh")}
                    {sort === 'name' && t("catalog.tenAz")}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="catalog-dropdown-menu">
                  <Dropdown.Item onClick={() => handleSortChange('metric')}>{t("catalog.macDinh")}</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange('name')}>{t("catalog.tenAz")}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

          </div>

          {/* Main Result Area */}
          {loadingJournals ?
        // 3 Skeleton list cards loading placeholder
        <div>
              {[1, 2, 3].map(s => <section key={s} className="catalog-surface p-4 mb-3 text-start">
                  <LoadingSkeleton width="60%" height="1.4rem" className="mb-3" />
                  <LoadingSkeleton width="45%" height="0.8rem" className="mb-3" />
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <LoadingSkeleton width="50px" height="1.2rem" />
                    <LoadingSkeleton width="100px" height="1.2rem" />
                    <LoadingSkeleton width="120px" height="1.2rem" />
                  </div>
                </section>)}
            </div> : error && journals.length === 0 ? <section className="catalog-surface catalog-state-card">
              <Icon icon={error?.includes(t("catalog.dangNhap")) ? 'lucide:lock' : 'lucide:alert-triangle'} className="catalog-state-icon" width="44" />
              <h2 className="catalog-state-title">
                {error?.includes(t("catalog.dangNhap")) ? t("catalog.canDangNhapDeTimKiem") : t("catalog.khongTheTaiDuLieuTimKiem")}
              </h2>
              <p className="text-muted-custom mb-4">{error}</p>
              {error?.includes(t("catalog.dangNhap")) ? <PrimaryButton onClick={() => window.location.href = '/login'} variant="outline">{t("signIn")}</PrimaryButton> : <PrimaryButton onClick={() => fetchJournals()} variant="outline">{t("article.thuLai")}</PrimaryButton>}
            </section> : journals.length === 0 ?
        // Empty State Card
        <section className="catalog-surface catalog-state-card">
              <Icon icon="lucide:folder-search" className="catalog-state-icon" width="44" />
              <h2 className="catalog-state-title">{t("catalog.khongTimThayJournalPhuHop")}</h2>
              <p className="text-muted-custom mb-4">{t("catalog.hayThuThayDoiTuKhoaTimKiemHoac")}</p>
              <PrimaryButton onClick={handleClearAll} variant="outline">{t("article.xoaBoLoc")}</PrimaryButton>
            </section> : <JournalTable journals={journals} followedJournals={followedJournals} onFollow={handleFollowJournal} />}

          {/* Pagination Controls */}
          {totalPages > 1 && !loadingJournals && <div className="mt-5">
              <AdminPagination totalItems={total} currentPage={page} limit={pageLimit} onPageChange={handlePageChange} entityName="journals" />
            </div>}
        </div>
      </Container>

      {/* Guest Authentication Interception Modal */}
      <AuthRequiredModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
    </div>;
}