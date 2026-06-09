/**
 * @file AuthorTableRow.jsx
 * @description Component dòng con của `AuthorTable`.
 * Hiển thị siêu dữ liệu của tác giả bên trong các ô bảng (td).
 * Nhấp vào dòng sẽ điều hướng sang màn hình hồ sơ chi tiết tác giả.
 */

import { useNavigate } from 'react-router-dom';
import AuthorAvatar from './AuthorAvatar';

/**
 * Hiển thị một dòng cụ thể trong bảng danh sách đăng ký tác giả.
 * 
 * @param {Object} props - Thuộc tính truyền vào component.
 * @param {Object} props.author - Bản ghi dữ liệu của tác giả.
 * @param {number} props.index - Số thứ tự dòng hiển thị ở cột đầu tiên.
 * @returns {JSX.Element|null} Giao diện dòng bảng tác giả.
 */
export default function AuthorTableRow({ author, index }) {
  const navigate = useNavigate();

  // Bảo vệ chống tham số trống
  if (!author) return null;

  // Trích xuất các biến an toàn kèm dữ liệu dự phòng phù hợp
  const id = author.author_id ?? author.id;
  const name = author.display_name ?? author.full_name ?? author.name ?? 'Tác giả';
  const orcid = author.orcid ?? '—';
  const institution1 = author.institution_1 ?? author.affiliation ?? author.institution ?? '—';
  const institution2 = author.institution_2 ?? author.department ?? '';
  const avatarUrl = author.url_image || author.avatar_url || '';
  
  // Nối tên phòng ban và tên cơ quan chính nếu có dữ liệu.
  const institutionText = institution2 ? `${institution1} - ${institution2}` : institution1;

  const hIndex = author.h_index ?? '—';
  const citations = author.citation_count ?? author.citations ?? 0;
  const articlesCount = author.article_count ?? author.papers ?? 0;
  const avatarColor = author.avatar_color ?? '#FF7A33';

  /**
   * Định dạng số theo dấu chấm phân cách hàng nghìn kiểu Việt Nam.
   * 
   * @param {number} num - Số cần định dạng.
   * @returns {string} Chuỗi số đã định dạng.
   */
  const formatLocalNumber = (num) => {
    if (num == null || isNaN(num)) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  /**
   * Điều hướng sang màn hình hồ sơ chi tiết tác giả.
   * 
   * @returns {void}
   */
  const handleRowClick = () => {
    if (id) {
      navigate(`/authors/${id}`);
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className="align-middle"
      style={{
        cursor: 'pointer',
        transition: 'background-color 0.15s ease'
      }}
    >
      {/* Cột 1: Chỉ số thứ tự dòng */}
      <td className="text-center fw-semibold text-muted-custom" style={{ fontSize: '0.85rem' }}>
        {index}
      </td>
      {/* Cột 2: Avatar nhỏ & Tên chi tiết kèm thông tin ORCID */}
      <td>
        <div className="d-flex align-items-center gap-2">
          <AuthorAvatar name={name} url={avatarUrl} size="sm" bgColor={avatarColor} />
          <div className="min-w-0">
            <div className="text-main fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>
              {name}
            </div>
            {orcid && orcid !== '—' && (
              <div className="text-muted-custom text-xxs" style={{ fontSize: '0.7rem' }}>
                ORCID: {orcid}
              </div>
            )}
          </div>
        </div>
      </td>
      {/* Cột 3: Văn bản cơ quan công tác (Tự động cắt ngắn nếu quá dài) */}
      <td className="text-truncate" style={{ fontSize: '0.82rem', maxWidth: '220px' }}>
        {institutionText}
      </td>
      {/* Cột 4: Tổng số bài báo */}
      <td style={{ fontSize: '0.82rem' }}>
        {formatLocalNumber(articlesCount)}
      </td>
      {/* Cột 5: Tổng số lượt trích dẫn */}
      <td style={{ fontSize: '0.82rem' }}>
        {formatLocalNumber(citations)}
      </td>
      {/* Cột 6: Chỉ số H-index */}
      <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>
        {hIndex}
      </td>
      {/* Cột 7: Đường dẫn xem chi tiết */}
      <td>
        <span 
          className="text-primary hover:underline fw-semibold" 
          style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
        >
          Chi tiết →
        </span>
      </td>
    </tr>
  );
}
