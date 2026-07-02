/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\components\Card\HeaderFilterCard\HeaderFilterCard.jsx
 */
import './HeaderFilterCard.css';

/**
 * Shared header/filter card for data pages that need a title, count badge,
 * and right-side filter/search controls.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Toolbar title, e.g. "All Contributors"
 * @param {number|string} [props.count] - Optional total count shown in the badge
 * @param {string} [props.singularLabel='Item'] - Label when count equals 1
 * @param {string} [props.pluralLabel='Items'] - Label when count is not 1
 * @param {React.ReactNode} props.children - Filter/search/action controls
 * @param {string} [props.className] - Additional wrapper classes
 * @returns {JSX.Element}
 */
export default function HeaderFilterCard({
  title,
  count,
  singularLabel = 'Item',
  pluralLabel = 'Items',
  children,
  className = '',
}) {
  const hasCount = count !== undefined && count !== null;
  const normalizedCount = Number(count);
  const label = normalizedCount === 1 ? singularLabel : pluralLabel;

  return (
    <div className={`header-filter-card ${className}`.trim()}>
      <div className="header-filter-card__summary">
        <span className="header-filter-card__title">{title}</span>
        {hasCount && (
          <span className="header-filter-card__count">
            {count} {label}
          </span>
        )}
      </div>

      {children && <div className="header-filter-card__controls">{children}</div>}
    </div>
  );
}
