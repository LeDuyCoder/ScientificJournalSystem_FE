import { VOLUME_STATUS_STYLE } from '../constants/volumeStatus';

export default function StatusBadge({ status }) {
  // Tra label + className theo status; fallback an toàn nếu status không khớp
  const style = VOLUME_STATUS_STYLE[status] || {
    label: status,
    className: 'status-badge--archived',
  };

  return <span className={`status-badge ${style.className}`}>{style.label}</span>;
}