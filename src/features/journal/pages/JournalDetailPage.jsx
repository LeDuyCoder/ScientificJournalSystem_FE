import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Breadcrumb, Row, Col, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

// Shared Layout Header
import Header from '../../landing/components/Header';

// Auth Hook
import useAuth from '../../auth/hooks/useAuth';

// Feature Components & Hooks
import { useJournalDetail } from '../hooks/useJournalDetail';
import JournalHero from '../components/JournalHero';
import JournalMetadataGrid from '../components/JournalMetadataGrid';
import JournalTabs from '../components/JournalTabs';
import RankingTabContent from '../components/RankingTabContent';
import VolumesTabContent from '../components/VolumesTabContent';
import ArticlesTabContent from '../components/ArticlesTabContent';
import AuthRequiredModal from '../components/AuthRequiredModal';

export default function JournalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth ? useAuth() : { user: null };
  const currentUser = auth?.user;

  const token = localStorage.getItem('researchpulse_token');

  if (!token) {
    return (
      <div className="grid-bg min-vh-100 d-flex flex-column text-white">
        <Header />
        <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5" style={{ marginTop: '80px' }}>
          <div className="journal-dark-card p-5 text-center" style={{ maxWidth: '560px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="d-inline-flex align-items-center justify-content-center mb-4" style={{
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.2) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <Icon icon="lucide:lock" className="text-danger" width="40" />
            </div>
            <h3 className="font-display fw-bold text-white mb-3">Nội dung dành cho Thành viên</h3>
            <p className="text-white-70 mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              Vui lòng đăng nhập tài khoản ResearchPulse của bạn để xem chi tiết thông tin tạp chí, chỉ số xếp hạng, lịch sử ranking, volumes/issues và các bài báo gần đây.
            </p>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <Button 
                variant="dark"
                className="px-4 py-2.5 text-white-70 border-white-10 fw-semibold"
                onClick={() => navigate('/')}
                style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#161c2e', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Quay lại Trang chủ
              </Button>
              <Button 
                className="btn-primary-glow border-0 px-4 py-2.5 fw-semibold"
                onClick={() => navigate('/login')}
                style={{ borderRadius: '8px', fontSize: '0.9rem' }}
              >
                Đăng nhập ngay
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const {
    journal,
    rankingHistory,
    volumes,
    issuesByVolume,
    recentArticles,
    activeTab,
    setActiveTab,
    loadingJournal,
    loadingRanking,
    loadingVolumes,
    loadingArticles,
    notFound,
    showAuthModal,
    setShowAuthModal,
    isFollowing,
    isAddingToProject,
    handleFollow,
    handleAddToProject,
    fetchIssuesForVolume
  } = useJournalDetail(id, currentUser);

  // Fallback for not found or empty ID
  if (notFound) {
    return (
      <div className="grid-bg min-vh-100 d-flex flex-column text-white">
        <Header />
        <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5">
          <div className="journal-dark-card p-5 text-center max-w-md" style={{ maxWidth: '500px' }}>
            <Icon icon="lucide:alert-circle" className="text-danger mb-4" width="64" />
            <h2 className="font-display fw-bold text-white mb-3">Không tìm thấy Tạp chí</h2>
            <p className="text-secondary mb-4">
              Tạp chí bạn đang tìm kiếm không tồn tại hoặc dữ liệu chưa được cập nhật trong hệ thống.
            </p>
            <Button 
              className="btn-primary-glow border-0 px-4 py-2" 
              onClick={() => navigate('/')}
              style={{ borderRadius: '8px', fontWeight: 600 }}
            >
              Quay lại Trang chủ
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="grid-bg min-vh-100 text-white pb-5">
      {/* Top Navbar */}
      <Header />

      {/* Main Container */}
      <Container className="pt-5 mt-5">
        
        {/* Custom Breadcrumb Nav */}
        <div className="py-3 text-start">
          <Breadcrumb className="mb-0 custom-breadcrumb">
            <Breadcrumb.Item 
              onClick={() => navigate('/')}
              className="text-white-50 hover-text-white text-decoration-none"
              style={{ cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item 
              onClick={() => navigate('/')}
              className="text-white-50 hover-text-white text-decoration-none"
              style={{ cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Danh mục
            </Breadcrumb.Item>
            <Breadcrumb.Item 
              active 
              className="text-info font-display fw-semibold"
              style={{ fontSize: '0.9rem' }}
            >
              {loadingJournal ? 'Đang tải...' : journal?.display_name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <JournalHero 
          journal={journal}
          isFollowing={isFollowing}
          isAddingToProject={isAddingToProject}
          onFollow={handleFollow}
          onAddToProject={() => handleAddToProject()}
          loading={loadingJournal}
        />

        {/* Grid Metadata metrics */}
        <JournalMetadataGrid 
          journal={journal} 
          loading={loadingJournal} 
        />

        {/* Tab Controls */}
        <JournalTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Tab Contents */}
        <div className="tab-pane-container">
          {activeTab === 'ranking' && (
            <RankingTabContent 
              rankingHistory={rankingHistory} 
              metricName={journal?.metric_name || 'Impact Factor'}
              loading={loadingRanking}
            />
          )}

          {activeTab === 'volumes' && (
            <VolumesTabContent 
              volumes={volumes} 
              issuesByVolume={issuesByVolume}
              onVolumeExpand={fetchIssuesForVolume}
              loading={loadingVolumes}
            />
          )}

          {activeTab === 'articles' && (
            <ArticlesTabContent 
              recentArticles={recentArticles} 
              loading={loadingArticles}
              onArticleClick={(artId) => alert(`Xem chi tiết bài báo ${artId} (Mô phỏng)`)}
            />
          )}
        </div>
      </Container>

      {/* Guest warning auth modal */}
      <AuthRequiredModal 
        show={showAuthModal} 
        onHide={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
