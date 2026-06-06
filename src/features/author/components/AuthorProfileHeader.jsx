/**
 * @file AuthorProfileHeader.jsx
 * @description Thẻ thông tin hồ sơ bên cột trái hiển thị siêu dữ liệu chính cho tác giả được chọn.
 * Được sử dụng ở trang Chi tiết Tác giả (`/authors/:id`) làm cột bên trái.
 * 
 * Các thành phần thiết kế chính:
 * - Avatar hiển thị chữ cái đầu với kích thước lớn nằm giữa (size `xl`).
 * - Thông tin cơ quan công tác nhiều cấp bậc với màu sắc phân biệt rõ ràng.
 * - Nhãn hộp Email có tính tương tác, hỗ trợ sao chép nhanh chóng.
 * - Các chỉ số H-index, Lượt trích dẫn và Số lượng bài báo nằm trong một khung lưới.
 * - Nút bấm động để cuộn trang mượt mà xuống phần danh sách các bài báo xuất bản (`#articles-section`).
 */

import { Card, Row, Col } from 'react-bootstrap';
import Icon from '../../../shared/components/Icon';
import AuthorAvatar from './AuthorAvatar';

/**
 * Component thẻ hồ sơ chi tiết ở thanh bên trái dành cho tác giả.
 * 
 * @param {Object} props - Thuộc tính truyền vào component.
 * @param {Object} props.author - Đối tượng chứa thông tin dữ liệu của tác giả.
 * @param {boolean} [props.loading=false] - Cờ hiển thị trạng thái đang tải dữ liệu (skeleton).
 * @returns {JSX.Element|null} Giao diện thẻ thông tin hồ sơ của tác giả.
 */
