import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\keywords\pages\KeywordListPage.jsx
 */
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import KeywordSearchBar from '../components/KeywordSearchBar';
import KeywordSortDropdown from '../components/KeywordSortDropdown';
import KeywordList from '../components/KeywordList';
import { useKeywords } from '../hooks/useKeywords';
import './KeywordListPage.css';

/**
 * Trang danh sách Keywords.
 * Route: /keywords
 */
export default function KeywordListPage() {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const {
    keywords,
    pagination,
    loading,
    error,
    filters,
    actions
  } = useKeywords();
  const handleSearch = q => {
    actions.setKeyword(q);
  };
  const handleClearSearch = () => {
    actions.setKeyword('');
  };
  const handleSortChange = (sortBy, sortOrder) => {
    actions.setSort(sortBy, sortOrder);
  };
  const handlePageChange = page => {
    actions.setPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleViewArticles = keywordId => {
    navigate(`/keywords/${keywordId}/articles`);
  };
  return <div className="grid-bg keyword-list-page d-flex flex-column">
      <Header />

      <Container className="pb-5 flex-grow-1">
        <nav aria-label="breadcrumb" className="keyword-list-breadcrumb mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active text-main fw-semibold" aria-current="page">Keywords</li>
          </ol>
        </nav>

        <section className="keyword-list-hero">
          <div className="keyword-list-hero__content">
            <div className="keyword-list-eyebrow">
              <Icon icon="lucide:tags" width="18" />
              <span>Research Keywords</span>
            </div>
            <h1 className="keyword-list-title">{t("keywords.khamPhaKeywords")}</h1>
            <p className="keyword-list-description">{t("keywords.timKiemCacTuKhoaNghienCuuVaMoN")}</p>
            {pagination.total > 0 && <div className="keyword-list-total-pill">
                <Icon icon="lucide:database" width="16" />
                <span>{t("keywords.tongCong")}<strong>{pagination.total.toLocaleString()}</strong>{t("keywords.keywordTrongHeThong")}</span>
              </div>}
          </div>
        </section>

        <div className="keyword-toolbar">
          <div className="keyword-toolbar__search">
            <KeywordSearchBar value={filters.keyword} onSearch={handleSearch} onClear={handleClearSearch} />
          </div>
          <KeywordSortDropdown sortBy={filters.sortBy} sortOrder={filters.sortOrder} onChange={handleSortChange} />
        </div>

        {/* Active filter context */}
        {filters.keyword && <div className="keyword-active-filter">
            <span>{t("keywords.ketQuaTimKiemCho")}</span>
            <span className="keyword-active-filter__term">
              "{filters.keyword}"
            </span>
            <button type="button" className="btn btn-link btn-sm p-0 keyword-active-filter__clear" onClick={handleClearSearch}>
              <Icon icon="lucide:x" width="14" className="me-1" />{t("keyword.xoa")}</button>
          </div>}

        {/* Keyword grid */}
        <KeywordList keywords={keywords} loading={loading} error={error} pagination={pagination} onPageChange={handlePageChange} onViewArticles={handleViewArticles} onRetry={actions.refetch} />
      </Container>
    </div>;
}