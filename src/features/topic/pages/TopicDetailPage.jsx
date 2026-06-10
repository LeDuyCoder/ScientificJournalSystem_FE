/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\topic\pages\TopicDetailPage.jsx
 */
import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Pagination } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import { getTopicByIdApi, getTopicArticlesApi } from '../api/topic.api';

const PAGE_SIZE = 10;

const normalizeArticle = (item = {}) => ({
  id: item.article_id,
  title: item.title || 'Untitled article',
  year: item.publication_year,
  doi: item.doi,
  citations: item.citations_count ?? item.citations ?? 0,
});

export default function TopicDetailPage() {
  const navigate = useNavigate();
  const { topicId } = useParams();

  const [topic, setTopic] = useState(null);
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchTopicDetail = async () => {
      setLoading(true);
      setError('');

      try {
        const [topicResponse, articlesResponse] = await Promise.all([
          getTopicByIdApi(topicId),
          getTopicArticlesApi(topicId, { page: 1, limit: PAGE_SIZE }),
        ]);

        const topicData = topicResponse?.data?.data;
        const articlePayload = articlesResponse?.data?.data;

        if (!active) return;

        setTopic(topicData || null);
        setArticles((articlePayload?.articles || []).map(normalizeArticle));
        setPagination({
          page: articlePayload?.pagination?.page || 1,
          limit: articlePayload?.pagination?.limit || PAGE_SIZE,
          total: articlePayload?.pagination?.total || 0,
        });
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.message || 'Không thể tải thông tin topic.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTopicDetail();

    return () => {
      active = false;
    };
  }, [topicId]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((pagination.total || 0) / (pagination.limit || PAGE_SIZE)));
  }, [pagination]);

  const handlePageChange = async (nextPage) => {
    if (nextPage === pagination.page || nextPage < 1 || nextPage > totalPages) return;

    setLoading(true);
    setError('');

    try {
      const response = await getTopicArticlesApi(topicId, { page: nextPage, limit: pagination.limit || PAGE_SIZE });
      const payload = response?.data?.data;
      setArticles((payload?.articles || []).map(normalizeArticle));
      setPagination({
        page: payload?.pagination?.page || nextPage,
        limit: payload?.pagination?.limit || PAGE_SIZE,
        total: payload?.pagination?.total || 0,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách bài báo của topic.');
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    for (let page = 1; page <= totalPages; page += 1) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === pagination.page}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1} />
          {items}
          <Pagination.Next onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= totalPages} />
        </Pagination>
      </div>
    );
  };

  return (
    <div className="grid-bg min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--bg-main)' }}>
      <Header />

      <Container className="pb-5 flex-grow-1" style={{ paddingTop: '88px' }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ fontSize: '0.88rem' }}>
            <li className="breadcrumb-item">
              <span
                role="button"
                tabIndex={0}
                onClick={() => navigate('/articles')}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/articles')}
                className="text-decoration-none text-muted-custom hover-text-main"
                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              >
                Bài Báo
              </span>
            </li>
            <li className="breadcrumb-item active text-main fw-semibold" aria-current="page">
              Chủ đề nghiên cứu
            </li>
          </ol>
        </nav>

        <Card
          className="border-0 overflow-hidden mb-5 position-relative"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none' }}>
            <div className="position-absolute top-0 start-0 w-50 h-100" style={{ background: 'linear-gradient(90deg, rgba(var(--primary-rgb, 59, 130, 246), 0.05) 0%, transparent 100%)' }} />
          </div>

          <Card.Body className="p-4 p-lg-5 position-relative z-1">
            <Row className="g-5 align-items-center">
              <Col lg={8}>
                <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <Icon icon="solar:atom-bold-duotone" width="20" style={{ color: 'var(--primary)' }} />
                  <span className="text-muted-custom fw-bold text-uppercase" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>Research Topic</span>
                </div>

                <h1 className="font-display fw-bold text-main mb-4" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                  {topic?.display_name || 'Đang tải topic...'}
                </h1>

                <p className="text-muted-custom mb-0" style={{ fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 760 }}>
                  Khám phá các bài báo thuộc chủ đề này để cập nhật xu hướng nghiên cứu mới nhất, theo dõi những công trình tiêu biểu và đóng góp khoa học trong lĩnh vực.
                </p>
              </Col>

              <Col lg={4}>
                <div className="d-flex flex-column gap-3 p-4 rounded-4" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="text-muted-custom fw-semibold" style={{ fontSize: '0.88rem' }}>
                      Mã Topic
                    </div>
                    <Badge bg="light" text="dark" className="border fw-bold" style={{ borderColor: 'var(--border)' }}>
                      #{topic?.topic_id || topicId}
                    </Badge>
                  </div>
                  
                  <hr className="my-1 border-secondary opacity-25" />
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted-custom fw-semibold" style={{ fontSize: '0.88rem' }}>
                      Tổng số bài báo
                    </div>
                    <div className="text-main font-display fw-bold" style={{ fontSize: '1.4rem' }}>
                      {(pagination.total || 0).toLocaleString('en-US')}
                    </div>
                  </div>

                  <Button
                    id="topic-view-all-articles"
                    onClick={() => navigate(`/articles?topic_id=${topicId}`)}
                    className="btn-primary-glow border-0 text-white fw-bold mt-2 w-100 shadow-sm d-flex justify-content-center align-items-center gap-2"
                    style={{ borderRadius: 12, minHeight: 48 }}
                  >
                    Mở Bộ Lọc Bài Báo <Icon icon="lucide:arrow-right" width="18" />
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
          <div>
            <h2 className="font-display fw-bold text-main mb-1" style={{ fontSize: '1.35rem' }}>
              Bài báo thuộc topic
            </h2>
            <p className="text-muted-custom mb-0" style={{ fontSize: '0.92rem' }}>
              Trang {pagination.page} / {totalPages}
            </p>
          </div>
          <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
            {(pagination.total || 0).toLocaleString('en-US')} bài báo
          </Badge>
        </div>

        {error && (
          <Alert variant="danger" className="border-0 shadow-sm rounded-4 mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" role="status" style={{ color: 'var(--primary)' }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div className="d-grid gap-3">
            {articles.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-4" style={{ backgroundColor: 'var(--bg-card)' }}>
                <Card.Body className="p-4 text-center text-muted-custom">
                  Chưa có bài báo nào cho topic này.
                </Card.Body>
              </Card>
            ) : (
              articles.map((article) => (
                <Card
                  key={article.id}
                  className="border-0 shadow-sm rounded-4 article-row-card"
                  style={{ backgroundColor: 'var(--bg-card)', transition: 'transform 0.18s ease, box-shadow 0.18s ease' }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                      <div className="flex-grow-1">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-start text-decoration-none fw-semibold mb-2"
                          style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.6 }}
                          onClick={() => navigate(`/articles/${article.id}`)}
                        >
                          {article.title}
                        </button>

                        <div className="d-flex flex-wrap gap-3 text-muted-custom" style={{ fontSize: '0.9rem' }}>
                          <span className="d-inline-flex align-items-center gap-1">
                            <Icon icon="lucide:calendar-range" width="15" />
                            {article.year || 'N/A'}
                          </span>
                          {article.doi && (
                            <a
                              href={article.doi.startsWith('http') ? article.doi : `https://doi.org/${article.doi}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-decoration-none d-inline-flex align-items-center gap-1"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              <Icon icon="lucide:link-2" width="15" />
                              DOI
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        )}

        {renderPagination()}
      </Container>
    </div>
  );
}
