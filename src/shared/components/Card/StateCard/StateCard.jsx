/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\components\Card\StateCard.jsx
 */
import Icon from '../../Icon';
import './StateCard.css';

/**
 * Shared state card for empty, error, loading, and informational states.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - State title
 * @param {React.ReactNode} [props.description] - State description
 * @param {string} [props.icon] - Optional Iconify icon name
 * @param {'neutral'|'info'|'warning'|'error'} [props.variant='neutral'] - Visual variant
 * @param {React.ReactNode} [props.actions] - Optional action buttons/links
 * @param {string} [props.className] - Additional wrapper classes
 * @returns {JSX.Element}
 */
export default function StateCard({
  title,
  description,
  icon,
  variant = 'neutral',
  actions,
  className = '',
}) {
  return (
    <section className={`shared-state-card shared-state-card--${variant} ${className}`.trim()}>
      {icon && (
        <span className="shared-state-card__icon" aria-hidden="true">
          <Icon icon={icon} width="24" />
        </span>
      )}

      <h2 className="shared-state-card__title">{title}</h2>
      {description && <p className="shared-state-card__description">{description}</p>}
      {actions && <div className="shared-state-card__actions">{actions}</div>}
    </section>
  );
}
