import PaginationControls from './PaginationControls';
import './Pagination.css';
import { useTranslation } from 'react-i18next';

/**
 * Reusable Pagination Component for data lists.
 * Uses the admin pagination visual standard while keeping summary text consistent.
 *
 * @param {number} totalItems - Total count of items
 * @param {number} currentPage - Active page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {function} onPageChange - Callback when page changes
 * @param {string} entityName - Singular/plural name for display (default: 'items')
 */
export default function Pagination({
  totalItems,
  currentPage,
  limit,
  onPageChange,
  entityName = 'items'
}) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(totalItems, currentPage * limit);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="admin-pagination-bar">
      <div className="text-muted-custom small">
        {t('pagination.showing', 'Showing')} <span className="fw-semibold text-main">{startItem}</span> {t('pagination.to', 'to')}{' '}
        <span className="fw-semibold text-main">{endItem}</span> {t('pagination.of', 'of')}{' '}
        <span className="fw-semibold text-main">{totalItems}</span> {entityName}
      </div>

      <div className="admin-pagination-bar__center">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      {/* Placeholder to balance the 3-column grid layout and center the pagination */}
      <div className="admin-pagination-bar__right-placeholder" />
    </div>
  );
}
