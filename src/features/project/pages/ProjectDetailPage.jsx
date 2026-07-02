import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ROUTES from '../../../app/routes/routePaths';
import { useKeywordTracking } from '../../keyword/hooks/useKeywordTracking';
import KeywordWatchList from '../../keyword/components/KeywordWatchList';
import AddKeywordModal from '../../keyword/components/AddKeywordModal';
import ManageKeywordsModal from '../../keyword/components/ManageKeywordsModal';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';


const ProjectDetailPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const {
    project,
    watchArticles,
    keywordArticles,
    watchedKeywords,
    watchArticlesPagination,
    keywordArticlesPagination,
    loading,
    error,
    actionLoading,
    addKeywordWatch,
    removeKeywordWatch,
    fetchWatchArticles,
    fetchKeywordArticles
  } = useKeywordTracking(projectId);

  const [activeTab, setActiveTab] = useState('articles'); // 'overview', 'articles', 'keywords'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  const renderPagination = (type) => {
    const pagination = type === 'keywords' ? keywordArticlesPagination : watchArticlesPagination;
    const fetchFn = type === 'keywords' ? fetchKeywordArticles : fetchWatchArticles;

    if (!pagination || pagination.totalPages <= 1) return null;
    const { page, totalPages } = pagination;

    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <ul className="pagination shadow-sm">
          <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
            <button className="page-link text-dark" onClick={() => fetchFn(page - 1)} style={{ cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>
              <Icon icon="lucide:chevron-left" />
            </button>
          </li>
          {pages.map((p, idx) => (
            <li key={idx} className={`page-item ${p === page ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}>
              <button 
                className={`page-link ${p === page ? '' : 'text-dark'}`}
                style={p === page ? { backgroundColor: '#fd7e14', borderColor: '#fd7e14', color: '#fff', cursor: 'default' } : { cursor: p === '...' ? 'default' : 'pointer' }}
                onClick={() => p !== '...' && p !== page && fetchFn(p)}
              >
                {p}
              </button>
            </li>
          ))}
          <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
            <button className="page-link text-dark" onClick={() => fetchFn(page + 1)} style={{ cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>
              <Icon icon="lucide:chevron-right" />
            </button>
          </li>
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid py-4 grid-bg min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container-fluid py-4 grid-bg min-vh-100">
        <div className="container mx-auto" style={{ maxWidth: '1000px', marginTop: '20px' }}>
          <div className="alert alert-danger border-0 rounded-4 shadow-sm p-4 d-flex align-items-center gap-3">
            <Icon icon="lucide:alert-triangle" width="24" className="text-danger flex-shrink-0" />
            <div>
              <h6 className="fw-bold mb-1">Không thể tải dự án</h6>
              <p className="mb-0 small">{error || 'Dự án không tồn tại hoặc đã bị xóa.'}</p>
            </div>
            <button className="btn btn-outline-danger btn-sm ms-auto" onClick={() => navigate(ROUTES.PROJECTS)}>Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  const title = project.title || 'Untitled Project';
  const areaName = project.subject_area?.display_name || project.subject_area?.name || (typeof project.subject_area === 'string' ? project.subject_area : 'Chưa xác định lĩnh vực');
  const createdAt = project.created_at ? new Date(project.created_at).toLocaleDateString('vi-VN') : 'N/A';
  const keywordCount = watchedKeywords?.length || 0;
  const articleCount = watchArticlesPagination?.total || 0;

  return (
    <div className="container-fluid pb-4 grid-bg min-vh-100 position-relative overflow-hidden" style={{ paddingTop: '80px' }}>
      <div className="position-absolute w-100 h-100 radial-fade pe-none" style={{ top: 0, left: 0, zIndex: 0 }} />
      <Header />
      <div className="container mx-auto position-relative z-1" style={{ maxWidth: '1200px', marginTop: '40px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-2 text-muted-custom small">
            <li className="breadcrumb-item"><Link to={ROUTES.DASHBOARD} className="text-decoration-none text-muted-custom hover-primary">Tổng quan</Link></li>
            <li className="breadcrumb-item"><Link to={ROUTES.PROJECTS} className="text-decoration-none text-muted-custom hover-primary">Dự án theo dõi</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{title}</li>
          </ol>
        </nav>

        {/* Header section (Mockup 3) */}
        <div className="glass-card rounded-4 shadow-sm border p-4 p-md-5 mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge rounded-pill text-primary fw-medium" style={{ backgroundColor: 'var(--primary-light)' }}>
                  {areaName}
                </span>
                <span className="text-muted-custom small">Cập nhật lúc: {createdAt}</span>
              </div>
              <h1 className="font-display fw-bold text-main mb-0" style={{ fontSize: '2rem' }}>{title}</h1>
            </div>
            <div className="d-flex gap-2">

              <PrimaryButton
                className="px-3"
                onClick={() => setShowAddModal(true)}
              >
                <Icon icon="lucide:search" width="16" /> Tìm trong lĩnh vực
              </PrimaryButton>
            </div>
          </div>

          <div className="row g-4 pt-4 border-top">
            <div className="col-6 col-md-3">
              <div className="text-muted-custom small mb-1 text-uppercase tracking-wider fw-semibold">Từ khóa theo dõi</div>
              <div className="fs-3 fw-bold text-main">{keywordCount}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted-custom small mb-1 text-uppercase tracking-wider fw-semibold">Bài báo liên quan</div>
              <div className="fs-3 fw-bold text-main">{articleCount}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted-custom small mb-1 text-uppercase tracking-wider fw-semibold">Cảnh báo mới (24H)</div>
              <div className={`fs-3 fw-bold d-flex align-items-center gap-1 ${(project?.alerts_24h?.todayCount || 0) > 0 ? 'text-success' : 'text-main'}`}>
                <Icon icon="lucide:bell" width="20" /> {project?.alerts_24h?.todayCount || 0}
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted-custom small mb-1 text-uppercase tracking-wider fw-semibold">Mức độ tăng trưởng</div>
              <div className={`fs-3 fw-bold d-flex align-items-center gap-1 ${
                (project?.alerts_24h?.growthRate || 0) > 0 ? 'text-success' : 
                (project?.alerts_24h?.growthRate || 0) < 0 ? 'text-danger' : 'text-muted'
              }`}>
                <Icon icon={(project?.alerts_24h?.growthRate || 0) > 0 ? "lucide:trending-up" : (project?.alerts_24h?.growthRate || 0) < 0 ? "lucide:trending-down" : "lucide:minus"} width="24" /> 
                {(project?.alerts_24h?.growthRate || 0) > 0 ? '+' : ''}{project?.alerts_24h?.growthRate || 0}%
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs tab-nav-custom mb-4 border-bottom-0 gap-4" style={{ paddingLeft: '1rem' }}>
          <li className="nav-item">
            <button
              className={`nav-link border-0 bg-transparent px-0 pb-3 fw-medium ${activeTab === 'overview' ? 'active text-primary border-bottom border-2 border-primary' : 'text-muted-custom'}`}
              onClick={() => setActiveTab('overview')}
            >
              <Icon icon="lucide:bar-chart-2" width="18" className="me-2" /> Tổng quan & Biểu đồ
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link border-0 bg-transparent px-0 pb-3 fw-medium ${activeTab === 'articles' ? 'active text-primary border-bottom border-2 border-primary' : 'text-muted-custom'}`}
              onClick={() => setActiveTab('articles')}
            >
              <Icon icon="lucide:file-text" width="18" className="me-2" /> Luồng Bài Báo ({articleCount})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link border-0 bg-transparent px-0 pb-3 fw-medium ${activeTab === 'keywords' ? 'active text-primary border-bottom border-2 border-primary' : 'text-muted-custom'}`}
              onClick={() => setActiveTab('keywords')}
            >
              <Icon icon="lucide:key" width="18" className="me-2" /> Keywords & Giám sát ({keywordCount})
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="mb-5">
          {activeTab === 'overview' && (
            <div className="glass-card rounded-4 shadow-sm border p-4 text-center py-5 text-muted-custom">
              <Icon icon="lucide:pie-chart" width="48" className="mb-3 opacity-50" />
              <h5 className="text-main fw-bold">Biểu đồ tổng quan</h5>
              <p className="mb-0 small">Tính năng phân tích dữ liệu và biểu đồ đang được cập nhật.</p>
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="glass-card rounded-4 shadow-sm border p-4">
              <div className="mb-4">
                <h5 className="fw-bold text-main mb-1">Luồng bài viết cập nhật</h5>
                <p className="text-muted-custom small mb-0">Danh sách các bài báo khoa học xuất bản gần đây tương thích với watch-list của dự án.</p>
              </div>

              {watchArticles.length === 0 ? (
                <div className="text-center py-5 text-muted-custom">
                  <Icon icon="lucide:file-x" width="48" className="mb-3 opacity-50" />
                  <p className="mb-0">Chưa có bài báo nào khớp với từ khóa của bạn.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush border-top pt-2">
                  {watchArticles.map((article, index) => (
                    <div key={index} className="list-group-item bg-transparent px-0 py-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="text-muted-custom small">{article.journal_name || article.journal?.title || 'Tạp chí khoa học'}</span>
                        <span className="text-muted-custom small">{article.publication_year || new Date(article.publication_date).getFullYear()}</span>
                      </div>
                      <Link to={`/articles/${article.article_id || article.id}/visual`} className="text-decoration-none">
                        <h6 className="fw-bold text-main mb-2 hover-primary lh-base">{article.title}</h6>
                      </Link>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="text-muted-custom small text-truncate pe-3">
                          {article.doi && (
                            <>
                              DOI: <a href={article.doi.startsWith('http') ? article.doi : `https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="text-muted-custom text-decoration-none hover-primary">{article.doi}</a>
                            </>
                          )}
                        </div>
                        <div className="d-flex gap-2 flex-wrap justify-content-end">
                          {article.matched_areas?.map((area, aIdx) => (
                            <span key={`area-${aIdx}`} className="badge border fw-normal text-nowrap" style={{ fontSize: '0.7rem', backgroundColor: '#e2e3e5', color: '#383d41', borderColor: '#d6d8db !important' }}>
                              <Icon icon="lucide:book-open" className="me-1" width="12" />
                              {area}
                            </span>
                          ))}
                          {article.matched_keywords?.map((kw, kwIdx) => (
                            <span key={`kw-${kwIdx}`} className="badge border fw-normal text-nowrap" style={{ fontSize: '0.7rem', backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeeba !important' }}>
                              <span className="text-warning me-1">★</span>
                              {kw}
                            </span>
                          ))}
                          {(!article.matched_keywords?.length && !article.matched_areas?.length) && (
                            <span className="badge bg-light text-muted border fw-normal text-nowrap" style={{ fontSize: '0.7rem' }}>Độ trùng khớp cao</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {renderPagination('articles')}
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="glass-card rounded-4 shadow-sm border p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="fw-bold text-main mb-1">Quản lý Watch-List từ khóa</h5>
                  <p className="text-muted-custom small mb-0">Hệ thống sẽ liên tục quét bài báo mới và gửi thông báo theo các từ khóa này.</p>
                </div>
                <PrimaryButton
                  variant="outline"
                  className="px-3 py-2"
                  onClick={() => navigate(`/projects/${projectId}/edit`)}
                >
                  <Icon icon="lucide:edit-2" width="16" /> Chỉnh sửa danh sách
                </PrimaryButton>
              </div>

              <KeywordWatchList
                watchedKeywords={watchedKeywords}
                articles={keywordArticles}
                loading={loading}
                onManageClick={() => setShowManageModal(true)}
              />
              
              {renderPagination('keywords')}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddKeywordModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={addKeywordWatch}
        actionLoading={actionLoading}
      />

      <ManageKeywordsModal
        show={showManageModal}
        onHide={() => setShowManageModal(false)}
        watchedKeywords={watchedKeywords}
        onRemove={removeKeywordWatch}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default ProjectDetailPage;
