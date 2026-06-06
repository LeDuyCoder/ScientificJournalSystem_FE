/**
 * @file AuthorDetailPage.jsx
 * @description Trang chi tiết hiển thị toàn bộ hồ sơ học thuật của một tác giả cụ thể.
 * Khớp với bố cục giao diện trong Ảnh thiết kế 1.
 * 
 * Cấu trúc bố cục:
 * - Trên cùng: Thanh Breadcrumb (`Tổng quan > Tác giả nổi bật > [Tên Tác giả]`) và nút quay lại.
 * - Cột Trái lưới Grid (lg={4}): Component `AuthorProfileHeader` chứa thông tin cá nhân, tiểu sử và các chỉ số thống kê.
 * - Cột Phải lưới Grid (lg={8}):
 *     - Phía trên: Component `AuthorAreasBreakdown` hiển thị biểu đồ phân bổ lĩnh vực nghiên cứu.
 *     - Phía dưới: Component `AuthorArticlesSection` danh sách các công trình bài báo đã xuất bản.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Icon from '../../../shared/components/Icon';
import Header from '../../landing/components/Header';
import useAuthors from '../hooks/useAuthors';
import AuthorProfileHeader from '../components/AuthorProfileHeader';
import AuthorAreasBreakdown from '../components/AuthorAreasBreakdown';
import AuthorArticlesSection from '../components/AuthorArticlesSection';

/**
 * @component AuthorDetailPage
 * @description Trang điều khiển chính cho tuyến đường chi tiết tác giả `/authors/:id`.
 */
export default function AuthorDetailPage() {
  const { id } = useParams(); // Lấy mã author_id từ tham số URL của React Router
  const navigate = useNavigate();

  // Trích xuất các hàm quản lý trạng thái cốt lõi từ hook useAuthors
  const {
    currentAuthor,
    authorArticles,
    authorBreakdown,
    loadingAuthorDetail,
    loadingArticles,
    loadingAreas,
    errorAuthorDetail,
    errorArticles,
    errorAreas,
    fetchAuthorDetailsFull,
    fetchAuthorDetail,
    fetchAuthorArticles,
    fetchAuthorAreasBreakdown
  } = useAuthors();

  // ── SIDE EFFECT: TẢI DỮ LIỆU BAN ĐẦU ────────────────────────────────────────
  // Thực hiện đồng thời các lệnh gọi API song song để lấy thông tin hồ sơ, phân bổ lĩnh vực và danh sách bài báo khi ID thay đổi.
  useEffect(() => {
    if (id) {
      fetchAuthorDetailsFull(id);
    }
  }, [id, fetchAuthorDetailsFull]);

  const authorName = currentAuthor?.full_name ?? currentAuthor?.name ?? 'Tác giả';

  return (
    <div
      className="min-vh-100"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', paddingTop: '80px' }}
    >
      {/* Thanh Header điều hướng */}
      <Header />

      <Container className="py-4">
        {/* 1. Breadcrumb điều hướng khớp với thiết kế */}
        <nav className="mb-4" aria-label="breadcrumb">
          <ol className="breadcrumb m-0" style={{ fontSize: '0.8rem' }}>
            <li className="breadcrumb-item">
              <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                Tổng quan
              </span>
            </li>
            <li className="breadcrumb-item">
              <span onClick={() => navigate('/authors')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                Tác giả nổi bật
              </span>
            </li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {loadingAuthorDetail ? 'Đang tải...' : authorName}
            </li>
          </ol>
        </nav>

        {/* Nút quay lại danh sách */}
        <div className="mb-3 d-flex justify-content-start">
          <Button
            variant="link"
            onClick={() => navigate('/authors')}
            className="text-primary text-decoration-none text-xs fw-semibold p-0 d-flex align-items-center gap-1.5"
            style={{ fontSize: '0.85rem' }}
          >
            <Icon icon="lucide:arrow-left" width="16" />
            Quay lại danh sách tác giả
          </Button>
        </div>

        {/* 2. Lưới Grid Chi tiết Chính (Khớp với bố cục Ảnh 1) */}
        <Row className="g-4">
          {/* Cột trái (Độ rộng: 33.33% trên màn hình máy tính lớn) */}
          <Col xs={12} lg={4}>
            <AuthorProfileHeader
              author={currentAuthor}
              loading={loadingAuthorDetail}
              error={errorAuthorDetail}
              onRetry={() => id && fetchAuthorDetail(id)}
            />
          </Col>

          {/* Cột phải (Độ rộng: 66.67% trên màn hình máy tính lớn) */}
          <Col xs={12} lg={8}>
            <div className="d-flex flex-column gap-4">
              {/* Phía trên: Phân bổ lĩnh vực nghiên cứu (Biểu đồ Donut SVG + thanh tiến trình) */}
              <AuthorAreasBreakdown
                breakdown={authorBreakdown}
                loading={loadingAreas}
                error={errorAreas}
                onRetry={() => id && fetchAuthorAreasBreakdown(id)}
              />

              {/* Phía dưới: Danh sách các bài báo đã công bố */}
              <AuthorArticlesSection
                articles={authorArticles}
                loading={loadingArticles}
                error={errorArticles}
                onRetry={() => id && fetchAuthorArticles(id)}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
