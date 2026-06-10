/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\pages\ArticleDetailPage.jsx
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Modal } from 'react-bootstrap';
import { Icon } from '@iconify/react';

// Layout
import Header from '../../landing/components/Header';

// Auth
import useAuth from '../../auth/hooks/useAuth';

// API
import { getArticleDetailApi, bookmarkArticleApi, getArticlesListApi } from '../api/articleApi';

// Subcomponents
import ArticleDetailSkeleton from '../components/ArticleDetailSkeleton';
import ArticleDetailEmpty from '../components/ArticleDetailEmpty';
import ArticleDetailError from '../components/ArticleDetailError';
import ArticlesTabContent from '../../journal/components/ArticlesTabContent';
import AuthRequiredModal from '../../../shared/components/AuthRequiredModal';
import { toast } from '../../../shared/utils/toast';
import { getDoiUrl, normalizeArticleDetail } from '../utils/articleFormatters';

const formatAuthorsLine = (authors = [], limit = 5) => {
  if (!authors || authors.length === 0) return 'Đang cập nhật tác giả';

  return authors
    .slice(0, limit)
    .map((author) => author.display_name || author.name || author.author_name || 'Tác giả')
    .join(', ');
};

const normalizeRecommendedArticle = (item = {}) => ({
  ...item,
  article_id: item.article_id || item.id,
  title: item.title || 'Untitled Article',
  publication_year: item.publication_year || item.year || '—',
  doi: item.doi || '',
  abstract: item.abstract || item.description || 'No abstract is available for this article.',
  authors: Array.isArray(item.authors)
    ? formatAuthorsLine(item.authors, 4)
    : item.authors || item.authors_text || '',
});

const topicKeywordChipStyle = {
  border: '1px solid var(--border)',
  color: 'var(--text-main)',
  backgroundColor: 'var(--bg-main)',
  borderRadius: '999px',
};

const formatReferenceLabel = (referenceUrl = '', index = 0) => {
  const rawValue = String(referenceUrl || '').trim();
  if (!rawValue) return `Reference ${index + 1}`;

  const workId = rawValue.split('/').filter(Boolean).pop();
  return workId ? `OpenAlex ${workId}` : `Reference ${index + 1}`;
};

