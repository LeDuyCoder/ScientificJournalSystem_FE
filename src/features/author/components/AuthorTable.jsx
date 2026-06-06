/**
 * @file AuthorTable.jsx
 * @description Vỏ chứa dữ liệu dạng bảng hiển thị danh sách tác giả theo cấu trúc dòng cột.
 * 
 * Các tính năng hiển thị đáp ứng (Responsive):
 * - Màn hình Máy tính/Máy tính bảng (`d-none d-md-block`): Hiển thị bảng HTML đầy đủ thông tin
 *   bao gồm số thứ tự, thông tin cá nhân, cơ quan công tác chính, số bài báo, số trích dẫn và chỉ số H-index.
 * - Màn hình Thiết bị di động (`d-block d-md-none`): Tự động ẩn bảng và hiển thị kết quả tìm kiếm
 *   dưới dạng các thẻ `AuthorCard` xếp chồng giúp giao diện chạm vuốt dễ dàng hơn.
 * - Tự động xử lý trạng thái tải (loading shimmer) và trạng thái truy vấn trống (empty).
 */

import { Table, Row, Col } from 'react-bootstrap';
import AuthorTableRow from './AuthorTableRow';
import AuthorCard from './AuthorCard';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import EmptyState from '../../../shared/components/EmptyState';
import ErrorState from '../../../shared/components/ErrorState';

/**
 * @component AuthorTable
 * @description Component bảng hiển thị danh sách đăng ký tác giả có hỗ trợ responsive.
 * 
 * @param {Object} props
 * @param {Array} props.authors - Mảng các đối tượng tác giả cần hiển thị
 * @param {boolean} [props.loading=false] - Cờ hiển thị hiệu ứng khung xương tải dữ liệu (shimmer)
 * @param {Object|string} props.error - Đối tượng lỗi/thông báo lỗi hiển thị khi gọi API thất bại
 * @param {Function} props.onRetry - Hàm gọi lại xử lý tải lại dữ liệu khi nhấn nút thử lại
 * @param {number} [props.startIndex=1] - Giá trị chỉ số cơ sở phục vụ đánh số thứ tự phân trang
 */
export default function AuthorTable({
  authors = [],
  loading = false,
  error = null,
  onRetry = null,
  startIndex = 1
}) {
  
  // ── XỬ LÝ TRẠNG THÁI LỖI ───────────────────────────────────────────────────
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // ── XỬ LÝ TRẠNG THÁI TRỐNG ─────────────────────────────────────────────────
  if (!loading && authors.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy tác giả phù hợp"
        description="Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc."
        icon="lucide:search-slash"
      />
    );
  }

  return (
    <div>
      {/* ── CHẾ ĐỘ XEM MÁY TÍNH & MÁY TÍNH BẢNG: BẢNG CẤU TRÚC ────────────────── */}
      <div 
        className="d-none d-md-block rounded-3 overflow-hidden border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <Table hover responsive className="m-0 align-middle">
          <thead style={{ backgroundColor: 'var(--bg-section)' }}>
            <tr>
              <th className="text-center text-muted-custom py-3" style={{ fontSize: '0.72rem', width: '60px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
              <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tác giả</th>
              <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tổ chức</th>
              <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Số bài báo</th>
              <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Citations</th>
              <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>H-index</th>
              <th className="text-muted-custom py-3" style={{ fontSize: '0.72rem', width: '100px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {/* Hiệu ứng shimmer trạng thái loading của bảng */}
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="text-center">
                    <LoadingSkeleton width="20px" height="15px" />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <LoadingSkeleton width="32px" height="32px" borderRadius="50%" />
                      <div className="flex-grow-1">
                        <LoadingSkeleton width="120px" height="14px" className="mb-1" />
                        <LoadingSkeleton width="80px" height="10px" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <LoadingSkeleton width="150px" height="14px" />
                  </td>
                  <td>
                    <LoadingSkeleton width="40px" height="14px" />
                  </td>
                  <td>
                    <LoadingSkeleton width="50px" height="14px" />
                  </td>
                  <td>
                    <LoadingSkeleton width="30px" height="14px" />
                  </td>
                  <td>
                    <LoadingSkeleton width="60px" height="14px" />
                  </td>
                </tr>
              ))
            ) : (
              /* Ánh xạ các dòng dữ liệu thực tế */
              authors.filter(Boolean).map((author, idx) => (
                <AuthorTableRow
                  key={author.author_id ?? author.id ?? idx}
                  author={author}
                  index={startIndex + idx}
                />
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* ── CHẾ ĐỘ XEM TRÊN DI ĐỘNG: DANH SÁCH THẺ XẾP CHỒNG ─────────────────── */}
      <div className="d-block d-md-none">
        {/* Khung giữ chỗ loading dạng thẻ trên mobile */}
        {loading ? (
          <Row className="g-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Col xs={12} key={idx}>
                <div className="p-3 border rounded-3 bg-white">
                  <div className="d-flex gap-3 mb-2">
                    <LoadingSkeleton width="48px" height="48px" borderRadius="50%" />
                    <div className="flex-grow-1">
                      <LoadingSkeleton width="60%" height="16px" className="mb-2" />
                      <LoadingSkeleton width="40%" height="12px" />
                    </div>
                  </div>
                  <LoadingSkeleton width="100%" height="40px" />
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          /* Ánh xạ bố cục thẻ thực tế trên mobile */
          <Row className="g-3">
            {authors.filter(Boolean).map((author, idx) => (
              <Col xs={12} key={author.author_id ?? author.id ?? idx}>
                <AuthorCard author={author} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
