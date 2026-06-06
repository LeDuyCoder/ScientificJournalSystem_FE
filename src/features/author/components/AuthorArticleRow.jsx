/**
 * @file AuthorArticleRow.jsx
 * @description Hiển thị một thẻ bài báo nghiên cứu khoa học của tác giả.
 * 
 * Bố cục tuân theo cấu trúc xuất bản khoa học:
 * - Dòng 1: Tên tạp chí (in nghiêng/màu nhạt) và năm xuất bản.
 * - Dòng 2: Tiêu đề bài báo in đậm, hoạt động như một liên kết điều hướng đến `/articles/:id`.
 * - Dòng 3: Siêu dữ liệu chứa tổng số lượt trích dẫn, nút nhấp để sao chép DOI và liên kết xem chi tiết.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../shared/components/Icon';

/**
 * @component AuthorArticleRow
 * @description Thành phần hiển thị một mục bài báo cụ thể trong danh mục xuất bản.
 * 
 * @param {Object} props
 * @param {Object} props.article - Thông tin chi tiết bài báo (tiêu đề, tên tạp chí, mã DOI, v.v.)
 * @param {boolean} [props.isLast] - Cờ ẩn đường viền dưới nếu đây là mục cuối cùng trong danh sách
 */
export default function AuthorArticleRow({ article, isLast = false }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false); // Điều khiển trạng thái icon phản hồi sao chép vào clipboard

  // Safely extract properties
  const id = article.article_id ?? article.id;
  const title = article.title ?? 'Bài báo nghiên cứu';
  const journal = article.journal_name ?? article.journal ?? 'Tạp chí khoa học';
  const year = article.publication_year ?? article.year ?? '—';
  const citations = article.citation_count ?? article.citations ?? 0;
  const doi = article.doi ?? '';

  /**
   * @function handleTitleClick
   * @description Điều hướng người dùng sang trang xem chi tiết bài báo tương ứng.
   */
  const handleTitleClick = () => {
    if (id) {
      navigate(`/articles/${id}`);
    }
  };

  /**
   * @function handleCopyDoi
   * @description Sao chép chuỗi DOI vào bộ nhớ tạm (clipboard) của hệ điều hành và hiển thị tạm thời biểu tượng tích xanh.
   */
  const handleCopyDoi = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click vào nhãn DOI kích hoạt sự kiện điều hướng của thẻ bài báo
    if (!doi) return;
    navigator.clipboard.writeText(doi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Đặt lại trạng thái sau 2 giây
  };

  return (
    <div 
      className="py-3"
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        transition: 'background-color 0.15s ease'
      }}
    >
      {/* Dòng 1: Tên Tạp chí & Năm Xuất bản */}
      <div className="d-flex justify-content-between align-items-baseline gap-3 mb-1.5">
        <span 
          className="text-muted-custom font-medium text-truncate"
          style={{ fontSize: '0.8rem', opacity: 0.9 }}
        >
          {journal}
        </span>
        <span 
          className="text-muted-custom flex-shrink-0 fw-semibold"
          style={{ fontSize: '0.8rem' }}
        >
          {year}
        </span>
      </div>

      {/* Dòng 2: Tiêu đề Bài báo */}
      <h4 
        onClick={handleTitleClick}
        className="text-main fw-bold mb-2 hover:text-primary cursor-pointer transition-colors"
        style={{ 
          fontSize: '0.92rem', 
          fontFamily: 'var(--font-sans)', 
          lineHeight: '1.4',
          cursor: 'pointer'
        }}npm
      >
        {title}
      </h4>

      {/* Dòng 3: Số lượt Trích dẫn, Nhãn sao chép DOI & Liên kết Xem Chi tiết */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ fontSize: '0.78rem' }}>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted-custom">
            Được trích dẫn: <strong className="text-main fw-semibold">{citations} lần</strong>
          </span>
          {doi && (
            <div 
              onClick={handleCopyDoi}
              className="d-flex align-items-center gap-1 text-muted-custom hover:text-primary cursor-pointer border rounded px-2 py-0.5"
              style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-chip)', borderColor: 'var(--border)' }}
              title="Click để sao chép mã DOI"
            >
              <Icon icon={copied ? 'lucide:check' : 'lucide:copy'} width="10" className={copied ? 'text-success' : ''} />
              <span>DOI: {doi}</span>
            </div>
          )}
        </div>
        
        <span 
          onClick={handleTitleClick}
          className="text-primary hover:underline fw-semibold cursor-pointer d-flex align-items-center gap-0.5"
          style={{ cursor: 'pointer' }}
        >
          Chi tiết <Icon icon="lucide:chevron-right" width="12" />
        </span>
      </div>
    </div>
  );
}
