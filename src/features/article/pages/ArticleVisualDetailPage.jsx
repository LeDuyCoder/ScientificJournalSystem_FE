import { useTranslation } from "react-i18next";
import { t } from "i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\pages\ArticleVisualDetailPage.jsx
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import ErrorState from '../../../shared/components/ErrorState';
import AuthRequiredModal from '../../../shared/components/AuthRequiredModal';
import { toast } from '../../../shared/utils/toast';
import { getDoiUrl, normalizeArticleDetail } from '../utils/articleFormatters';
import '../Article.css';
const formatAuthorsLine = (authors = [], limit = 3) => {
  if (!authors || authors.length === 0) return t("article.dangCapNhatTacGia");
  const names = authors.slice(0, limit).map(author => author.display_name || author.name || author.author_name || t("typeAuthor")).join(', ');
  return authors.length > limit ? `${names}...` : names;
};
const normalizeRecommendedArticle = (item = {}) => ({
  ...item,
  article_id: item.article_id || item.id,
  title: item.title || 'Untitled Article',
  publication_year: item.publication_year || item.year || '—',
  doi: item.doi || '',
  abstract: item.abstract || item.description || 'No abstract is available for this article.',
  authors: Array.isArray(item.authors) ? formatAuthorsLine(item.authors, 3) : item.authors || item.authors_text || ''
});
const formatReferenceLabel = (referenceUrl = '', index = 0) => {
  const rawValue = String(referenceUrl || '').trim();
  if (!rawValue) return `Reference ${index + 1}`;
  const workId = rawValue.split('/').filter(Boolean).pop();
  return workId ? `OpenAlex ${workId}` : `Reference ${index + 1}`;
};

