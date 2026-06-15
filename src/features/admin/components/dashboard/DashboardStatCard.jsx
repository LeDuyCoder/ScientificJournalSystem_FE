import Icon from '../../../../shared/components/Icon';

// Map noteType -> CSS variable màu chữ, tránh if/else lặp trong JSX
const NOTE_COLOR_MAP = {
  positive: 'var(--q1-color)',
  negative: 'var(--primary)',
  neutral: 'var(--text-muted)',
};

export default function DashboardStatCard({ label, value, icon, note, noteType }) {
  // Lấy màu note theo noteType, fallback về text-muted nếu không khớp
  const noteColor = NOTE_COLOR_MAP[noteType] || NOTE_COLOR_MAP.neutral;

  return (
    <div className="admin-stat-card">
      {/* Header card: label bên trái, icon bên phải */}
      <div className="admin-stat-card__header">
        <span className="admin-stat-card__label">{label}</span>
        <span className="admin-stat-card__icon">
          <Icon icon={icon} />
        </span>
      </div>

      {/* Giá trị chính - số lớn */}
      <div className="admin-stat-card__value">{value}</div>

      {/* Dòng chú thích nhỏ - màu thay đổi theo noteType */}
      <div className="admin-stat-card__note" style={{ color: noteColor }}>
        {note}
      </div>
    </div>
  );
}