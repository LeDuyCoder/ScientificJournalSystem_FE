/**
 * - Hiển thị bảng "Volume & Issue Status" ở cuối Admin Dashboard,
 *   gồm cột Volume, Total Issues, Publication Date, Status, Progress, Actions.
 * - Có nút "Export CSV" để xuất dữ liệu hiện tại ra file CSV (FE-only,
 *   xem utils/exportCsv.js).
 */
import Icon from '../../../shared/components/Icon';
import StatusBadge from './StatusBadge';
import AdminProgressBar from './AdminProgressBar';
import { exportVolumeStatusToCsv } from '../utils/exportCsv';

export default function VolumeIssueTable({ items }) {
  // Xử lý click Export CSV - xuất toàn bộ "items" hiện có ra file CSV
  const handleExportCsv = () => {
    exportVolumeStatusToCsv(items);
  };

  return (
    <div className="admin-card admin-volume-card">
      {/* Header card: tiêu đề bên trái, nút Export CSV bên phải */}
      <div className="admin-volume-card__header">
        <h3 className="admin-card__title">Volume &amp; Issue Status</h3>
        <button type="button" className="admin-export-btn" onClick={handleExportCsv}>
          <Icon icon="lucide:download" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Bảng dữ liệu - wrap trong div để xử lý overflow ngang trên màn nhỏ */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Volume</th>
              <th>Total Issues</th>
              <th>Publication Date</th>
              <th>Status</th>
              <th>Progress</th>
              <th className="admin-table__actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="admin-table__cell-strong">{item.volume}</td>
                <td>{item.totalIssues}</td>
                <td>{item.publicationDate}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>
                  <AdminProgressBar percentage={item.progress} />
                </td>
                <td className="admin-table__actions-col">
                  {/* Action chỉ UI ở bước này - chưa gắn điều hướng/edit thật */}
                  <button type="button" className="admin-table__icon-btn" aria-label="Edit volume">
                    <Icon icon="lucide:pencil" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}