import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';
import useSandboxSearch from '../hooks/useSandboxSearch';

const typeConfig = {
  JOURNAL: {
    labelKey: 'typeJournal',
    icon: 'lucide:book-open',
    badgeClass: 'badge-journal',
    iconClass: 'text-blue-400',
  },
  AUTHOR: {
    labelKey: 'typeAuthor',
    icon: 'lucide:user',
    badgeClass: 'badge-author',
    iconClass: 'text-purple-400',
  },
  ARTICLE: {
    labelKey: 'typeArticle',
    icon: 'lucide:file-text',
    badgeClass: 'badge-article',
    iconClass: 'text-emerald-400',
  },
  KEYWORD: {
    labelKey: 'typeKeyword',
    icon: 'lucide:hash',
    badgeClass: 'badge-keyword',
    iconClass: 'text-amber-400',
  },
  AREA: {
    labelKey: 'typeArea',
    icon: 'lucide:layers',
    badgeClass: 'badge-area',
    iconClass: 'text-pink-400',
  },
  CATEGORY: {
    labelKey: 'typeCategory',
    icon: 'lucide:tag',
    badgeClass: 'badge-category',
    iconClass: 'text-indigo-400',
  },
};

const defaultType = {
  labelKey: 'search',
  icon: 'lucide:help-circle',
  badgeClass: 'badge-default',
  iconClass: 'text-secondary',
};

export default function Sandbox() {
  const { t } = useTranslation();
  const {
    searchValue,
    setSearchValue,
    isLoading,
    searchResult,
    error,
    handleTagClick,
    handleSearchSubmit,
  } = useSandboxSearch();

  const tags = [
    'LLM',
    'RAG',
    'Transformer',
    'Computer Vision',
    'Reinforcement Learning',
  ];

  return (
    <section id="search-sandbox" className="position-relative bg-dark-bg" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div className="mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '64rem' }}>

        {/* Glowing border container */}
        <div className="position-relative group rounded-3xl glass-border-container" style={{ padding: '1px' }}>

          {/* Card Body */}
          <div
            className="px-4 py-5 px-sm-5 py-sm-5 text-center position-relative overflow-hidden"
            style={{ backgroundColor: '#0c101d', borderRadius: '23px', zIndex: 10 }}
          >

            {/* Header label */}
            <div className="d-inline-flex align-items-center gap-2 text-cyan-400 text-xs fw-bold text-uppercase mb-4" style={{ letterSpacing: '0.15em' }}>
              <span>✦ {t('sandboxTitle')}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSearchSubmit} className="mx-auto position-relative mb-4" style={{ maxWidth: '48rem' }}>
              <div className="position-relative d-flex align-items-center">
                {/* Search Icon */}
                <div className="position-absolute start-0 ps-4 text-secondary d-flex align-items-center pe-none">
                  <Icon icon="lucide:search" className="fs-5" />
                </div>

                {/* Input Text Box */}
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t('sandboxPlaceholder')}
                  className="w-100 search-input rounded-pill bg-white/5 border-0 text-white placeholder-gray-500 fs-6 shadow-inner"
                  style={{ paddingLeft: '3.5rem', paddingRight: '8.5rem', paddingTop: '1rem', paddingBottom: '1rem', transition: 'all 0.3s ease' }}
                />

                {/* Search Button inside input */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="position-absolute end-0 me-2 btn rounded-pill bg-brand-gradient text-white fw-bold d-flex align-items-center gap-2 btn-hover-transform btn-primary-glow border-0"
                  style={{ padding: '0.625rem 1.5rem', fontSize: '0.875rem', letterSpacing: '0.05em' }}
                >
                  {isLoading ? (
                    <>
                      <Icon icon="lucide:loader-2" className="animate-spin" />
                      <span>...</span>
                    </>
                  ) : (
                    <>
                      <span>{t('searchBtn')} →</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Tag suggestions */}
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 mx-auto" style={{ maxWidth: '56rem' }}>
              <span className="text-cyan-400 fw-bold text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                — {t('tryNowLabel')}
              </span>
              <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="btn btn-sm rounded-pill bg-white/3 border-0 text-secondary text-xs fw-medium cursor-pointer btn-hover-transform hover-bg-white-10"
                    style={{ transition: 'all 0.2s ease', padding: '0.375rem 1rem' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Mock Results */}
            {isLoading && (
              <div className="mt-5 mx-auto p-4 rounded-3 bg-white/3 border-0 d-flex align-items-center justify-content-center gap-3 text-sm text-secondary animate-pulse" style={{ maxWidth: '42rem' }}>
                <Icon icon="lucide:database" className="text-cyan-400 animate-bounce" />
                <span>Analyzing publications databases...</span>
              </div>
            )}

            {error && (
              <div className="mt-5 mx-auto p-4 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 text-start animate-fade-in" style={{ maxWidth: '42rem' }}>
                <div className="d-flex align-items-start gap-3 text-danger">
                  <Icon icon="lucide:alert-circle" className="fs-4 shrink-0" />
                  <div>
                    <h5 className="fw-bold text-white fs-6 mb-1">API Error</h5>
                    <p className="text-xs text-secondary mb-0">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {searchResult && (
              <div
                className="mt-5 mx-auto p-4 rounded-3 bg-dark-card text-start animate-fade-in shadow-lg"
                style={{ maxWidth: '42rem', backdropFilter: 'blur(12px)' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle animate-pulse bg-green-400" style={{ width: '8px', height: '8px' }} />
                    <span className="text-xs font-bold tracking-wider uppercase text-green-400">
                      {t('realData')}
                    </span>
                  </div>
                  <span className="text-xs text-secondary">
                    {t('sourceLiveApi')}
                  </span>
                </div>
                <h4 className="fw-bold text-white fs-5 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {t('resultsFor')} "<span className="text-cyan-400">{searchResult.keyword}</span>"
                </h4>

                {searchResult.items && searchResult.items.length > 0 ? (
                  <div className="d-flex flex-column gap-2 overflow-y-auto pe-1 custom-scrollbar" style={{ maxHeight: '24rem' }}>
                    {searchResult.items.map((item, index) => {
                      const cfg = typeConfig[item.type] || defaultType;
                      return (
                        <div
                          key={item.id || index}
                          className="d-flex align-items-center justify-content-between p-3 rounded-3 search-result-item transition-all duration-200 group w-100 overflow-hidden"
                        >
                          <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
                            <div className={`p-2 rounded-3 bg-white/5  transition-all duration-200 shrink-0 ${cfg.iconClass}`}>
                              <Icon icon={cfg.icon} className="fs-5" />
                            </div>
                            <span className="fw-medium text-white fs-6 text-truncate group-hover-cyan transition-colors min-w-0">
                              {item.name && item.name.length > 200 ? `${item.name.substring(0, 200)}...` : item.name}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-pill fw-bold text-uppercase shrink-0 ms-3 ${cfg.badgeClass}`}
                            style={{ fontSize: '10px', letterSpacing: '0.05em' }}
                          >
                            {t(cfg.labelKey)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="d-flex flex-column items-center justify-content-center py-5 text-center">
                    <Icon icon="lucide:search-x" className="fs-1 text-secondary mb-3" />
                    <p className="text-sm text-secondary">{t('noResults')}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

