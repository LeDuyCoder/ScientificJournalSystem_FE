import React from 'react';
import { Pagination as BSPagination, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';

/**
 * Reusable Pagination Component for Admin features
 *
 * @param {number} totalItems - Total count of items
 * @param {number} currentPage - Active page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {function} onPageChange - Callback when page changes
 * @param {function} onLimitChange - Callback when limit changes (optional)
 * @param {string} entityName - Singular/plural name for display (default: 'items')
 */
export default function Pagination({
  totalItems,
  currentPage,
  limit,
  onPageChange,
  onLimitChange,
  entityName = 'journals'
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(totalItems, currentPage * limit);

  // Generate pagination items
  const renderPageItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <BSPagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </BSPagination.Item>
        );
      }
    } else {
      // Always show page 1
      items.push(
        <BSPagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => onPageChange(1)}
        >
          1
        </BSPagination.Item>
      );

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 3;
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 2;
      }

      if (start > 2) {
        items.push(<BSPagination.Ellipsis key="ell-start" disabled />);
      }

      for (let number = start; number <= end; number++) {
        items.push(
          <BSPagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </BSPagination.Item>
        );
      }

      if (end < totalPages - 1) {
        items.push(<BSPagination.Ellipsis key="ell-end" disabled />);
      }

      // Always show last page
      items.push(
        <BSPagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </BSPagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 px-4 py-3 bg-white border-top rounded-bottom-3" style={{ borderColor: 'var(--border)' }}>
      {/* Information text */}
      <div className="text-muted-custom small">
        Showing <span className="fw-semibold text-main">{startItem}</span> to{' '}
        <span className="fw-semibold text-main">{endItem}</span> of{' '}
        <span className="fw-semibold text-main">{totalItems}</span> {entityName}
      </div>

      {/* Controls */}
      <div className="d-flex align-items-center gap-4 flex-wrap">
        {/* Limit changer */}
        {onLimitChange && (
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted-custom small text-nowrap">Rows per page:</span>
            <Form.Select
              size="sm"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              style={{
                width: '75px',
                backgroundColor: 'var(--bg-chip)',
                borderColor: 'var(--border)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Form.Select>
          </div>
        )}

        {/* Page Buttons */}
        <BSPagination className="mb-0 custom-pagination gap-1">
          <BSPagination.Prev
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <Icon icon="lucide:chevron-left" />
          </BSPagination.Prev>
          {renderPageItems()}
          <BSPagination.Next
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <Icon icon="lucide:chevron-right" />
          </BSPagination.Next>
        </BSPagination>
      </div>
    </div>
  );
}
