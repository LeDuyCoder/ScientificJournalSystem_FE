/**
 * - currentPage:  trang hiện tại (1-indexed).
 * - totalPages:   tổng số trang.
 * - onPageChange: handler khi click 1 số trang / Previous / Next.
 */
import Icon from '../../../../shared/components/Icon';

// Tính danh sách item hiển thị: số trang (number) hoặc dấu "..." (string 'ellipsis-left'/'ellipsis-right')
function buildPageItems(currentPage, totalPages) {
  const items = [];

  for (let page = 1; page <= totalPages; page += 1) {
    const isEdge = page === 1 || page === totalPages;
    const isNearCurrent = Math.abs(page - currentPage) <= 1;

    if (isEdge || isNearCurrent) {
      items.push(page);
    } else if (items[items.length - 1] !== 'ellipsis') {
      // Chỉ thêm 1 dấu "..." liên tiếp, tránh "... ..."
      items.push('ellipsis');
    }
  }

  return items;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Không cần hiển thị pagination nếu chỉ có 1 trang hoặc ít hơn
  if (totalPages <= 1) return null;

  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <nav className="admin-pagination" aria-label="Pagination">
      {/* Nút Previous - disable ở trang đầu */}
      <button
        type="button"
        className="admin-pagination__btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <Icon icon="lucide:chevron-left" />
      </button>

      {/* Các số trang / dấu "..." */}
      {pageItems.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="admin-pagination__ellipsis">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`admin-pagination__btn${item === currentPage ? ' admin-pagination__btn--active' : ''}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      {/* Nút Next - disable ở trang cuối */}
      <button
        type="button"
        className="admin-pagination__btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <Icon icon="lucide:chevron-right" />
      </button>
    </nav>
  );
}