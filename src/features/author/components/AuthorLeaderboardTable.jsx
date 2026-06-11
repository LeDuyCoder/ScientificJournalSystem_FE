/**
 * @file AuthorLeaderboardTable.jsx
 * @description Hiển thị bảng xếp hạng các tác giả hàng đầu trong hệ thống dưới dạng bảng.
 * 
 * Các tính năng chính:
 * - Sử dụng huy hiệu xếp hạng tùy chỉnh (`AuthorRankBadge`) cho các vị trí dẫn đầu.
 * - Căn chỉnh khoảng cách bằng flexbox với khoảng cách cố định `14px` giữa avatar và tên tác giả.
 * - Định dạng số cục bộ bằng dấu chấm phân cách hàng nghìn (ví dụ: 4.520).
 * - Tích hợp đầy đủ các trạng thái loading skeleton, danh sách trống và biểu ngữ báo lỗi.
 */

import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthorAvatar from './AuthorAvatar';
import AuthorRankBadge from './AuthorRankBadge';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import EmptyState from '../../../shared/components/EmptyState';
import ErrorState from '../../../shared/components/ErrorState';

/**
 * Component bảng hiển thị danh sách xếp hạng các tác giả nổi bật.
 * 
 * @param {Object} props - Thuộc tính truyền vào component.
 * @param {Array} [props.authors=[]] - Mảng danh sách tác giả đã được xếp hạng.
 * @param {boolean} [props.loading=false] - Cờ hiển thị trạng thái đang tải dữ liệu.
 * @param {Object|string} [props.error=null] - Đối tượng lỗi/thông báo lỗi khi tải dữ liệu thất bại.
 * @param {Function} [props.onRetry=null] - Hàm gọi lại xử lý nhấp chuột để tải lại khi có lỗi.
 * @param {number} [props.limit=null] - Giới hạn số lượng hàng dữ liệu hiển thị (cắt bớt mảng).
 * @returns {JSX.Element} Giao diện bảng xếp hạng tác giả.
 */
export default function AuthorLeaderboardTable({
  authors = [],
  loading = false,
  error = null,
  onRetry = null,
  limit = null
}) {
  const navigate = useNavigate();

  // ── XỬ LÝ TRẠNG THÁI LỖI ───────────────────────────────────────────────────
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // ── XỬ LÝ TRẠNG THÁI TRỐNG ─────────────────────────────────────────────────
  if (!loading && authors.length === 0) {
    return (
      <EmptyState
        title="Chưa có dữ liệu bảng xếp hạng"
        description="Dữ liệu xếp hạng sẽ hiển thị ở đây."
        icon="lucide:trophy"
      />
    );
  }

  // Cắt bớt danh sách nếu có chỉ định giới hạn số lượng hiển thị
  const displayList = limit ? authors.slice(0, limit) : authors;

  /**
   * Định dạng số theo quy chuẩn phân cách Việt Nam. Chuyển số lớn sang hậu tố K/M.
   * 
   * @param {number} num - Số cần định dạng.
   * @returns {string} Chuỗi số đã định dạng.
   */
  const formatLocalNumber = (num) => {
    if (num == null) return '0';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  /**
   * Điều hướng sang màn hình hồ sơ chi tiết của tác giả.
   * 
   * @param {Object} author - Đối tượng dữ liệu tác giả được click.
   * @returns {void}
   */
  const handleAuthorClick = (author) => {
    const id = author.author_id ?? author.id;
    if (id) {
      navigate(`/authors/${id}`);
    }
  };

  return (
    <div 
      className="rounded-3 overflow-hidden border"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <Table hover responsive className="m-0 align-middle">
        <thead style={{ backgroundColor: 'var(--bg-section)' }}>
          <tr>
            <th className="text-center text-muted-custom py-3" style={{ fontSize: '0.72rem', width: '70px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thứ hạng</th>
            <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tác giả</th>
            <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lĩnh vực chính</th>
            <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bài báo</th>
            <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Citations</th>
          </tr>
        </thead>
        <tbody>
          {/* ── HIỂN THỊ KHUNG XƯƠNG LOADING (SKELETON) ───────────────────────── */}
          {loading ? (
            Array.from({ length: limit || 5 }).map((_, idx) => (
              <tr key={idx}>
                <td className="text-center">
                  <LoadingSkeleton width="30px" height="30px" borderRadius="50%" />
                </td>
                <td>
                  <div className="d-flex align-items-center" style={{ gap: '14px' }}>
                    <LoadingSkeleton width="32px" height="32px" borderRadius="50%" />
                    <LoadingSkeleton width="120px" height="14px" />
                  </div>
                </td>
                <td>
                  <LoadingSkeleton width="80px" height="18px" borderRadius="12px" />
                </td>
                <td>
                  <LoadingSkeleton width="40px" height="14px" />
                </td>
                <td>
                  <LoadingSkeleton width="50px" height="14px" />
                </td>
              </tr>
            ))
          ) : (
            /* ── HIỂN THỊ DANH SÁCH DỮ LIỆU THỰC TẾ ─────────────────────────── */
            displayList.filter(Boolean).map((author, idx) => {
              const id = author.author_id ?? author.id;
              const name = author.display_name ?? author.full_name ?? author.author_name ?? author.name ?? 'Unknown';
              const orcid = author.orcid ?? '';
              const field = author.subject_area ?? author.primary_subject_area ?? author.field ?? author.area ?? '—';
              const articles = author.article_count ?? author.papers ?? author.works_count ?? 0;
              const citations = author.citation_count ?? author.citations ?? author.cited_by_count ?? 0;
              const rank = idx + 1;
              const avatarColor = author.avatar_color ?? (rank === 1 ? '#FF7A33' : rank === 2 ? '#6366F1' : rank === 3 ? '#0EA5E9' : '#071A1C');

              return (
                <tr
                  key={id ?? idx}
                  onClick={() => handleAuthorClick(author)}
                  style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                >
                  {/* Ô thứ hạng */}
                  <td className="text-center py-3">
                    <div className="d-flex justify-content-center">
                      <AuthorRankBadge rank={rank} />
                    </div>
                  </td>
                  {/* Ô Avatar tác giả + Tên tác giả với khoảng cách flex 14px */}
                  <td>
                    <div className="d-flex align-items-center" style={{ gap: '14px' }}>
                      <AuthorAvatar name={name} size="sm" bgColor={avatarColor} />
                      <div>
                        <div className="text-main fw-semibold" style={{ fontSize: '0.85rem' }}>
                          {name}
                        </div>
                        {orcid ? (
                          <div className="text-muted-custom" style={{ fontSize: '0.72rem' }}>
                            {orcid}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  {/* Ô nhãn lĩnh vực chính */}
                  <td>
                    {!field || field === "" ? (
                      "—"
                    ) : (
                      <span
                        className="px-2.5 py-1 rounded-pill"
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--bg-chip)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        {field}
                      </span>
                    )}
                  </td>
                  {/* Ô tổng số bài báo */}
                  <td className="text-main" style={{ fontSize: '0.82rem' }}>
                    {formatLocalNumber(articles)}
                  </td>
                  {/* Ô tổng số lượt trích dẫn */}
                  <td style={{ fontSize: '0.82rem', color: 'var(--q1-color)', fontWeight: 600 }}>
                    ↑ {formatLocalNumber(citations)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}
