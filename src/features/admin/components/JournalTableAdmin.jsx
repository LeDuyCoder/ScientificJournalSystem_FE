import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

/**
 * Component JournalTableAdmin - Bảng hiển thị danh sách tạp chí phục vụ mục đích quản trị (Admin View).
 * Đáp ứng Issue #76: Hiển thị Title, ISSN, Publisher, Editor-in-Chief, Last Updated, Status và các nút Action.
 *
 * @param {Array} journals - Danh sách tạp chí sau khi đã qua bộ lọc search/status
 * @param {number} page - Trang hiện tại (phục vụ tính toán số thứ tự tăng tiến)
 * @param {number} limit - Số lượng dòng trên một trang
 */
export default function JournalTableAdmin({ journals, page = 1, limit = 10 }) {
  const navigate = useNavigate();

  // Trạng thái trống nếu không tìm thấy dữ liệu phù hợp với bộ lọc
  if (!journals || journals.length === 0) {
    return (
      <div className="journal-empty-state text-center py-5 glass-card">
        <Icon icon="lucide:search-x" width="48" className="text-muted-custom mb-3" />
        <h5 className="journal-empty-title fw-bold font-display text-main">Không tìm thấy tạp chí nào</h5>
        <p className="text-muted-custom small mb-0">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái của bạn.</p>
      </div>
    );
  }

  // Dynamic route base path detection
  const isPreview = window.location.pathname.startsWith('/admin-preview');
  const basePath = isPreview ? '/admin-preview' : '/admin';

  return (
    <div className="journal-table-shell table-responsive shadow-sm rounded-3 overflow-hidden">
      <Table hover className="journal-table align-middle mb-0 text-start bg-white">
        <thead className="table-light">
          <tr>
            <th className="py-3.5 ps-4 text-muted-custom">JOURNAL TITLE & CATEGORY</th>
            <th className="py-3.5 text-muted-custom">ISSN</th>
            <th className="py-3.5 text-muted-custom">EDITOR-IN-CHIEF</th>
            <th className="py-3.5 text-muted-custom">LAST UPDATED</th>
            <th className="py-3.5 text-muted-custom">STATUS</th>
            <th className="py-3.5 pe-4 text-end text-muted-custom" style={{ width: '120px' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {journals.map((journal) => {
            const id = journal.id || journal.journal_id;
            // Avatar fallback for different mock editors
            const mockAvatars = [
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
              "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100"
            ];
            const charSum = journal.editorInChief ? journal.editorInChief.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : 0;
            const avatarUrl = mockAvatars[charSum % mockAvatars.length];

            return (
              <tr
                key={id}
                className="journal-table-row transition-hover admin-clickable-row"
                onClick={() => navigate(`${basePath}/journals/repository`)}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`${basePath}/journals/repository`);
                  }
                }}
              >
                {/* Tên tạp chí và danh mục */}
                <td className="py-3 ps-4">
                  <button
                    type="button"
                    className="admin-link-button fw-bold text-main line-clamp-1 p-0 text-start"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`${basePath}/journals/repository`);
                    }}
                  >
                    {journal.title || journal.display_name}
                  </button>
                  <div className="text-muted-custom small mt-0.5">
                    {journal.subjectCategory || 'General Category'} • Quarterly
                  </div>
                </td>

                {/* Mã số định danh ISSN */}
                <td className="font-monospace small text-main">
                  {journal.issn || '—'}
                </td>

                {/* Editor-in-Chief (avatar + name) */}
                <td className="py-3">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={avatarUrl}
                      alt={journal.editorInChief || 'Editor'}
                      className="rounded-circle"
                      style={{ width: '32px', height: '32px', objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                    <span className="text-main fw-semibold">{journal.editorInChief || 'Chưa chỉ định'}</span>
                  </div>
                </td>

                {/* Ngày cập nhật gần nhất */}
                <td className="text-muted-custom small font-monospace">
                  {journal.lastUpdated || '—'}
                </td>

                {/* Badge trạng thái hoạt động */}
                <td>
                  <span className={`badge px-2.5 py-1.5 rounded-pill text-uppercase text-xs font-semibold ${
                    journal.status === 'Active' || journal.status === 'Published'
                      ? 'admin-status-badge admin-status-badge--accent' 
                      : journal.status === 'Under Review' || journal.status === 'Draft'
                        ? 'admin-status-badge admin-status-badge--warning'
                        : 'admin-status-badge admin-status-badge--muted'
                  }`}>
                    {journal.status || 'Draft'}
                  </span>
                </td>

                {/* Các nút bấm thao tác */}
                <td className="pe-4 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    {/* Nút vào quản lý kho cấu trúc Volume và Issue */}
                    <Button 
                      variant="light" 
                      size="sm"
                      className="btn-custom-sm d-inline-flex align-items-center justify-content-center p-2 rounded-2 border"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`${basePath}/journals/repository`);
                      }}
                      title="Quản lý Repo Volume & Issue"
                    >
                      <Icon icon="lucide:eye" width="16" className="text-dark" />
                    </Button>
                    
                    {/* Nút vào form chỉnh sửa chi tiết cấu hình Journal */}
                    <Button 
                      variant="outline-dark" 
                      size="sm"
                      className="btn-custom-sm d-inline-flex align-items-center justify-content-center p-2 rounded-2"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`${basePath}/journals/${id}/edit`);
                      }}
                      title="Chỉnh sửa thông tin Tạp chí"
                    >
                      <Icon icon="lucide:edit-2" width="16" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
