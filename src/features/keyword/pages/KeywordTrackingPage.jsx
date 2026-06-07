import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useKeywordTracking } from '../hooks/useKeywordTracking';
import TrendingKeywordList from '../components/TrendingKeywordList';
import KeywordWatchList from '../components/KeywordWatchList';
import AddKeywordModal from '../components/AddKeywordModal';
import ManageKeywordsModal from '../components/ManageKeywordsModal';

const KeywordTrackingPage = () => {
  const { id: projectId } = useParams();
  const {
    project,
    trendingKeywords,
    watchArticles,
    watchedKeywords,
    loading,
    error,
    actionLoading,
    addKeywordWatch,
    removeKeywordWatch
  } = useKeywordTracking(projectId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  const handleTrendingClick = (keyword) => {
    addKeywordWatch(keyword);
  };

  return (
    <div className="container-fluid py-4 grid-bg min-vh-100">
      {/* Breadcrumb */}
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-2 text-muted-custom small">
            <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted-custom hover-primary">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link to={`/projects/${projectId}`} className="text-decoration-none text-muted-custom hover-primary">{project?.title || 'Project'}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Keywords</li>
          </ol>
        </nav>
        
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="font-display fw-bold mb-1 text-main d-flex align-items-center gap-2">
              <span className="text-warning">🔑</span> Keyword Tracking
            </h1>
            <p className="text-muted-custom mb-0">Theo dõi xu hướng keyword trong project {project?.title}</p>
          </div>
          
          <button 
            className="btn btn-primary-glow px-4 py-2 rounded-pill fw-medium"
            onClick={() => setShowAddModal(true)}
          >
            + Thêm keyword
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4 border-0 rounded-3 shadow-sm">
          {error}
        </div>
      )}

      {/* Main Content Sections */}
      <div className="row g-4">
        <div className="col-12">
          <TrendingKeywordList 
            trendingKeywords={trendingKeywords} 
            loading={loading} 
            onKeywordClick={handleTrendingClick}
          />
        </div>
        
        <div className="col-12">
          <KeywordWatchList 
            watchedKeywords={watchedKeywords} 
            articles={watchArticles} 
            loading={loading} 
            onManageClick={() => setShowManageModal(true)}
          />
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

export default KeywordTrackingPage;
