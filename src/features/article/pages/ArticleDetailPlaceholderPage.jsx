import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import { getArticleDetailApi } from '../api/articleApi';

export default function ArticleDetailPlaceholderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getArticleDetailApi(id);
        if (response.data && response.data.success !== false) {
          const apiData = response.data.data || {};
          setArticle({
            title: apiData.title,
            abstract: apiData.abstract || 'Không có tóm tắt cho bài báo này.',
            publication_year: apiData.publication_year,
            doi: apiData.doi,
            journal_name: apiData.journal_name || 'Scientific Journal',
            primary_topic: apiData.primary_topic || 'Computer Science',
            is_open_access: true,
            citations: 15,
            authors: ['Tác giả Liên kết (Đại học Quốc gia Hà Nội)', 'Đồng tác giả (Đại học Bách Khoa)']
          });
        } else {
          throw new Error('Không lấy được chi tiết bài báo');
        }
      } catch (err) {
        console.error('Backend detail API error:', err);
        setError(err.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu bài báo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

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
        {/* Back Button & Breadcrumbs */}
        <div className="mb-4">
          <Button 
            variant="link" 
            onClick={() => navigate('/articles')}
            className="text-primary hover:text-dark p-0 text-decoration-none d-flex align-items-center gap-2 mb-3"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            <Icon icon="lucide:arrow-left" width="18" />
            <span>Quay lại danh sách bài báo</span>
          </Button>
          <div className="d-flex align-items-center gap-2 text-muted-custom text-xs font-display">
            <span>Trang chủ</span>
            <Icon icon="lucide:chevron-right" width="12" />
            <span>Bài báo</span>
            <Icon icon="lucide:chevron-right" width="12" />
            <span className="text-main text-truncate" style={{ maxWidth: '200px' }}>Chi tiết</span>
          </div>
        </div>

        {isLoading ? (
          <Card className="border-0 p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <div className="bg-secondary opacity-15 rounded mb-3" style={{ width: '70%', height: '32px' }} />
            <div className="bg-secondary opacity-10 rounded mb-4" style={{ width: '40%', height: '18px' }} />
            <div className="bg-secondary opacity-10 rounded mb-2" style={{ width: '100%', height: '100px' }} />
          </Card>
        ) : error || !article ? (
          <Card 
            className="border-0 p-5 text-center" 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border)', 
              borderRadius: '16px' 
            }}
          >
            <div className="text-warning mb-3">
              <Icon icon="lucide:alert-triangle" width="48" height="48" />
            </div>
            <h4 className="text-main mb-2">Không tìm thấy bài báo</h4>
            <p className="text-muted-custom text-sm mb-4">
              Bài báo với ID {id} không tồn tại hoặc có lỗi trong quá trình kết nối với cơ sở dữ liệu.
            </p>
            <Button 
              className="btn-primary-glow border-0 px-4 py-2 text-xs font-semibold rounded-pill text-white"
              onClick={() => navigate('/articles')}
            >
              Về trang danh sách
            </Button>
          </Card>
        ) : (
          <Row className="g-4">
            <Col xs={12} lg={8}>
              {/* Main Info Card */}
              <Card 
                className="border-0 p-4 mb-4" 
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)'
                }}
              >
                {/* badges */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Badge 
                    className="py-1.5 px-2.5 text-xs font-weight-bold" 
                    style={{ 
                      borderRadius: '6px', 
                      fontSize: '0.75rem',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {article.primary_topic}
                  </Badge>
                  {article.is_open_access && (
                    <Badge 
                      className="py-1.5 px-2.5 text-xs font-weight-bold" 
                      style={{ 
                        borderRadius: '6px', 
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(25, 135, 84, 0.08)',
                        color: '#198754',
                        border: '1px solid rgba(25, 135, 84, 0.2)'
                      }}
                    >
                      Open Access
                    </Badge>
                  )}
                  <Badge 
                    className="py-1.5 px-2.5 text-xs font-weight-bold" 
                    style={{ 
                      borderRadius: '6px', 
                      fontSize: '0.75rem',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    Năm: {article.publication_year}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="font-display font-weight-bold text-main mb-3" style={{ fontSize: '2rem', lineHeight: '1.3' }}>
                  {article.title}
                </h1>

                {/* Journal Source */}
                <div className="d-flex align-items-center gap-2 mb-4 text-muted-custom" style={{ fontSize: '0.9rem' }}>
                  <Icon icon="lucide:book-open" className="text-primary" width="18" />
                  <span>Xuất bản trong tạp chí:</span>
                  <span className="text-primary font-weight-semibold">{article.journal_name}</span>
                </div>

                {/* Abstract Section */}
                <h5 className="font-display font-weight-bold text-main mb-3 d-flex align-items-center gap-2">
                  <Icon icon="lucide:align-left" className="text-primary" />
                  Tóm tắt bài báo (Abstract)
                </h5>
                <p 
                  className="text-main text-sm p-3 rounded-3 mb-4" 
                  style={{ 
                    lineHeight: '1.7', 
                    backgroundColor: 'var(--bg-main)',
                    borderLeft: '3px solid var(--primary)'
                  }}
                >
                  {article.abstract}
                </p>

                {/* DOI & Citation information */}
                <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <Row className="g-3 align-items-center">
                    <Col xs={12} sm={6}>
                      <div className="text-muted-custom text-xs" style={{ fontSize: '0.75rem' }}>DOI LINK</div>
                      <a 
                        href={`https://doi.org/${article.doi}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-dark text-sm font-display text-truncate d-block mt-0.5"
                      >
                        {article.doi || 'Không khả dụng'}
                      </a>
                    </Col>
                    <Col xs={12} sm={6} className="text-sm-end">
                      <div className="text-muted-custom text-xs" style={{ fontSize: '0.75rem' }}>SỐ LƯỢT TRÍCH DẪN</div>
                      <span className="text-warning font-weight-bold fs-5 mt-0.5 d-block">
                        <Icon icon="lucide:award" className="me-1" />
                        {article.citations} lần
                      </span>
                    </Col>
                  </Row>
                </div>

              </Card>
            </Col>

            <Col xs={12} lg={4}>
              {/* Authors side card */}
              <Card 
                className="border-0 p-4 mb-4" 
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '16px'
                }}
              >
                <h5 className="font-display font-weight-bold text-main mb-3 d-flex align-items-center gap-2 border-bottom border-light pb-2">
                  <Icon icon="lucide:users" className="text-primary" />
                  Nhóm Tác giả
                </h5>
                <div className="d-flex flex-column gap-3">
                  {article.authors && article.authors.map((author, index) => (
                    <div key={index} className="d-flex align-items-start gap-2.5">
                      <div 
                        className="d-flex align-items-center justify-content-center text-white text-xs font-bold rounded-circle mt-0.5"
                        style={{
                          width: '28px',
                          height: '28px',
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                          flexShrink: 0
                        }}
                      >
                        {author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm text-main font-weight-semibold">{author.split(' (')[0]}</div>
                        <div className="text-muted-custom text-xs" style={{ fontSize: '0.75rem' }}>
                          {author.includes('(') ? author.split('(')[1].replace(')', '') : 'Nghiên cứu viên'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Research Rights Card */}
              <Card 
                className="border-0 p-4" 
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  backgroundImage: 'linear-gradient(180deg, var(--primary-light) 0%, transparent 100%)'
                }}
              >
                <h6 className="text-main font-weight-bold mb-2">Quyền chia sẻ tài liệu</h6>
                <p className="text-muted-custom text-xs mb-3" style={{ lineHeight: '1.6', fontSize: '0.75rem' }}>
                  Bài báo khoa học này được hiển thị nhằm phục vụ mục đích tra cứu học thuật. Vui lòng dẫn nguồn DOI chính xác khi trích dẫn tài liệu này.
                </p>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100 rounded-pill text-xs py-1.5"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://doi.org/${article.doi}`);
                      alert('Đã copy liên kết DOI');
                    }}
                  >
                    <Icon icon="lucide:share-2" className="me-1" />
                    Chia sẻ
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
