import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import Icon from '../../../shared/components/Icon';
import useSandboxSearch from '../hooks/useSandboxSearch';

const typeConfig = {
  JOURNAL: {
    labelKey: 'typeJournal',
    icon: 'lucide:book-open',
    variant: 'primary',
    textColor: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)'
  },
  AUTHOR: {
    labelKey: 'typeAuthor',
    icon: 'lucide:user',
    variant: 'secondary',
    textColor: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.2)'
  },
  ARTICLE: {
    labelKey: 'typeArticle',
    icon: 'lucide:file-text',
    variant: 'success',
    textColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)'
  },
  KEYWORD: {
    labelKey: 'typeKeyword',
    icon: 'lucide:hash',
    variant: 'warning',
    textColor: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)'
  },
  AREA: {
    labelKey: 'typeArea',
    icon: 'lucide:layers',
    variant: 'danger',
    textColor: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.2)'
  },
  CATEGORY: {
    labelKey: 'typeCategory',
    icon: 'lucide:tag',
    variant: 'info',
    textColor: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.2)'
  },
};

const defaultType = {
  labelKey: 'search',
  icon: 'lucide:help-circle',
  variant: 'dark',
  textColor: '#94a3b8',
  bgColor: 'rgba(148, 163, 184, 0.1)',
  borderColor: 'rgba(148, 163, 184, 0.2)'
};

