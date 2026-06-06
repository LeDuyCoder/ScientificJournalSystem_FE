/**
 * @file AuthorArticlesSection.jsx
 * @description Điều phối việc hiển thị danh sách các bài báo nghiên cứu khoa học của tác giả.
 * Chứa các công cụ điều khiển sắp xếp (theo năm xuất bản, lượt trích dẫn) và phân trang cục bộ
 * để xử lý danh mục xuất bản lớn.
 * 
 * Các tính năng chính:
 * - Tính toán sắp xếp dữ liệu cục bộ ngay trong chu kỳ render của component.
 * - Phân trang dựa trên state nội bộ kết hợp với bộ điều khiển phân trang Bootstrap.
 * - Khung xương loading (shimmer skeleton) đại diện tương ứng cho danh sách bài báo.
 * - Kích hoạt hiển thị lỗi biệt lập thông qua ErrorState.
 */

import { useState } from 'react';
import { Card, Form, Pagination } from 'react-bootstrap';
import AuthorArticleRow from './AuthorArticleRow';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import EmptyState from '../../../shared/components/EmptyState';
import ErrorState from '../../../shared/components/ErrorState';

/**
 * @component AuthorArticlesSection
 * @description Component bao bọc danh sách bài báo khoa học kèm theo logic sắp xếp & phân trang cục bộ.
 * 
 * @param {Object} props
 * @param {Array} props.articles - Tập hợp danh sách bài báo được viết bởi tác giả này
 * @param {boolean} props.loading - Cờ hiển thị trạng thái danh sách bài báo đang được tải
 * @param {Object|string} props.error - Đối tượng lỗi/thông báo lỗi khi tải danh sách bài báo thất bại
 * @param {Function} props.onRetry - Hàm gọi lại để thử tải lại danh sách bài báo khi có lỗi
 */
export default function AuthorArticlesSection({
  articles = [],
  loading = false,
  error = null,
  onRetry = null
}) {
  const [sortKey, setSortKey] = useState('year-desc'); // Theo dõi khóa sắp xếp: mới nhất, cũ nhất, trích dẫn nhiều nhất
  const [currentPage, setCurrentPage] = useState(1);   // Chỉ số trang hiện tại đang hoạt động
  const itemsPerPage = 5;                              // Kích thước trang (hiển thị tối đa 5 bài viết trên một trang)

  // ── TRẠNG THÁI LỖI ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <Card className="p-4 border rounded-3 bg-white mb-4">
        <ErrorState message={error} onRetry={onRetry} />
      </Card>
    );
  }

  // ── LOGIC SẮP XẾP ──────────────────────────────────────────────────────────
  // Sắp xếp danh sách bài báo cục bộ dựa trên tiêu chí được chọn.
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortKey === 'year-desc') {
      return (b.publication_year ?? 0) - (a.publication_year ?? 0);
    }
    if (sortKey === 'year-asc') {
      return (a.publication_year ?? 0) - (b.publication_year ?? 0);
    }
    if (sortKey === 'citations-desc') {
      return (b.citation_count ?? 0) - (a.citation_count ?? 0);
    }
    return 0;
  });

  // ── PHÂN TRANG DỮ LIỆU ─────────────────────────────────────────────────────
  // Xác định giới hạn lát cắt mảng cho trang đang hiển thị hiện tại.
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = sortedArticles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card 
      id="articles-section"
      className="p-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.01)'
      }}
    >
      {/* Phần điều khiển trên đầu: Tiêu đề & Hộp chọn Sắp xếp */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-3 border-bottom border-light pb-3">
        <div>
          <h3 
            className="font-display text-main fw-bold m-0"
            style={{ fontSize: '1.2rem', letterSpacing: '-0.01em' }}
          >
            Công trình Công bố khoa học
          </h3>
          <p className="text-muted-custom m-0 mt-1" style={{ fontSize: '0.78rem' }}>
            Các bài viết và nghiên cứu gần đây được xuất bản.
          </p>
        </div>

        {/* Bộ chọn Sắp xếp: Chỉ hiển thị nếu có bài báo khoa học trong danh sách */}
        {!loading && articles.length > 0 && (
          <Form.Select
            size="sm"
            value={sortKey}
            onChange={(e) => {
              setSortKey(e.target.value);
              setCurrentPage(1); // Đặt lại về trang 1 khi thay đổi tiêu chí sắp xếp
            }}
            className="text-muted-custom"
            style={{ 
              width: '180px', 
              fontSize: '0.75rem',
              borderColor: 'var(--border)',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-chip)',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            <option value="year-desc">Năm xuất bản (Mới nhất)</option>
            <option value="year-asc">Năm xuất bản (Cũ nhất)</option>
            <option value="citations-desc">Trích dẫn (Nhiều nhất)</option>
          </Form.Select>
        )}
      </div>

      {/* ── TRẠNG THÁI KHUNG XƯƠNG LOADING (SKELETON) ─────────────────────────── */}
      {loading ? (
        <div className="d-flex flex-column gap-3.5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="py-3 border-bottom">
              <div className="d-flex justify-content-between mb-2">
                <LoadingSkeleton width="40%" height="12px" />
                <LoadingSkeleton width="10%" height="12px" />
              </div>
              <LoadingSkeleton width="85%" height="16px" className="mb-2" />
              <LoadingSkeleton width="30%" height="12px" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        /* ── TRẠNG THÁI TRỐNG (EMPTY STATE) ─────────────────────────────────── */
        <EmptyState
          title="Chưa có công trình công bố"
          description="Tác giả này chưa có bài báo khoa học nào trong hệ thống."
          icon="lucide:file-question"
          className="border-0 py-4"
        />
      ) : (
        /* ── DANH SÁCH BÀI BÁO & TRẠNG THÁI PHÂN TRANG ───────────────────────── */
        <div className="d-flex flex-column">
          {currentArticles.map((article, idx) => (
            <AuthorArticleRow
              key={article.article_id ?? article.id ?? idx}
              article={article}
              isLast={idx === currentArticles.length - 1}
            />
          ))}

          {/* Các nút Điều khiển Phân trang */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination className="m-0 pagination-sm">
                <Pagination.Prev 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={currentPage === idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                    style={{
                      '--bs-pagination-active-bg': 'var(--primary)',
                      '--bs-pagination-active-border-color': 'var(--primary)',
                      '--bs-pagination-color': 'var(--text-muted)'
                    }}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
