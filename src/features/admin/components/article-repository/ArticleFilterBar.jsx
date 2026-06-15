/**
 * - journal / status / submittedDate: giá trị filter hiện tại.
 * - onChangeJournal / onChangeStatus / onChangeSubmittedDate: handler cập nhật.
 * - onApply: handler nút "Apply Search Filters".
 * - onClear: handler link "Clear all" (reset cả draft và applied filters).
 */
import { JOURNAL_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../../constants/articleListFilters';

export default function ArticleFilterBar({
  journal,
  status,
  submittedDate,
  onChangeJournal,
  onChangeStatus,
  onChangeSubmittedDate,
  onApply,
  onClear,
}) {
  return (
    <div className="admin-card admin-filter-bar">
      {/* Label nhỏ phía trên - giống "REPOSITORY FILTERS" trong Figma */}
      <div className="admin-filter-bar__label">
        <span>Repository Filters</span>
        {/* "Clear all" - reset cả draft filter và applied filter (page cha xử lý) */}
        <button type="button" className="admin-filter-bar__clear" onClick={onClear}>
          Clear all
        </button>
      </div>

      {/* Hàng filter: Journal - Status - Date - Apply button */}
      <div className="admin-filter-bar__row">
        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="filter-journal">
            Journal
          </label>
          <select
            id="filter-journal"
            className="admin-form-input admin-form-select"
            value={journal}
            onChange={(e) => onChangeJournal(e.target.value)}
          >
            {JOURNAL_FILTER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="filter-status">
            Submission Status
          </label>
          <select
            id="filter-status"
            className="admin-form-input admin-form-select"
            value={status}
            onChange={(e) => onChangeStatus(e.target.value)}
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="filter-date">
            Submission Date
          </label>
          <input
            id="filter-date"
            type="date"
            className="admin-form-input"
            value={submittedDate}
            onChange={(e) => onChangeSubmittedDate(e.target.value)}
          />
        </div>

        {/* Nút Apply - căn theo chiều cao input, không cần label phía trên */}
        <div className="admin-form-group admin-filter-bar__apply-group">
          <button type="button" className="btn-primary-glow admin-btn-consistent" onClick={onApply}>
            Apply Search Filters
          </button>
        </div>
      </div>
    </div>
  );
}