import React from 'react';
import { Table } from 'react-bootstrap';
import { Icon } from '@iconify/react';

/**
 * Component IssueTable - Bảng hiển thị toàn bộ các Số phát sóng (Issues) nằm trong một Tập (Volume).
 *
 * @param {Array} issues - Danh sách các Issue đã lọc theo Volume đang chọn
 */
export default function IssueTable({ issues }) {
  
  // Trạng thái hiển thị nếu Admin chưa chọn Volume hoặc Volume được chọn chưa có Issue nào
  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-5 glass-card border-dashed">
        <Icon icon="lucide:calendar-dashed" width="40" className="text-muted-custom mb-2" />
        <h6 className="text-main fw-bold">No issues found</h6>
        <p className="text-muted-custom small mb-0">This volume does not have any issues created yet.</p>
      </div>
    );
  }

  // Format month and day to mock details
  const getMockPublishDate = (issue) => {
    if (issue.status === 'Published') {
      const months = ['Mar 02', 'Jun 10', 'Sept 15', 'Nov 12', 'Dec 01'];
      const index = Math.abs(issue.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % months.length;
      return `${months[index]}, ${issue.publicationYear}`;
    }
    return '—';
  };

  const getMockArticleCount = (issue) => {
    if (issue.status === 'Published') {
      const counts = [12, 15, 18, 10, 14];
      const index = Math.abs(issue.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % counts.length;
      return counts[index];
    }
    return '—';
  };

  return (
    <div className="table-responsive rounded-3 border shadow-sm">
      <Table hover className="align-middle mb-0 text-start bg-white">
        <thead className="table-light">
          <tr>
            <th className="py-3 ps-4 text-muted-custom" style={{ width: '240px' }}>Issue Details</th>
            <th className="py-3 text-muted-custom">Date Published</th>
            <th className="py-3 text-muted-custom">Articles</th>
            <th className="py-3 pe-4 text-muted-custom" style={{ width: '120px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const isPublished = issue.status === 'Published';
            return (
              <tr key={issue.id} className="transition-hover">
                {/* Issue Details */}
                <td className="py-3 ps-4">
                  <div className="fw-bold text-main">
                    {issue.issueNumber}: {issue.issueName}
                  </div>
                  <small className="text-muted-custom font-sans">
                    {isPublished ? 'Regular Edition' : 'Scheduled Release'}
                  </small>
                </td>
                
                {/* Date Published */}
                <td className="text-muted-custom font-sans">
                  {getMockPublishDate(issue)}
                </td>

                {/* Articles count */}
                <td className="text-main fw-medium font-monospace">
                  {getMockArticleCount(issue)}
                </td>
                
                {/* Status Badge */}
                <td className="pe-4">
                  <span className={`badge px-2.5 py-1.5 rounded text-uppercase ${
                    isPublished
                      ? 'bg-success-subtle text-success'
                      : 'bg-warning-subtle text-warning'
                  }`}>
                    {issue.status === 'Published' ? 'Published' : 'Draft'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
