/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\pages\ArticleDetailPage.jsx
 */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

// Layout
import Header from '../../landing/components/Header';

// Auth
import useAuth from '../../auth/hooks/useAuth';

// API
import { getArticleDetailApi, bookmarkArticleApi } from '../api/articleApi';

// Subcomponents
import ArticleHeaderCard from '../components/ArticleHeaderCard';
import AbstractCard from '../components/AbstractCard';
import KeywordTopicCard from '../components/KeywordTopicCard';
import AuthorsCard from '../components/AuthorsCard';
import ArticleActionCard from '../components/ArticleActionCard';
import ArticleStatisticsCard from '../components/ArticleStatisticsCard';
import LoginRequiredModal from '../components/LoginRequiredModal';
import ArticleDetailSkeleton from '../components/ArticleDetailSkeleton';
import ArticleDetailEmpty from '../components/ArticleDetailEmpty';
import ArticleDetailError from '../components/ArticleDetailError';
import { normalizeArticleDetail } from '../utils/articleFormatters';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const currentUser = auth?.user;

  // States
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch article detail
  const fetchArticleDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getArticleDetailApi(id);
      if (response.data && response.data.success !== false) {
        const apiData = response.data.data || {};
        // Normalize backend response and support both legacy and enriched detail fields.
        const parsedArticle = normalizeArticleDetail(apiData, id);
        
        setArticle(parsedArticle);

        // Check if bookmarked in local storage fallback or api data
        const localBookmarkKey = `bookmark_${currentUser?.username || 'guest'}_${id}`;
        const isLocallyBookmarked = localStorage.getItem(localBookmarkKey) === 'true';
        setIsBookmarked(apiData.is_bookmarked || isLocallyBookmarked);
      } else {
        throw new Error('Không thể tải chi tiết bài báo khoa học.');
      }
    } catch (err) {
      console.error('Error fetching article detail:', err);
      setError(err.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu bài báo khoa học.');
    } finally {
      setIsLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchArticleDetail();
  }, [fetchArticleDetail]);

  // Bookmark toggle handler
  const handleBookmarkToggle = async () => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setIsBookmarkLoading(true);
    const localBookmarkKey = `bookmark_${currentUser.username}_${id}`;
    const nextState = !isBookmarked;

    try {
      await bookmarkArticleApi(id);
      setIsBookmarked(nextState);
      localStorage.setItem(localBookmarkKey, String(nextState));
    } catch (err) {
      console.warn('Bookmark API error, toggling state locally:', err);
      // Fallback
      setIsBookmarked(nextState);
      localStorage.setItem(localBookmarkKey, String(nextState));
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 text-main grid-bg"
      style={{
        backgroundColor: 'var(--bg-main)',
        paddingTop: '90px',
        paddingBottom: '60px'
      }}
    >
      <Header />
      <div className="radial-fade position-fixed w-100 h-100 top-0 start-0 z-0" style={{ pointerEvents: 'none' }} />

      <Container className="position-relative z-1">
        {/* Navigation / Breadcrumb Row */}
        <div className="mb-4">
          <Button 
            variant="link" 
            onClick={() => navigate('/articles')}
            className="text-primary hover:text-dark p-0 text-decoration-none d-flex align-items-center gap-2 mb-3 font-semibold"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            <Icon icon="lucide:arrow-left" width="18" />
            <span>Quay lại danh sách bài báo</span>
          </Button>
          
          <div className="d-flex align-items-center gap-2 text-muted-custom text-xs font-semibold uppercase">
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Tổng quan</span>
            <Icon icon="lucide:chevron-right" width="12" />
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/articles')}>Bài báo</span>
            <Icon icon="lucide:chevron-right" width="12" />
            <span className="text-main text-truncate" style={{ maxWidth: '280px' }}>
              {isLoading ? 'Đang tải...' : article?.title || 'Chi tiết'}
            </span>
          </div>
        </div>

        {/* Content body based on loading/error state */}
        {isLoading ? (
          <ArticleDetailSkeleton />
        ) : error ? (
          <ArticleDetailError errorMsg={error} onRetry={fetchArticleDetail} />
        ) : !article ? (
          <ArticleDetailEmpty articleId={id} />
        ) : (
          <Row className="g-4">
            {/* Left Column (Main details) */}
            <Col xs={12} lg={8}>
              {/* Header Card */}
              <ArticleHeaderCard article={article} />

              {/* Abstract Card */}
              <AbstractCard abstract={article.abstract} />

              {/* Keywords & Topics Card */}
              <KeywordTopicCard 
                primaryTopic={article.topic_name || article.primary_topic} 
                keywords={article.keywords}
                topics={article.topics}
              />

              {/* Authors Card */}
              <AuthorsCard authors={article.authors} />
            </Col>

            {/* Right Column (Sidebar details) */}
            <Col xs={12} lg={4}>
              {/* Action Card */}
              <ArticleActionCard 
                article={article}
                isBookmarked={isBookmarked}
                onBookmarkToggle={handleBookmarkToggle}
                isBookmarkLoading={isBookmarkLoading}
              />

              {/* Statistics Card */}
              <ArticleStatisticsCard article={article} />
            </Col>
          </Row>
        )}
      </Container>

      {/* Guest Login required Modal */}
      <LoginRequiredModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
