/**
 * @file AuthorCard.jsx
 * @description Component thẻ (Card) hiển thị thông tin tóm tắt của một tác giả.
 * Được sử dụng trong chế độ xem dạng lưới (Grid) của trang Danh sách Tác giả.
 * 
 * Các tính năng chính:
 * - Hiệu ứng chuyển động CSS mượt mà khi di chuột qua (nâng thẻ lên và làm nổi bật viền).
 * - Bố cục ngang nhỏ gọn hiển thị thông tin cơ bản (tên, chức vụ, cơ quan công tác).
 * - Các chỉ số học thuật cốt lõi (h-index, lượt trích dẫn, số bài báo) định dạng theo kiểu Việt Nam.
 * - Các thẻ lĩnh vực tương tác ở dưới cùng, nhấp vào sẽ lọc danh mục bài viết.
 */

import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import AuthorAvatar from './AuthorAvatar';

/**
 * Hiển thị thẻ tóm tắt thông tin cho từng tác giả.
 * 
 * @param {Object} props - Thuộc tính truyền vào component.
 * @param {Object} props.author - Đối tượng chứa dữ liệu của tác giả.
 * @returns {JSX.Element|null} Giao diện thẻ tóm tắt tác giả.
 */
export default function AuthorCard({ author }) {
  const navigate = useNavigate();

  // Bảo vệ chống tham số trống
  if (!author) return null;

  // Trích xuất các biến an toàn kèm dữ liệu dự phòng
  const id = author.author_id ?? author.id;
  const name = author.full_name ?? author.name ?? 'Tác giả';
  const institution1 = author.institution_1 ?? author.institution ?? '—';
  const institution2 = author.institution_2 ?? author.department ?? '';
  const hIndex = author.h_index ?? 0;
  const citations = author.citation_count ?? author.citations ?? 0;
  const articlesCount = author.article_count ?? author.papers ?? 0;
  const tags = author.subject_areas ?? [];
  const avatarColor = author.avatar_color ?? '#FF7A33';

  /**
   * Định dạng hàng nghìn bằng dấu chấm phân cách phù hợp với quy chuẩn thiết kế Việt Nam.
   * 
   * @param {number} num - Số cần định dạng.
   * @returns {string} Chuỗi số đã định dạng.
   */
  const formatLocalNumber = (num) => {
    if (num == null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  /**
   * Điều hướng người dùng đến trang hồ sơ chi tiết của tác giả tương ứng.
   * 
   * @returns {void}
   */
  const handleCardClick = () => {
    if (id) {
      navigate(`/authors/${id}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="p-4 transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.01)',
        height: '100%',
        transition: 'all 0.2s ease-in-out' // Hiệu ứng chuyển động mượt mà khi di chuột
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.01)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Phần trên: Vòng tròn Avatar & văn bản chứa thông tin cơ quan công tác chính/phụ */}
      <div className="d-flex align-items-start gap-3 mb-3">
        <AuthorAvatar 
          name={name} 
          size="md" 
          bgColor={avatarColor}
          className="flex-shrink-0"
        />
        <div className="flex-grow-1 min-w-0">
          <h3 
            className="font-display text-main m-0 text-truncate"
            style={{ fontSize: '1.05rem', fontWeight: 700 }}
          >
            {name}
          </h3>
          <div 
            className="text-main mt-1 text-truncate"
            style={{ fontSize: '0.85rem', fontWeight: 500 }}
          >
            {institution1}
          </div>
          {institution2 && (
            <div 
              className="text-muted-custom mt-0.5 text-truncate"
              style={{ fontSize: '0.78rem' }}
            >
              {institution2}
            </div>
          )}
        </div>
      </div>

      {/* Phần giữa: Hàng hiển thị các chỉ số đo lường chính */}
      <div className="d-flex gap-4 mb-3 mt-auto">
        <div>
          <div className="text-muted-custom" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            H-index
          </div>
          <div className="text-main fw-bold" style={{ fontSize: '1.05rem', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            {hIndex}
          </div>
        </div>
        <div>
          <div className="text-muted-custom" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Trích dẫn
          </div>
          <div className="text-main fw-bold" style={{ fontSize: '1.05rem', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            {formatLocalNumber(citations)}
          </div>
        </div>
        <div>
          <div className="text-muted-custom" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Bài báo
          </div>
          <div className="text-main fw-bold" style={{ fontSize: '1.05rem', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            {formatLocalNumber(articlesCount)}
          </div>
        </div>
      </div>

      {/* Đường phân cách ngang mỏng */}
      <hr className="my-3" style={{ borderTop: '1px solid var(--border)', opacity: 0.6 }} />

      {/* Phần dưới cùng: Các nhãn (Chip) từ khóa/lĩnh vực nghiên cứu */}
      <div className="d-flex flex-wrap gap-1.5 mt-1">
        {tags.length === 0 ? (
          <span className="text-muted-custom" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>Chưa cập nhật lĩnh vực</span>
        ) : (
          tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-pill"
              style={{
                fontSize: '0.72rem',
                fontWeight: 500,
                backgroundColor: 'var(--bg-chip)',
                color: 'var(--text-muted)',
                border: '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'var(--bg-chip)';
              }}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn sự kiện click thẻ lan truyền lên trên
                // Điều hướng sang trang catalog để lọc theo từ khóa lĩnh vực
                navigate(`/catalog?search=${encodeURIComponent(tag)}`);
              }}
            >
              {tag}
            </span>
          ))
        )}
      </div>
    </Card>
  );
}
