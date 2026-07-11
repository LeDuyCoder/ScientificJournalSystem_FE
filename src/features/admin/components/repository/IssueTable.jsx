import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { Table } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { StateCard } from '../../../../shared/components/Card';
const getIssueId = issue => issue.issue_id || issue.id;
const getIssueNumber = issue => issue.issue_number ?? issue.issueNumber ?? '—';
const getIssueYear = issue => issue.publication_year || issue.publicationYear;
const getIssueStatus = issue => issue.is_deleted ? 'Deleted' : issue.status || 'Active';

/**
 * Component IssueTable - Bảng hiển thị các Issue được query theo volume_id.
 * Article count dùng dữ liệu Article đã query theo issue_id ở parent/hook, không dùng mock.
 *
 * @param {Array} issues - Danh sách Issue của Volume đang chọn
 * @param {Object} articleCountsByIssueId - Map số Article theo issue_id
 */
export default function IssueTable({
  issues,
  articleCountsByIssueId = {}
}) {
  const { t: _t } = useTranslation();
  if (!issues || issues.length === 0) {
    return <StateCard variant="neutral" icon="lucide:calendar-dashed" title="No issues found" description="This volume does not have any issues created yet." className="my-4 border-dashed" />;
  }
  return <div className="table-responsive rounded-3 border shadow-sm">
      <Table hover className="align-middle mb-0 text-start bg-white">
        <thead className="table-light">
          <tr>
            <th className="py-3 ps-4 text-muted-custom" style={{
            width: '240px'
          }}>Issue Details</th>
            <th className="py-3 text-muted-custom">Publication Year</th>
            <th className="py-3 text-muted-custom">Articles</th>
            <th className="py-3 pe-4 text-muted-custom" style={{
            width: '120px'
          }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => {
          const issueId = getIssueId(issue);
          const issueStatus = getIssueStatus(issue);
          const isPublished = issueStatus === 'Published' || issueStatus === 'Active';
          const articleCount = articleCountsByIssueId[issueId];
          return <tr key={issueId} className="transition-hover">
                <td className="py-3 ps-4">
                  <div className="fw-bold text-main font-monospace">
                    {getIssueNumber(issue)}
                  </div>
                  <small className="text-muted-custom font-display">
                    issue_number
                  </small>
                </td>

                <td className="text-muted-custom font-display small">
                  {getIssueYear(issue) || '—'}
                </td>

                <td className="text-main fw-medium font-monospace">
                  {typeof articleCount === 'number' ? articleCount : t("admin.chuaCoApiArticleTheoIssueidDaX")}
                </td>

                <td className="pe-4">
                  <span className={`badge px-2.5 py-1.5 rounded text-uppercase ${isPublished ? 'admin-status-badge admin-status-badge--accent' : issueStatus === 'Deleted' ? 'admin-status-badge admin-status-badge--muted' : 'admin-status-badge admin-status-badge--warning'}`}>
                    {issueStatus}
                  </span>
                </td>
              </tr>;
        })}
        </tbody>
      </Table>
    </div>;
}