// ======================================================================
// Right Sidebar Component for Article Details
// ======================================================================
const ArticleDetailPane = ({
  articleId,
  onTitleClick
}) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const currentUser = auth?.user;
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showCitationsModal, setShowCitationsModal] = useState(false);
  const [referencePage, setReferencePage] = useState(1);
  const referencesPerPage = 2;
  const fetchArticleForPane = useCallback(async () => {
    console.log(`[Pane] Attempting to fetch details for articleId: '${articleId}' (type: ${typeof articleId})`);
    if (!articleId) {
      console.warn('[Pane] No articleId provided, aborting fetch.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getArticleDetailApi(articleId);
      if (response.data && response.data.success !== false) {
        const apiData = response.data.data || {};
        if (Object.keys(apiData).length === 0) {
          console.warn(`[Pane] API returned success, but data is empty for ID: '${articleId}'. Rendering 'Empty' state.`);
          setArticle(null);
        } else {
          const parsedArticle = normalizeArticleDetail(apiData, articleId);
          setArticle(parsedArticle);
        }
        const localBookmarkKey = `bookmark_${currentUser?.username || 'guest'}_${articleId}`;
        const isLocallyBookmarked = localStorage.getItem(localBookmarkKey) === 'true';
        setIsBookmarked(apiData.is_bookmarked || isLocallyBookmarked);
      } else {
        throw new Error(response.data?.message || t("article.khongTheTaiChiTietBaiBao"));
      }
    } catch (err) {
      console.error(`[Pane] Error fetching article detail for ID '${articleId}':`, err);
      if (err.isAxiosError && err.response && err.response.status === 404) {
        setError({
          type: '404',
          message: t("article.khongTimThayBaiBaoNay")
        });
      } else {
        setError({
          type: 'generic',
          message: err.message || t("article.loiKhiTaiDuLieu")
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [articleId, currentUser]);
  useEffect(() => {
    fetchArticleForPane();
  }, [fetchArticleForPane]);
  const visibleAuthors = useMemo(() => {
    const authors = article?.authors || [];
    if (showAllAuthors) return authors;
    return authors.slice(0, 3);
  }, [article?.authors, showAllAuthors]);
  const hiddenAuthorCount = Math.max((article?.authors?.length || 0) - 3, 0);
  const references = article?.references || [];
  const referenceTotalPages = Math.max(1, Math.ceil(references.length / referencesPerPage));
  const paginatedReferences = references.slice((referencePage - 1) * referencesPerPage, referencePage * referencesPerPage);
  const articleDoiUrl = getDoiUrl(article?.doi);
  const handleBookmarkToggle = async () => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    if (!article?.article_id) return;
    setIsBookmarkLoading(true);
    const localBookmarkKey = `bookmark_${currentUser.username}_${article.article_id}`;
    const nextState = !isBookmarked;
    try {
      await bookmarkArticleApi(article.article_id);
      setIsBookmarked(nextState);
      localStorage.setItem(localBookmarkKey, String(nextState));
      toast.success(nextState ? t("article.daThemBaiBaoVaoProject") : t("article.daXoaBaiBaoKhoiProject"));
    } catch (err) {
      console.warn('Bookmark API error, toggling state locally:', err);
      setIsBookmarked(nextState);
      localStorage.setItem(localBookmarkKey, String(nextState));
      toast.warning(t("article.khongTheDongBoServerDaCapNhatT"));
    } finally {
      setIsBookmarkLoading(false);
    }
  };
  const handleShareArticle = async () => {
    const shareUrl = `${window.location.origin}/articles/${article.article_id}`;
    const shareData = {
      title: article?.title || 'Article detail',
      text: `Khám phá bài báo: ${article?.title || ''}`,
      url: shareUrl
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success(t("article.daMoChiaSeBaiBao"));
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t("article.daSaoChepLienKetBaiBao"));
    } catch (err) {
      if (err?.name === 'AbortError') return;
      console.warn('Unable to share article:', err);
      toast.error(t("article.khongTheChiaSeBaiBaoLucNay"));
    }
  };
  if (isLoading) {
    return <div className="p-4">
        <ArticleDetailSkeleton />
      </div>;
  }
  if (error) {
    if (error.type === '404') {
      return <div className="p-4 text-center">
          <Icon icon="lucide:file-x" width="48" className="text-muted-custom mb-3" />
          <h4 className="font-display fw-bold text-main">{t("article.baiBaoKhongTonTai")}</h4>
          <p className="text-muted-custom px-2">{t("article.coVeNhuChungToiKhongTheTimThay")}{articleId}{t("article.coTheKhongHopLeHoacDaBiXoa")}</p>
          <Button variant="outline-primary" onClick={fetchArticleForPane} className="mt-3">{t("article.thuLai")}</Button>
          <p className="text-muted-custom mt-3">
            <small>{t("article.neuBanVanGapLoiHayKiemTraIdCua")}</small>
          </p>
        </div>;
    }
    return <div className="p-4">
        <ArticleDetailError errorMsg={error.message} onRetry={fetchArticleForPane} />
      </div>;
  }
  if (!article) {
    return <div className="p-4">
        <ArticleDetailEmpty articleId={articleId} />
      </div>;
  }
  return <div className="detail-pane-content px-4 py-4">
      <div className={`article-detail-journal-title mb-2 ${article.journal_id ? 'is-clickable' : ''}`} onClick={() => article.journal_id && navigate(`/journals/${article.journal_id}`)}>
        {article.journal_name || 'Scientific Journal'}
      </div>

      <h1 className="article-detail-title is-clickable" onClick={() => onTitleClick(article.article_id)} title={t("article.xemChiTietBaiBao")}>
        {article.title}
      </h1>

      <div className="article-detail-authors mb-3">
        {visibleAuthors.length > 0 ? visibleAuthors.map((author, index) => {
        const authorLabel = author.display_name || author.name || author.author_name || t("typeAuthor");
        const authorId = author.author_id || author.id;
        return <span key={authorId || `${authorLabel}-${index}`} className={`article-detail-author-span ${authorId ? 'is-link' : ''}`} onClick={() => authorId && navigate(`/authors/${authorId}`)}>
                {authorLabel}{index < visibleAuthors.length - 1 ? ', ' : ''}
              </span>;
      }) : <span className="text-muted-custom">{t("article.dangCapNhatTacGia")}</span>}
        {hiddenAuthorCount > 0 && !showAllAuthors && <Button variant="link" onClick={() => setShowAllAuthors(true)} className="article-detail-author-toggle p-0 ms-1">
            +{hiddenAuthorCount} authors
          </Button>}
        {showAllAuthors && (article?.authors?.length || 0) > 3 && <Button variant="link" onClick={() => setShowAllAuthors(false)} className="article-detail-author-toggle p-0 ms-1">
            Show less
          </Button>}
      </div>

      <div className="article-detail-meta-list mb-3">
        <span className="meta-item">
          <Icon icon="lucide:calendar" width="14" />
          <strong>{t("article.namXuatBan")}</strong> {article.publication_year || '—'}
        </span>
        <span className="meta-item">
          <Icon icon="lucide:building" width="14" />
          <strong>Publisher:</strong> {article.publisher_name || '—'}
        </span>
        <span className="meta-item">
          <Icon icon="lucide:globe" width="14" />
          <strong>{t("article.viTriVenue")}</strong> {article.journal_name || '—'}
        </span>
        {article.volume_number && <span className="meta-item">
            <Icon icon="lucide:book" width="14" />
            <strong>Volume/Issue:</strong> Vol. {article.volume_number}{article.issue_number ? `, Issue ${article.issue_number}` : ''}
          </span>}
      </div>

      <div className="article-detail-actions-connected mb-4">
        <div className="citations-chip" onClick={() => setShowCitationsModal(true)}>
          <Icon icon="lucide:quote" width="13" />
          <span>{article.citations ?? 0} Citations</span>
        </div>
        <button disabled={isBookmarkLoading} onClick={handleBookmarkToggle} className={`action-btn-connected ${isBookmarked ? 'is-active' : ''}`}>
          <Icon icon={isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark-plus'} width="14" />
          <span>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
        <button onClick={handleShareArticle} className="action-btn-connected">
          <Icon icon="lucide:share-2" width="14" />
          <span>Share</span>
        </button>
      </div>

      <div className="article-detail-open-in mb-4">
        <span className="open-in-label text-muted-custom">Open in:</span>
        <div className="open-in-links-container">
          {articleDoiUrl && <a href={articleDoiUrl} target="_blank" rel="noreferrer" className="open-in-btn">
              <Icon icon="simple-icons:doi" width="14" />
              <span>DOI</span>
            </a>}
          <a href={article.source_url || `https://www.semanticscholar.org/search?q=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer" className="open-in-btn">
            <Icon icon="simple-icons:semanticscholar" width="12" />
            <span>Semantic Scholar</span>
          </a>
          <a href={`https://scholar.google.com/scholar?q=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer" className="open-in-btn">
            <Icon icon="simple-icons:googlescholar" width="12" />
            <span>Google</span>
          </a>
        </div>
      </div>

      <div className="detail-pane-divider mb-4" />

      <section className="article-section-connected">
        <h3 className="section-title-connected mb-2 font-display">Abstract</h3>
        {(article.abstract || 'No abstract is available for this article.').split('\n').filter(Boolean).map((paragraph, index) => <p key={index} className="abstract-text-connected font-display">{paragraph}</p>)}
      </section>

      {(article.keywords || []).length > 0 && <section className="article-section-connected mt-4">
          <h3 className="section-title-connected mb-2 font-display">Keywords</h3>
          <div className="d-flex gap-1.5 flex-wrap">
            {article.keywords.map(keyword => {
          const label = keyword.display_name || keyword.name || keyword.keyword;
          return <span key={keyword.keyword_id || label} onClick={() => navigate(`/keywords/${keyword.keyword_id || ''}`)} className="geography-topic-badge" style={{
            cursor: 'pointer'
          }}>
                  {label}
                </span>;
        })}
          </div>
        </section>}

      <section className="article-connected-references mt-4">
        <h3 className="section-title-connected mb-2 font-display">References ({references.length})</h3>
        {references.length > 0 ? <div className="d-flex flex-column gap-2">
            {paginatedReferences.map((referenceUrl, index) => {
          const absoluteIndex = (referencePage - 1) * referencesPerPage + index;
          return <a key={`${referenceUrl}-${absoluteIndex}`} href={referenceUrl} target="_blank" rel="noreferrer" className="reference-link-item p-2 rounded">
                  <div className="reference-item-index text-xs text-muted-custom">Reference {absoluteIndex + 1}</div>
                  <div className="reference-item-label text-sm text-truncate text-main font-display">{formatReferenceLabel(referenceUrl, absoluteIndex)}</div>
                </a>;
        })}
            {references.length > referencesPerPage && <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top">
                <span className="text-xs text-muted-custom">Trang {referencePage}/{referenceTotalPages}</span>
                <div className="d-flex gap-1">
                  <button disabled={referencePage <= 1} onClick={() => setReferencePage(page => Math.max(1, page - 1))} className="btn btn-xs btn-outline-secondary py-0 px-2 font-display" style={{
              fontSize: '0.7rem'
            }}>{t("article.truoc")}</button>
                  <button disabled={referencePage >= referenceTotalPages} onClick={() => setReferencePage(page => Math.min(referenceTotalPages, page + 1))} className="btn btn-xs btn-outline-secondary py-0 px-2 font-display" style={{
              fontSize: '0.7rem'
            }}>Sau</button>
                </div>
              </div>}
          </div> : <span className="text-xs text-muted-custom font-display">{t("article.khongCoTaiLieuThamKhaoChiTiet")}</span>}
      </section>
      
      <Modal show={showCitationsModal} onHide={() => setShowCitationsModal(false)} centered>
        <Modal.Header closeButton><Modal.Title className="font-display fw-bold">Citations / Cited by</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="article-modal-stat-box">
            <div className="text-muted-custom text-xs fw-bold text-uppercase mb-1">{t("article.tongLuotTrichDan")}</div>
            <div className="font-display fw-bold" style={{
            fontSize: '2rem',
            color: 'var(--text-main)'
          }}>{(article?.citations ?? 0).toLocaleString('en-US')}</div>
          </div>
          <p className="text-muted-custom mb-3" style={{
          lineHeight: 1.7
        }}><strong style={{
            color: 'var(--text-main)'
          }}>Citations</strong>{t("article.laSoLuongBaiBaoHoacCongTrinhKh")}</p>
          <div className="d-grid gap-2 font-display" style={{
          fontSize: '0.94rem'
        }}>
            <div><strong>DOI:</strong>{t("article.maDinhDanhCoDinhCuaBaiBao")}</div>
            <div><strong>References:</strong>{t("article.danhSachTaiLieuMaBaiBaoNayTric")}</div>
            <div><strong>Citations / Cited by:</strong>{t("article.soCongTrinhKhacTrichDanLaiBaiB")}</div>
          </div>
        </Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" onClick={() => setShowCitationsModal(false)} className="font-display">{t("article.dong")}</Button></Modal.Footer>
      </Modal>

      <AuthRequiredModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />
    </div>;
};

// ======================================================================
// Main Page Component
// ======================================================================
export default function ArticleVisualDetailPage() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [originArticle, setOriginArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [isRecommendedLoading, setIsRecommendedLoading] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(id);
  // State để quản lý trạng thái của iframe: 'loading', 'loaded', 'error'
  const [iframeStatus, setIframeStatus] = useState('loading');
  // State để trigger việc re-mount iframe khi cần tải lại
  const [iframeReloadKey, setIframeReloadKey] = useState(Date.now());
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef(null);
  useEffect(() => {
    setSelectedArticleId(id);
  }, [id]);
  const fetchRecommendedArticles = useCallback(async parsedArticle => {
    try {
      setIsRecommendedLoading(true);
      const params = {
        limit: 15,
        page: 1
      };
      const journalId = Number(parsedArticle.journal_id);
      const topicId = Number(parsedArticle.primary_topic || parsedArticle.topic_id);
      if (Number.isFinite(journalId)) params.journal_id = journalId;
      if (Number.isFinite(topicId)) params.topic_id = topicId;
      const response = await getArticlesListApi(params);
      const payload = response.data?.data || response.data || {};
      const rawItems = payload.items || payload.articles || payload.data || [];
      const normalizedItems = rawItems.map(normalizeRecommendedArticle).filter(item => String(item.article_id) !== String(parsedArticle.article_id)).slice(0, 10);
      setRecommendedArticles(normalizedItems);
    } catch (err) {
      console.warn('Error fetching recommended articles:', err);
      setRecommendedArticles([]);
    } finally {
      setIsRecommendedLoading(false);
    }
  }, []);
  const fetchOriginArticleDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getArticleDetailApi(id);
      if (response.data && response.data.success !== false) {
        const apiData = response.data.data || {};
        const parsedArticle = normalizeArticleDetail(apiData, id);
        setOriginArticle(parsedArticle);
        fetchRecommendedArticles(parsedArticle);
      } else {
        throw new Error(t("article.khongTheTaiChiTietBaiBaoKhoaHo"));
      }
    } catch (err) {
      console.error('Error fetching article detail:', err);
      setError(err.response?.data?.message || err.message || t("article.loiKhiTaiDuLieuBaiBaoKhoaHoc"));
    } finally {
      setIsLoading(false);
    }
  }, [id, fetchRecommendedArticles]);
  useEffect(() => {
    fetchOriginArticleDetail();
  }, [fetchOriginArticleDetail]);

  // Logic mới: Ping server trước khi render iframe
  useEffect(() => {
    // Chỉ chạy khi có originArticle
    if (!originArticle) return;
    let isMounted = true;
    setIframeStatus('loading');
    const iframeUrl = `${import.meta.env.VITE_ORIGIN_URL || 'http://localhost:5174'}/embed/article-graph?keyword=${encodeURIComponent(originArticle.title)}&limit=1`;
    const origin = import.meta.env.VITE_ORIGIN_URL || 'http://localhost:5174';
    const checkServiceAvailability = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        await fetch(origin, {
          mode: 'no-cors',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (isMounted) {
          setIframeStatus('content-loading');
        }
      } catch (error) {
        console.error('[Parent] Iframe service is not available:', error.name, error.message);
        if (isMounted) {
          setIframeStatus('error');
        }
      }
    };
    checkServiceAvailability();
    const handleMessage = event => {
      if (event.origin !== origin) return;
    };
    window.addEventListener('message', handleMessage);
    return () => {
      isMounted = false;
      window.removeEventListener('message', handleMessage);
    };
  }, [originArticle, iframeReloadKey]);
  useEffect(() => {
    setIframeStatus('loading');
    const timeoutId = setTimeout(() => {
      setIframeStatus(currentStatus => {
        if (currentStatus === 'loading') {
          console.warn('[Parent] Iframe load timed out.');
          return 'error';
        }
        return currentStatus;
      });
    }, 10000);
    setIsIframeLoading(true);
    setIframeError(false);
    const iframeLoadTimeout = setTimeout(() => {
      // Nếu iframe không gửi message 'graph-ready' trong 10s, coi như lỗi
      if (isIframeLoading) {
        console.warn('[Parent] Iframe load timed out after 10 seconds.');
        setIframeError(true);
        setIsIframeLoading(false);
      }
    }, 10000); // 10 giây timeout

    // Xử lý message từ iframe
    const handleMessage = event => {
      const allowedOrigin = import.meta.env.VITE_ORIGIN_URL || 'http://localhost:5174';
      if (event.origin !== allowedOrigin) return;
      const message = event.data;
      if (message?.source !== 'article-graph-widget') return;
      if (message.type === 'GRAPH_READY') {
        console.log('[Parent] Received GRAPH_READY message from iframe.');
        setIframeStatus('loaded'); // Đánh dấu đã tải xong nếu nhận được message
        clearTimeout(iframeLoadTimeout);
        setIsIframeLoading(false);
        setIframeError(false);
      }
      if (message.type === 'NODE_CLICK') {
        console.log('[Parent] Node clicked, received payload:', message.payload);
        let newId = message.payload?.id;
        if (newId) {
          // Attempt to parse ID to integer as per API spec
          const parsedId = parseInt(newId, 10);
          if (!isNaN(parsedId)) {
            console.log(`[Parent] Updating selected article ID from '${selectedArticleId}' to parsed integer ID: '${parsedId}'`);
            setSelectedArticleId(parsedId);
          } else {
            console.warn(`[Parent] Received ID '${newId}' is not a valid integer. Cannot fetch article details.`);
            setSelectedArticleId(null); // Clear sidebar if ID is invalid
          }
        } else {
          console.warn('[Parent] No ID found in node click payload. Clearing sidebar.');
          setSelectedArticleId(null); // Clear sidebar if no ID
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('message', handleMessage);
      clearTimeout(iframeLoadTimeout);
    };
  }, [id, originArticle?.title, iframeReloadKey]); // Re-run effect khi id, title, hoặc key tải lại thay đổi

  const handleTitleClick = articleId => {
    navigate(`/articles/${articleId}`);
  };

  // Hàm để thử tải lại iframe
  const handleReloadIframe = () => {
    setIframeStatus('loading'); // Reset trạng thái về loading
    setIframeReloadKey(Date.now()); // Thay đổi key để re-mount iframe
  };
  if (isLoading) {
    return <div className="article-detail-page grid-bg">
        <Header />
        <Container fluid className="position-relative z-1 p-0">
          <ArticleDetailSkeleton />
        </Container>
      </div>;
  }
  if (error) {
    return <div className="article-detail-page grid-bg">
        <Header />
        <Container fluid className="position-relative z-1 p-0">
          <ArticleDetailError errorMsg={error} onRetry={fetchOriginArticleDetail} />
        </Container>
      </div>;
  }
  if (!originArticle) {
    return <div className="article-detail-page grid-bg">
        <Header />
        <Container fluid className="position-relative z-1 p-0">
          <ArticleDetailEmpty articleId={id} />
        </Container>
      </div>;
  }
  return <div className="article-detail-page grid-bg">
      <Header />
      <Container fluid className="position-relative z-1 p-0">
        <main className="article-connected-shell">
          {/* Left Column: Related Papers list */}
          <aside className="article-connected-left">
            <div className="section-header-tag px-3 pt-3 pb-2 text-uppercase fw-bold text-muted-custom">Origin Paper</div>
            <div className="related-paper-card is-origin px-3 py-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="origin-badge">Active</span>
                <span className="paper-year font-display">{originArticle.publication_year || '—'}</span>
              </div>
              <h3 className="paper-title font-display" onClick={() => handleTitleClick(originArticle.article_id)} title={t("article.xemChiTietBaiBao")}>
                {originArticle.title}
              </h3>
              <div className="paper-authors font-display mt-2">{formatAuthorsLine(originArticle.authors, 3)}</div>
            </div>
            <div className="section-header-tag px-3 pt-4 pb-2 text-uppercase fw-bold text-muted-custom border-top">Related Papers ({recommendedArticles.length})</div>
            <div className="related-papers-list">
              {isRecommendedLoading ? <div className="p-3 text-center text-muted-custom">
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Loading recommendations...
                </div> : recommendedArticles.length === 0 ? <div className="p-3 text-center text-muted-custom font-display">No related papers found.</div> : recommendedArticles.map(rec => <div key={rec.article_id} className="related-paper-card px-3 py-3" onClick={() => navigate(`/articles/${rec.article_id}/visual`)}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="paper-year font-display">{rec.publication_year}</span>
                    </div>
                    <h4 className="paper-title font-display">{rec.title}</h4>
                    <div className="paper-authors font-display mt-2">{rec.authors}</div>
                  </div>)}
            </div>
          </aside>

          {/* Middle Column: Interactive network graph placeholder */}
          <section className="article-connected-middle">
            <div className="middle-panel-header px-3 py-2 d-flex align-items-center justify-content-between border-bottom">
              <span className="panel-title font-display fw-bold text-main">Interactive Network Graph</span>
              <span className="text-muted-custom text-xs">Concentric Radar Plot</span>
            </div>
            <div className="iframe-container" style={{
            background: 'var(--bg-main)'
          }}>
              {/* Giao diện Loading ban đầu (khi đang ping) */}
              {iframeStatus === 'loading' && <div className="iframe-state-overlay">
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>{t("article.dangKiemTraDichVuBieuDo")}</div>}

              {/* Chỉ render iframe khi dịch vụ đã được xác nhận là có sẵn */}
              {iframeStatus === 'content-loading' && <iframe key={iframeReloadKey} src={`${import.meta.env.VITE_ORIGIN_URL || 'http://localhost:5174'}/embed/article-graph?keyword=${encodeURIComponent(originArticle.title)}&limit=1`} title="Interactive Article Graph" className="article-graph-iframe"
            // Sự kiện onLoad này vẫn hữu ích để ẩn spinner nếu iframe tải xong
            // nhưng không gửi postMessage.
            onLoad={() => console.log('[Parent] Iframe content loaded.')} onError={() => setIframeStatus('error')} />}

              {iframeStatus === 'error' && <ErrorState className="border-0" icon="lucide:server-off" title={t("article.khongTheTaiBieuDo")} message={t("article.dichVuNhungCoTheDangKhongHoatD")} onRetry={handleReloadIframe} retryLabel=" Tải lại biểu đồ" />}
            </div>
          </section>
          {/* Right Column: Active Article details */}
          <aside className="article-connected-right">
            {selectedArticleId && <ArticleDetailPane articleId={selectedArticleId} onTitleClick={handleTitleClick} />}
          </aside>
        </main>
      </Container>
    </div>;
}