/**
 * - Hiển thị bảng "Volume & Issue Status" ở cuối Admin Dashboard,
 *   gồm cột Volume, Total Issues, Publication Date, Status, Progress, Actions.
 * - Có nút "Export CSV" để xuất dữ liệu hiện tại ra file CSV (FE-only,
 *   xem utils/exportCsv.js).
 */
import { useNavigate } from 'react-router-dom';
import Icon from '../../../../shared/components/Icon';
import StatusBadge from '../StatusBadge';
import AdminProgressBar from '../AdminProgressBar';
import { exportVolumeStatusToCsv } from '../../utils/exportCsv';

export default function VolumeIssueTable({ items }) {
  const navigate = useNavigate();
  const isPreview = window.location.pathname.startsWith('/admin-preview');
  const basePath = isPreview ? '/admin-preview' : '/admin';

  const handleExportCsv = () => {
    exportVolumeStatusToCsv(items);
  };

  const handleOpenRepository = () => {
    navigate(`${basePath}/journals/repository`);
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
              <tr
                key={item.id}
                className="admin-clickable-row"
                onClick={handleOpenRepository}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleOpenRepository();
                  }
                }}
              >
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
                  <button
                    type="button"
                    className="admin-table__icon-btn"
                    aria-label="Open volume repository"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenRepository();
                    }}
                  >
                    <Icon icon="lucide:arrow-up-right" />
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