export default function Sandbox() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    <section id="search-sandbox" className="py-5 bg-dark-bg position-relative">
      <Container style={{ maxWidth: '960px' }}>
        {/* Glowing border card container */}
        <div 
          className="p-1 rounded-5"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(122, 0, 255, 0.05) 50%, rgba(0, 210, 255, 0.1) 100%)',
            boxShadow: '0 15px 45px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Card Body */}
          <div 
            className="rounded-5 py-5 px-4 p-sm-5 text-center position-relative overflow-hidden"
            style={{ backgroundColor: '#0c101d', zIndex: 1 }}
          >
            {/* Header label */}
            <div className="d-inline-flex align-items-center gap-2 mb-4 text-info text-xs font-bold tracking-wider text-uppercase" style={{ fontSize: '0.75rem' }}>
              <Icon icon="lucide:sparkle" className="text-info animate-spin-slow" />
              <span>{t('sandboxTitle')}</span>
            </div>

            {/* Form */}
            <Form onSubmit={handleSearchSubmit} className="mx-auto mb-4" style={{ maxWidth: '720px' }}>
              <InputGroup size="lg" className="rounded-pill overflow-hidden border border-white-10 bg-white-5 p-1 align-items-center">
                <span className="bg-transparent border-0 text-white-50 px-3 d-flex align-items-center justify-content-center">
                  <Icon icon="lucide:search" className="fs-5" />
                </span>
                
                <Form.Control
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t('sandboxPlaceholder')}
                  className="bg-transparent border-0 text-white placeholder-gray-500 shadow-none fs-6 py-2.5"
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'transparent'
                  }}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary-glow rounded-pill px-4 py-2 text-xs font-bold border-0 d-flex align-items-center gap-2 me-1"
                  style={{ fontSize: '0.8rem' }}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                      <span>...</span>
                    </>
                  ) : (
                    <>
                      <span>{t('searchBtn')}</span>
                      <Icon icon="lucide:arrow-right" className="fs-6" />
                    </>
                  )}
                </Button>
              </InputGroup>
            </Form>

            {/* Tag suggestions */}
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 mx-auto" style={{ maxWidth: '800px' }}>
              <span className="text-white-50 font-bold tracking-wider text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                <Icon icon="lucide:sliders" style={{ fontSize: '0.65rem' }} />
                <span>{t('tryNowLabel')}</span>
              </span>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    variant="dark"
                    size="sm"
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1.5 rounded-pill border-white-5 text-white-50 hover:text-info hover:bg-info-10 hover:border-info-20 text-xs font-semibold"
                    style={{
                      fontSize: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderColor: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Interactive Mock Results */}
            {isLoading && (
              <div 
                className="mt-4 mx-auto p-4 rounded-4 border d-flex align-items-center justify-content-center gap-2 text-white-50"
                style={{
                  maxWidth: '600px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.85rem'
                }}
              >
                <Icon icon="lucide:database" className="text-info animate-bounce fs-5" />
                <span>Analyzing publications databases...</span>
              </div>
            )}

            {error && (
              <div 
                className="mt-4 mx-auto p-4 rounded-4 border text-start"
                style={{
                  maxWidth: '600px',
                  backgroundColor: 'rgba(220, 53, 69, 0.08)',
                  borderColor: 'rgba(220, 53, 69, 0.2)'
                }}
              >
                <div className="d-flex align-items-start gap-3 text-danger">
                  <Icon icon="lucide:alert-circle" className="fs-4 mt-1" />
                  <div>
                    <h5 className="font-bold text-white text-sm m-0">API Error</h5>
                    <p className="text-white-50 mt-1 mb-0" style={{ fontSize: '0.75rem' }}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {searchResult && (
              <div 
                className="mt-4 mx-auto p-4 rounded-4 border text-start"
                style={{
                  maxWidth: '600px',
                  backgroundColor: 'rgba(14, 20, 36, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-white-10 pb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="rounded-circle animate-pulse" 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: searchResult.isRealData ? '#198754' : '#ffc107' 
                      }} 
                    />
                    <span 
                      className="font-bold tracking-wider text-uppercase" 
                      style={{ 
                        fontSize: '0.65rem', 
                        color: searchResult.isRealData ? '#198754' : '#ffc107' 
                      }}
                    >
                      {searchResult.isRealData ? t('realData') : 'Offline Demo Data'}
                    </span>
                  </div>
                  <span className="text-white-50" style={{ fontSize: '0.7rem' }}>
                    {searchResult.isRealData ? t('sourceLiveApi') : 'Simulated Sandbox'}
                  </span>
                </div>
                
                <h4 className="font-display font-bold text-white mb-3" style={{ fontSize: '1.05rem' }}>
                  {t('resultsFor')} "<span className="text-info">{searchResult.keyword}</span>"
                </h4>

                {searchResult.items && searchResult.items.length > 0 ? (
                  <div className="d-flex flex-column gap-2 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '380px' }}>
                    {searchResult.items.map((item, index) => {
                      const cfg = typeConfig[item.type] || defaultType;
                      return (
                        <div
                          key={item.id || index}
                          className="d-flex align-items-center justify-content-between p-3 rounded-3 border transition-all"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderColor: 'rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease',
                            cursor: item.type === 'JOURNAL' ? 'pointer' : 'default'
                          }}
                          onClick={() => {
                            if (item.type === 'JOURNAL') {
                              navigate(`/journals/${item.id}`);
                            }
                          }}
                          onMouseEnter={(e) => {
                            if (item.type === 'JOURNAL') {
                              e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.3)';
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (item.type === 'JOURNAL') {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                            }
                          }}
                        >
                          <div className="d-flex align-items-center gap-3 text-truncate">
                            <div 
                              className="p-2 rounded-3 border d-flex align-items-center justify-content-center" 
                              style={{
                                color: cfg.textColor,
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                borderColor: 'rgba(255, 255, 255, 0.05)'
                              }}
                            >
                              <Icon icon={cfg.icon} className="fs-5" />
                            </div>
                            <span 
                              className="font-medium text-white text-sm text-truncate"
                              style={{ fontSize: '0.875rem' }}
                            >
                              {item.name}
                            </span>
                          </div>
                          <Badge 
                            style={{
                              backgroundColor: cfg.bgColor,
                              color: cfg.textColor,
                              border: `1px solid ${cfg.borderColor}`,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              padding: '0.35em 0.65em'
                            }}
                          >
                            {t(cfg.labelKey)}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center text-white-50">
                    <Icon icon="lucide:search-x" className="fs-1 text-white-30 mb-2" />
                    <p className="text-sm m-0" style={{ fontSize: '0.85rem' }}>{t('noResults')}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </Container>
    </section>
  );
}