export default function AuthorProfileHeader({ author, loading = false }) {
  
  // ── HIỂN THỊ KHUNG XƯƠNG LOADING (SKELETON) ─────────────────────────────────
  // Mô phỏng các ô chỉ số học thuật và avatar tròn đi kèm với các hiệu ứng shimmer.
  if (loading) {
    return (
      <Card 
        className="p-4 border-0 text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border) !important',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.01)'
        }}
      >
        <div className="d-flex justify-content-center mb-3">
          <div className="skeleton-shimmer rounded-circle" style={{ width: '100px', height: '100px' }} />
        </div>
        <div className="skeleton-shimmer rounded mx-auto mb-2" style={{ width: '60%', height: '22px' }} />
        <div className="skeleton-shimmer rounded mx-auto mb-2" style={{ width: '50%', height: '16px' }} />
        <div className="skeleton-shimmer rounded mx-auto mb-4" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton-shimmer rounded mx-auto mb-3" style={{ width: '80%', height: '36px' }} />
        <div className="skeleton-shimmer rounded mx-auto" style={{ width: '100%', height: '60px' }} />
      </Card>
    );
  }

  // Bảo vệ chống tham số trống
  if (!author) return null;

  // Trích xuất các biến an toàn kèm dữ liệu dự phòng mặc định
  const name = author.full_name ?? author.name ?? 'Tác giả';
  const institution1 = author.institution_1 ?? author.institution ?? '—';
  const institution2 = author.institution_2 ?? author.department ?? '';
  const email = author.email ?? '';
  const hIndex = author.h_index ?? 0;
  const citations = author.citation_count ?? author.citations ?? 0;
  const articlesCount = author.article_count ?? author.papers ?? 0;
  const avatarColor = author.avatar_color ?? '#FF7A33';

  /**
   * Định dạng hàng nghìn bằng dấu chấm phân cách.
   * 
   * @param {number} num - Số cần định dạng.
   * @returns {string} Chuỗi số đã định dạng.
   */
  const formatLocalNumber = (num) => {
    if (num == null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Card 
      className="p-4 text-center"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.01)'
      }}
    >
      {/* 1. Centered Large Avatar */}
      <div className="d-flex justify-content-center mb-3">
        <AuthorAvatar 
          name={name} 
          size="xl" 
          bgColor={avatarColor} 
        />
      </div>

      {/* 2. Author Name */}
      <h2 
        className="font-display text-main fw-bold mb-1"
        style={{ fontSize: '1.4rem', letterSpacing: '-0.02em', lineHeight: '1.3' }}
      >
        {name}
      </h2>

      {/* 3. Affiliation 1 (Blue/Secondary Bold Accent) */}
      <div 
        className="fw-bold mb-1 px-2"
        style={{ fontSize: '0.85rem', color: '#0ea5e9' }}
      >
        {institution1}
      </div>

      {/* 4. Affiliation 2 (Muted text) */}
      {institution2 && (
        <div 
          className="text-muted-custom mb-2 px-2"
          style={{ fontSize: '0.78rem', lineHeight: '1.4' }}
        >
          {institution2}
        </div>
      )}

      {/* ORCID identifier block */}
      <div 
        className="text-muted-custom mb-3"
        style={{ fontSize: '0.76rem' }}
      >
        ORCID: <span className="text-main fw-medium">{author.orcid || 'Chưa cập nhật'}</span>
      </div>

      {/* 5. Email Pill (Light background with mail icon) */}
      {email && (
        <div className="d-flex justify-content-center mb-3">
          <div 
            className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
            style={{ 
              backgroundColor: 'var(--bg-chip)', 
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 500,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <Icon icon="lucide:mail" width="12" className="opacity-75" />
            <span className="text-truncate">{email}</span>
          </div>
        </div>
      )}

      {/* Short biography block */}
      <p 
        className="text-muted-custom mb-3.5 px-2"
        style={{ fontSize: '0.78rem', lineHeight: '1.5', textAlign: 'justify' }}
      >
        {author.bio || 'Chưa cập nhật thông tin tiểu sử.'}
      </p>

      {/* 6. Academic Metrics Inner Box (Displays 3 key stats) */}
      <div 
        className="rounded-3 border py-2.5 px-1 mb-3"
        style={{ borderColor: 'var(--border)', backgroundColor: 'transparent' }}
      >
        <Row className="g-0 align-items-center">
          {/* H-Index */}
          <Col xs={4} className="border-end" style={{ borderColor: 'var(--border)' }}>
            <div className="text-muted-custom" style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              H-index
            </div>
            <div className="text-main fw-bold mt-1" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', lineHeight: '1.1' }}>
              {hIndex}
            </div>
          </Col>

          {/* Citations */}
          <Col xs={4} className="border-end" style={{ borderColor: 'var(--border)' }}>
            <div className="text-muted-custom" style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Trích dẫn
            </div>
            <div className="text-main fw-bold mt-1" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', lineHeight: '1.1' }}>
              {formatLocalNumber(citations)}
            </div>
          </Col>

          {/* Articles Count */}
          <Col xs={4}>
            <div className="text-muted-custom" style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Bài báo
            </div>
            <div className="text-main fw-bold mt-1" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', lineHeight: '1.1' }}>
              {formatLocalNumber(articlesCount)}
            </div>
          </Col>
        </Row>
      </div>

      {/* Action Buttons group (External Homepage & smooth scroll navigations) */}
      <div className="d-flex flex-column gap-2 mt-2">
        {author.homepage && (
          <a
            href={author.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-1.5"
            style={{ 
              fontSize: '0.78rem', 
              fontWeight: 600, 
              borderColor: 'var(--border)', 
              color: 'var(--text-main)',
              borderRadius: '8px'
            }}
          >
            <Icon icon="lucide:globe" width="14" />
            Trang cá nhân (Homepage)
          </a>
        )}
        <button
          onClick={() => {
            // Tìm phần danh mục bài báo và cuộn trang mượt mà đến đó
            const el = document.getElementById('articles-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="btn btn-dark-solid w-100 py-2 d-flex align-items-center justify-content-center gap-1.5"
          style={{ fontSize: '0.78rem', fontWeight: 600, borderRadius: '8px' }}
        >
          <Icon icon="lucide:file-text" width="14" />
          Xem công trình công bố
        </button>
      </div>
    </Card>
  );
}