const smoothScrollTo = (targetId) => {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const currentUser = auth?.user;

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [isRecommendedLoading, setIsRecommendedLoading] = useState(false);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showCitationsModal, setShowCitationsModal] = useState(false);
  const [referencePage, setReferencePage] = useState(1);
  const referencesPerPage = 2;

  const visibleAuthors = useMemo(() => {
    const authors = article?.authors || [];
    if (showAllAuthors) return authors;
    return authors.slice(0, 6);
  }, [article?.authors, showAllAuthors]);

  const hiddenAuthorCount = Math.max((article?.authors?.length || 0) - 6, 0);
  const references = article?.references || [];
  const referenceTotalPages = Math.max(1, Math.ceil(references.length / referencesPerPage));
  const paginatedReferences = references.slice(
    (referencePage - 1) * referencesPerPage,
    referencePage * referencesPerPage,
  );
  const keywordsText = useMemo(() => {
    const keywords = article?.keywords || [];
    if (!keywords.length) return 'Đang cập nhật từ khóa.';
    return keywords
      .map((keyword) => keyword.display_name || keyword.name || keyword.keyword)
      .filter(Boolean)
      .join('; ');
  }, [article?.keywords]);


  const fetchRecommendedArticles = useCallback(async (parsedArticle) => {
    try {
      setIsRecommendedLoading(true);
      const params = {
        limit: 4,
        page: 1,
      };
      const journalId = Number(parsedArticle.journal_id);
      const topicId = Number(parsedArticle.primary_topic || parsedArticle.topic_id);
      if (Number.isFinite(journalId)) params.journal_id = journalId;
      if (Number.isFinite(topicId)) params.topic_id = topicId;

      const response = await getArticlesListApi(params);
      const payload = response.data?.data || response.data || {};
      const rawItems = payload.items || payload.articles || payload.data || [];
      const normalizedItems = rawItems
        .map(normalizeRecommendedArticle)
        .filter((item) => String(item.article_id) !== String(parsedArticle.article_id))
        .slice(0, 3);

      setRecommendedArticles(normalizedItems);
    } catch (err) {
      console.warn('Error fetching recommended articles:', err);
      setRecommendedArticles([]);
    } finally {
      setIsRecommendedLoading(false);
    }
  }, []);

  const fetchArticleDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getArticleDetailApi(id);
      if (response.data && response.data.success !== false) {
        const apiData = response.data.data || {};
        const parsedArticle = normalizeArticleDetail(apiData, id);

        setArticle(parsedArticle);
        fetchRecommendedArticles(parsedArticle);

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
  }, [id, currentUser, fetchRecommendedArticles]);

  useEffect(() => {
    fetchArticleDetail();
  }, [fetchArticleDetail]);

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
      toast.success(nextState ? 'Đã thêm bài báo vào project.' : 'Đã xóa bài báo khỏi project.');
    } catch (err) {
      console.warn('Bookmark API error, toggling state locally:', err);
      setIsBookmarked(nextState);
      localStorage.setItem(localBookmarkKey, String(nextState));
      toast.warning('Không thể đồng bộ server, đã cập nhật tạm trên trình duyệt.');
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleDoiClick = () => {
    if (!articleDoiUrl) return;
    window.open(articleDoiUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareArticle = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: article?.title || 'Article detail',
      text: `Khám phá bài báo: ${article?.title || ''}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Đã mở chia sẻ bài báo.');
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success('Đã sao chép liên kết bài báo.');
    } catch (err) {
      if (err?.name === 'AbortError') return;
      console.warn('Unable to share article:', err);
      toast.error('Không thể chia sẻ bài báo lúc này.');
    }
  };



  const handleKeywordClick = (keyword) => {
    const keywordId = keyword.keyword_id || keyword.id;
    if (keywordId) {
      navigate(`/keywords/${keywordId}/articles`);
      return;
    }

    const label = keyword.display_name || keyword.name || keyword.keyword;
    if (label) {
      navigate(`/articles?search=${encodeURIComponent(label)}`);
    }
  };

  const handleTopicClick = (topic) => {
    const topicId = topic?.topic_id || topic?.id;
    if (topicId) {
      navigate(`/topics/${topicId}`);
      return;
    }

    const label = topic?.display_name || topic?.name || '';
    if (!label) return;
    navigate(`/articles?search=${encodeURIComponent(label)}`);
  };

  const handleOrganizationAccess = () => {
    if (article?.is_open_access && article?.doi) {
      window.open(getDoiUrl(article.doi), '_blank', 'noopener,noreferrer');
      return;
    }

    toast.info('Hiện chưa có cổng truy cập tổ chức riêng cho bài báo này.');
  };

  const articleDoiUrl = getDoiUrl(article?.doi);

  return (
    <div
      className="min-vh-100 text-main grid-bg"
      style={{
        backgroundColor: 'var(--bg-main)',
        paddingTop: '82px',
        paddingBottom: '60px',
      }}
    >
      <Header />
      <div className="radial-fade position-fixed w-100 h-100 top-0 start-0 z-0" style={{ pointerEvents: 'none' }} />

      <Container fluid className="position-relative z-1 px-3 px-xl-5">
        {isLoading ? (
          <ArticleDetailSkeleton />
        ) : error ? (
          <ArticleDetailError errorMsg={error} onRetry={fetchArticleDetail} />
        ) : !article ? (
          <ArticleDetailEmpty articleId={id} />
        ) : (
          <main
            className="mx-auto"
            style={{
              maxWidth: '1320px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: '0 18px 55px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div
              className="d-grid article-detail-shell"
              style={{
                gridTemplateColumns: '280px minmax(0, 1fr)',
                minHeight: 'calc(100vh - 150px)',
              }}
            >
              <aside
                className="d-none d-xl-block p-4"
                style={{ borderRight: '1px solid var(--border)' }}
              >
                <h2
                  className="font-display fw-bold mb-4"
                  role={article.journal_id ? 'button' : undefined}
                  onClick={() => article.journal_id && navigate(`/journals/${article.journal_id}`)}
                  style={{
                    fontSize: '1.15rem',
                    lineHeight: 1.35,
                    cursor: article.journal_id ? 'pointer' : 'default',
                    color: article.journal_id ? 'var(--text-main)' : 'var(--text-main)',
                  }}
                >
                  {article.journal_name || 'Scientific Journal'}
                </h2>

                <div className="d-flex flex-column gap-1 mb-4" style={{ fontSize: '0.9rem' }}>
                  <span><strong>Date:</strong> {article.publication_year || 'Đang cập nhật'}</span>
                  <span><strong>Article:</strong> {article.article_id}</span>
                  <span>
                    <strong>Volume:</strong>{' '}
                    <Button
                      variant="link"
                      disabled={!article.volume_id}
                      onClick={() => article.volume_id && navigate(`/articles?volume_id=${article.volume_id}`)}
                      className="p-0 align-baseline text-decoration-none fw-bold"
                      style={{ color: 'var(--primary)', fontSize: '0.9rem' }}
                    >
                      {article.volume_number || '—'}
                    </Button>
                  </span>
                  <span>
                    <strong>Issue:</strong>{' '}
                    <Button
                      variant="link"
                      disabled={!article.issue_id}
                      onClick={() => article.issue_id && navigate(`/articles?issue_id=${article.issue_id}`)}
                      className="p-0 align-baseline text-decoration-none fw-bold"
                      style={{ color: 'var(--primary)', fontSize: '0.9rem' }}
                    >
                      {article.issue_number || '—'}
                    </Button>
                  </span>
                  <span><strong>Access:</strong> {article.is_open_access ? 'Open access' : 'Restricted'}</span>
                </div>

                <div style={{ height: 1, backgroundColor: 'var(--border)' }} className="mb-4" />

                <div className="text-muted-custom text-xs fw-bold text-uppercase mb-2">Published by</div>
                <div className="text-xs text-muted-custom fw-semibold text-uppercase d-flex flex-column gap-1">
                  <span>{article.publisher_name || 'Đang cập nhật'}</span>
                  <span>Coverage: {article.publication_year || '—'}</span>
                </div>
              </aside>

              <section className="p-3 p-md-5">
                <div className="d-flex align-items-center gap-2 text-muted-custom mb-3 flex-wrap" style={{ fontSize: '0.78rem' }}>
                  <span role="button" onClick={() => navigate('/articles')} className="text-decoration-none text-muted-custom hover-text-main" style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Bài Báo</span>
                  <Icon icon="lucide:chevron-right" width="12" />
                  <span style={{ color: 'var(--text-main)' }}>Chi tiết bài báo</span>
                </div>


                <h1
                  className="font-display fw-bold mb-4"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3.45rem)',
                    lineHeight: 1.08,
                    letterSpacing: '-0.045em',
                    maxWidth: '980px',
                  }}
                >
                  {article.title}
                </h1>

                <div className="d-flex align-items-center gap-2 flex-wrap mb-3" style={{ fontSize: '0.92rem' }}>
                  {visibleAuthors.length > 0 ? (
                    visibleAuthors.map((author, index) => {
                      const authorLabel = author.display_name || author.name || author.author_name || 'Tác giả';
                      const authorId = author.author_id || author.id;
                      return (
                        <Button
                          key={authorId || `${authorLabel}-${index}`}
                          variant="link"
                          disabled={!authorId}
                          onClick={() => authorId && navigate(`/authors/${authorId}`)}
                          className="p-0 text-decoration-none fw-medium"
                          style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}
                          title={authorId ? `Xem chi tiết ${authorLabel}` : authorLabel}
                        >
                          {authorLabel}{index < visibleAuthors.length - 1 ? ',' : ''}
                        </Button>
                      );
                    })
                  ) : (
                    <span>Đang cập nhật tác giả</span>
                  )}
                  {hiddenAuthorCount > 0 && !showAllAuthors && (
                    <Button
                      variant="link"
                      onClick={() => setShowAllAuthors(true)}
                      className="p-0 text-decoration-none fw-semibold"
                      style={{ color: 'var(--primary)', fontSize: '0.9rem' }}
                    >
                      Show more +{hiddenAuthorCount}
                    </Button>
                  )}
                  {showAllAuthors && (article?.authors?.length || 0) > 6 && (
                    <Button
                      variant="link"
                      onClick={() => setShowAllAuthors(false)}
                      className="p-0 text-decoration-none fw-semibold"
                      style={{ color: 'var(--primary)', fontSize: '0.9rem' }}
                    >
                      Show less
                    </Button>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <div className="d-flex align-items-center gap-4 flex-wrap py-3 text-muted-custom" style={{ fontSize: '0.88rem' }}>
                    <Button
                      variant="link"
                      onClick={() => setShowCitationsModal(true)}
                      className="p-0 text-decoration-none d-inline-flex align-items-center gap-1"
                      style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}
                    >
                      <Icon icon="lucide:quote" width="15" />
                      Citations: {article.citations ?? 0}
                    </Button>
                    <Button
                      variant="link"
                      disabled={isBookmarkLoading}
                      onClick={handleBookmarkToggle}
                      className="p-0 text-decoration-none d-inline-flex align-items-center gap-1"
                      style={{ color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.88rem' }}
                    >
                      <Icon icon={isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark-plus'} width="15" />
                      Add to Project
                    </Button>
                    <Button
                      variant="link"
                      onClick={handleShareArticle}
                      className="p-0 text-decoration-none d-inline-flex align-items-center gap-1"
                      style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}
                    >
                      <Icon icon="lucide:share-2" width="15" />
                      Share
                    </Button>
                    
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap py-4">
                  {articleDoiUrl && (
                    <a
                      href={articleDoiUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {articleDoiUrl}
                      <Icon icon="lucide:external-link" width="14" />
                    </a>
                  )}
                  <span className="d-inline-flex align-items-center gap-2 text-muted-custom fst-italic">
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: article.is_open_access ? '#22c55e' : 'var(--text-muted)',
                      }}
                    />
                    {article.is_open_access ? 'Open access' : 'Restricted access'}
                  </span>
                </div>

                <div className="d-flex align-items-end gap-4 mb-4 flex-wrap" style={{ borderBottom: '1px solid var(--border)' }}>
                  <Button
                    variant="link"
                    onClick={() => setActiveTab('preview')}
                    className="px-0 pb-3 text-decoration-none fw-bold"
                    style={{
                      color: activeTab === 'preview' ? 'var(--text-main)' : 'var(--text-muted)',
                      borderBottom: activeTab === 'preview' ? '2px solid var(--primary)' : '2px solid transparent',
                      borderRadius: 0,
                    }}
                  >
                    Article preview
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setActiveTab('recommended')}
                    className="px-0 pb-3 text-decoration-none fw-bold"
                    style={{
                      color: activeTab === 'recommended' ? 'var(--text-main)' : 'var(--text-muted)',
                      borderBottom: activeTab === 'recommended' ? '2px solid var(--primary)' : '2px solid transparent',
                      borderRadius: 0,
                    }}
                  >
                    Recommended articles
                  </Button>
                </div>

                {activeTab === 'preview' ? (
                  <div
                    className="d-grid gap-4 article-preview-grid"
                    style={{ gridTemplateColumns: 'minmax(0, 740px) 220px', alignItems: 'start' }}
                  >
                    <article>
                      <section id="abstract" className="mb-5">
                        <h2 className="font-display fw-bold mb-3" style={{ fontSize: '1.65rem' }}>Abstract</h2>
                        {(article.abstract || 'No abstract is available for this article.')
                          .split('\n')
                          .filter(Boolean)
                          .map((paragraph, index) => (
                            <p
                              key={index}
                              className="text-muted-custom mb-3"
                              style={{ fontSize: '1rem', lineHeight: 1.75 }}
                            >
                              {paragraph}
                            </p>
                          ))}
                      </section>


                      <section id="section-snippets" className="mb-5">
                        <h2 className="font-display fw-bold mb-3" style={{ fontSize: '1.5rem' }}>Section snippets</h2>
                        <p className="text-muted-custom" style={{ fontSize: '0.98rem', lineHeight: 1.75 }}>
                          Tóm tắt nhanh: bài báo thuộc chủ đề <strong>{article.topic_name || 'Research'}</strong>,
                          công bố trong <strong>{article.journal_name || 'Scientific Journal'}</strong>
                          {article.publication_year ? ` năm ${article.publication_year}` : ''}.
                        </p>
                      </section>

                      <section id="keywords" className="mb-5">
                        <h2 className="font-display fw-bold mb-3" style={{ fontSize: '1.5rem' }}>Keywords</h2>
                        <div className="d-flex gap-2 flex-wrap">
                          {(article.keywords || []).length > 0 ? (
                            article.keywords.map((keyword) => {
                              const label = keyword.display_name || keyword.name || keyword.keyword;
                              return (
                                <Button
                                  key={keyword.keyword_id || label}
                                  variant="light"
                                  onClick={() => handleKeywordClick(keyword)}
                                  className="px-3 py-2 fw-medium"
                                  style={topicKeywordChipStyle}
                                >
                                  {label}
                                </Button>
                              );
                            })
                          ) : (
                            <p className="text-muted-custom mb-0" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                              {keywordsText}
                            </p>
                          )}
                        </div>
                      </section>

                      <section id="references">
                        <h2 className="font-display fw-bold mb-3" style={{ fontSize: '1.5rem' }}>References</h2>
                        <p className="text-muted-custom mb-4" style={{ fontSize: '0.98rem', lineHeight: 1.75 }}>
                          Bài báo hiện có <strong>{article.reference_count ?? article.references?.length ?? 0}</strong> tài liệu tham khảo được đồng bộ trong hệ thống.
                          Số lượt trích dẫn của bài báo này là <strong>{article.citations ?? 0}</strong>.
                        </p>

                        {(article.references || []).length > 0 ? (
                          <div className="d-grid gap-3">
                            {paginatedReferences.map((referenceUrl, index) => {
                              const absoluteIndex = (referencePage - 1) * referencesPerPage + index;
                              return (
                              <a
                                key={`${referenceUrl}-${absoluteIndex}`}
                                href={referenceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-decoration-none"
                                style={{ color: 'inherit' }}
                              >
                                <div
                                  className="p-3 p-lg-4"
                                  style={{
                                    borderRadius: 18,
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg-card)',
                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                  }}
                                >
                                  <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                                    <div className="min-w-0">
                                      <div className="text-muted-custom text-xs fw-bold text-uppercase mb-2">
                                        Reference {absoluteIndex + 1}
                                      </div>
                                      <div className="fw-semibold text-main mb-2" style={{ wordBreak: 'break-word' }}>
                                        {formatReferenceLabel(referenceUrl, absoluteIndex)}
                                      </div>
                                      <div className="text-muted-custom" style={{ fontSize: '0.92rem', wordBreak: 'break-all' }}>
                                        {referenceUrl}
                                      </div>
                                    </div>
                                    <span className="d-inline-flex align-items-center gap-2 text-muted-custom" style={{ fontSize: '0.88rem' }}>
                                      <Icon icon="lucide:external-link" width="16" />
                                      Mở nguồn
                                    </span>
                                  </div>
                                </div>
                              </a>
                              );
                            })}

                            {references.length > referencesPerPage && (
                              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap pt-2">
                                <div className="text-muted-custom" style={{ fontSize: '0.9rem' }}>
                                  Hiển thị {(referencePage - 1) * referencesPerPage + 1}–{Math.min(referencePage * referencesPerPage, references.length)} / {references.length} references
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <Button
                                    variant="light"
                                    disabled={referencePage <= 1}
                                    onClick={() => setReferencePage((page) => Math.max(1, page - 1))}
                                    className="px-3 py-2 fw-medium"
                                    style={topicKeywordChipStyle}
                                  >
                                    Trước
                                  </Button>
                                  <span className="text-muted-custom" style={{ fontSize: '0.9rem' }}>
                                    Trang {referencePage}/{referenceTotalPages}
                                  </span>
                                  <Button
                                    variant="light"
                                    disabled={referencePage >= referenceTotalPages}
                                    onClick={() => setReferencePage((page) => Math.min(referenceTotalPages, page + 1))}
                                    className="px-3 py-2 fw-medium"
                                    style={topicKeywordChipStyle}
                                  >
                                    Sau
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="p-3 p-lg-4 text-muted-custom"
                            style={{
                              borderRadius: 18,
                              border: '1px dashed var(--border)',
                              backgroundColor: 'var(--bg-card)',
                            }}
                          >
                            Chưa có danh sách reference chi tiết cho bài báo này.
                          </div>
                        )}
                      </section>

                      {article.topics?.length > 0 && (
                        <section className="mt-4">
                          <h2 className="font-display fw-bold mb-3" style={{ fontSize: '1.4rem' }}>Topics</h2>
                          <div className="d-flex gap-2 flex-wrap">
                            {article.topics.map((topic) => (
                              <Button
                                key={topic.topic_id || topic.display_name}
                                variant="light"
                                onClick={() => handleTopicClick(topic)}
                                className="px-3 py-2 fw-medium"
                                style={topicKeywordChipStyle}
                              >
                                {topic.display_name}
                              </Button>
                            ))}
                          </div>
                        </section>
                      )}
                    </article>

                    <aside
                      className="d-none d-lg-block p-3"
                      style={{ backgroundColor: 'var(--bg-main)', borderLeft: '3px solid var(--border)' }}
                    >
                      <div className="text-muted-custom text-xs fw-bold text-uppercase mb-3">Article preview</div>
                      <nav className="d-flex flex-column gap-2" style={{ fontSize: '0.88rem' }}>
                        <Button variant="link" onClick={() => smoothScrollTo('abstract')} className="p-0 text-start text-decoration-none fw-bold" style={{ color: 'var(--text-main)' }}>Abstract</Button>
                        <Button variant="link" onClick={() => smoothScrollTo('section-snippets')} className="p-0 text-start text-decoration-none" style={{ color: 'var(--text-muted)' }}>Section snippets</Button>
                        <Button variant="link" onClick={() => smoothScrollTo('references')} className="p-0 text-start text-decoration-none" style={{ color: 'var(--text-muted)' }}>References ({article.reference_count ?? article.references?.length ?? 0})</Button>
                      </nav>
                    </aside>
                  </div>
                ) : (
                  <ArticlesTabContent
                    recentArticles={recommendedArticles}
                    loading={isRecommendedLoading}
                    onArticleClick={(articleId) => navigate(`/articles/${articleId}`)}
                  />
                )}
              </section>
            </div>
          </main>
        )}
      </Container>

      <Modal show={showCitationsModal} onHide={() => setShowCitationsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="font-display fw-bold">Citations / Cited by</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="p-3 mb-3"
            style={{
              borderRadius: 12,
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              color: 'var(--text-main)',
            }}
          >
            <div className="text-muted-custom text-xs fw-bold text-uppercase mb-1">Tổng lượt trích dẫn</div>
            <div className="font-display fw-bold" style={{ fontSize: '2rem', color: 'var(--text-main)' }}>
              {(article?.citations ?? 0).toLocaleString('en-US')}
            </div>
          </div>

          <p className="text-muted-custom mb-3" style={{ lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-main)' }}>Citations</strong> là số lượng bài báo hoặc công trình khác đã nhắc tới / trích dẫn lại bài báo này.
          </p>

          <div className="d-grid gap-2" style={{ fontSize: '0.94rem' }}>
            <div><strong>DOI:</strong> mã định danh cố định của bài báo.</div>
            <div><strong>References:</strong> danh sách tài liệu mà bài báo này trích dẫn.</div>
            <div><strong>Citations / Cited by:</strong> số công trình khác trích dẫn lại bài báo này.</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowCitationsModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <AuthRequiredModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />
    </div>
  );
}
