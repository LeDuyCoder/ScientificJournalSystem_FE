/**
 * Mỗi item có "type" quyết định màu chấm tròn:
 * - 'published' -> cam (--primary)       : sự kiện chính, tích cực
 * - 'revision'  -> xanh dương nhạt       : cập nhật thông thường
 * - 'reviewer'  -> xám (--text-muted)    : hoạt động phụ, thông tin
 * - 'overdue'   -> đỏ cảnh báo           : cần xử lý gấp
 */

// Map type -> màu chấm tròn. Các màu không có trong design tokens
// (xanh dương, đỏ cảnh báo) được khai báo riêng vì chỉ dùng cho mục
// đích phân loại trạng thái timeline, tương tự cách admin-header
// dùng màu đỏ riêng cho notification badge.
const ACTIVITY_DOT_COLOR = {
  published: 'var(--primary)',
  revision: '#3b82f6',
  reviewer: 'var(--text-muted)',
  overdue: '#e63946',
};

export default function ActivityTimeline({ items }) {
  return (
    <div className="admin-card admin-activity-card">
      <h3 className="admin-card__title mb-3">Recent Activity</h3>

      <ul className="admin-activity-list">
        {items.map((item) => {
          const dotColor = ACTIVITY_DOT_COLOR[item.type] || ACTIVITY_DOT_COLOR.reviewer;

          return (
            <li key={item.id} className="admin-activity-item">
              {/* Chấm tròn màu theo type - màu set inline qua biến CSS */}
              <span
                className="admin-activity-item__dot"
                style={{ backgroundColor: dotColor }}
              />

              <div className="admin-activity-item__content">
                <p className="admin-activity-item__title">{item.title}</p>
                <p className="admin-activity-item__description">{item.description}</p>
                <span className="admin-activity-item__time">{item.time}</span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Link xem toàn bộ hoạt động - chỉ UI, chưa gắn điều hướng thật */}
      <a href="#all-activity" className="admin-activity-card__view-all">
        View All Activity
      </a>
    </div>
  );
}