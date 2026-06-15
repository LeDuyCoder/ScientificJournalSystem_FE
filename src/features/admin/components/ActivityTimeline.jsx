/**
 * Mau cham tron theo "type" duoc dinh nghia o
 * constants/activityType.js (dung chung voi AllActivityModal):
 * - 'published' -> cam (--primary)       : su kien chinh, tich cuc
 * - 'revision'  -> xanh duong nhat       : cap nhat thong thuong
 * - 'reviewer'  -> xam (--text-muted)    : hoat dong phu, thong tin
 * - 'overdue'   -> do canh bao           : can xu ly gap
 */
import { ACTIVITY_DOT_COLOR } from '../constants/activityType';

export default function ActivityTimeline({ items, onViewAll }) {
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

      {/* "View All Activity" - mo AllActivityModal, handler tu page cha */}
      <button type="button" className="admin-activity-card__view-all" onClick={onViewAll}>
        View All Activity
      </button>
    </div>
  );
}