/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\components\Card\EntityCard.jsx
 */
import './EntityCard.css';

/**
 * Shared card for entity summaries such as authors, journals, articles, or projects.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.title - Main entity title
 * @param {React.ReactNode} [props.subtitle] - Secondary line below title
 * @param {React.ReactNode} [props.description] - Description/body text
 * @param {React.ReactNode} [props.media] - Leading media/avatar/icon slot
 * @param {React.ReactNode} [props.meta] - Metadata row or badges
 * @param {React.ReactNode} [props.actions] - Top-right action controls
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {function} [props.onClick] - Optional click handler
 * @param {string} [props.className] - Additional wrapper classes
 * @returns {JSX.Element}
 */
export default function EntityCard({
  title,
  subtitle,
  description,
  media,
  meta,
  actions,
  footer,
  onClick,
  className = '',
  bodyClassName = '',
  contentClassName = '',
}) {
  const Tag = onClick ? 'button' : 'article';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`shared-entity-card ${onClick ? 'shared-entity-card--interactive' : ''} ${className}`.trim()}
    >
      <div className={`shared-entity-card__body ${bodyClassName}`.trim()}>
        {media && <div className="shared-entity-card__media">{media}</div>}

        <div className={`shared-entity-card__content ${contentClassName}`.trim()}>
          <div className="shared-entity-card__header">
            <div className="shared-entity-card__title-group">
              <h3 className="shared-entity-card__title" title={typeof title === 'string' ? title : undefined}>{title}</h3>
              {subtitle && <p className="shared-entity-card__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="shared-entity-card__actions">{actions}</div>}
          </div>

          {description && <div className="shared-entity-card__description">{description}</div>}
          {meta && <div className="shared-entity-card__meta">{meta}</div>}
        </div>
      </div>

      {footer && <div className="shared-entity-card__footer">{footer}</div>}
    </Tag>
  );
}
