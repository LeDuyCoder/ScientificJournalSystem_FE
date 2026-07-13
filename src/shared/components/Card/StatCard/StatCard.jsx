import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\components\Card\StatCard\StatCard.jsx
 */
import Icon from '../../Icon';
import { formatCount, formatGrowth } from '../../../utils/formatNumber';
import './StatCard.css';

/**
 * Shared compact card for metric/statistic summaries.
 * Supports dashboard-style loading and growth indicators.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Metric label
 * @param {React.ReactNode} props.value - Main metric value
 * @param {string} [props.icon] - Optional Iconify icon name
 * @param {string} [props.accentColor='var(--primary)'] - Accent CSS color/token
 * @param {React.ReactNode} [props.description] - Optional supporting text
 * @param {React.ReactNode} [props.trend] - Optional custom trend/status content
 * @param {number} [props.growth] - Numeric delta for trend indicator
 * @param {string} [props.growthLabel='tuần này'] - Growth period label
 * @param {boolean} [props.loading=false] - Shows skeleton state
 * @param {boolean} [props.formatValue=true] - Format numeric value with shared formatter
 * @param {function} [props.onClick] - Optional click handler
 * @param {string} [props.className] - Additional wrapper classes
 * @returns {JSX.Element}
 */
export default function StatCard({
  label,
  value,
  icon,
  accentColor = 'var(--primary)',
  description,
  trend,
  growth,
  growthLabel,
  loading = false,
  formatValue = true,
  onClick,
  className = ''
}) {
  const {
    t
  } = useTranslation();
  const growthLabelText = growthLabel || t("common.tuanNay");
  const Tag = onClick ? 'button' : 'article';
  const isPositive = growth > 0;
  const isNeutral = growth === 0 || growth == null;
  const renderedValue = formatValue && typeof value === 'number' ? formatCount(value) : value;
  const renderedTrend = trend ?? (growth !== undefined ? <span className={`shared-stat-card__growth ${isNeutral ? 'is-neutral' : isPositive ? 'is-positive' : 'is-negative'}`}>
      <Icon icon={isNeutral ? 'lucide:minus' : isPositive ? 'lucide:trending-up' : 'lucide:trending-down'} width="12" />
      <span>{isNeutral ? t("common.khongDoi") : `${formatGrowth(growth)} ${growthLabelText}`}</span>
    </span> : null);
  return <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={`shared-stat-card ${onClick ? 'shared-stat-card--interactive' : ''} ${className}`.trim()} style={{
    '--stat-card-accent': accentColor
  }}>
      {loading ? <div className="shared-stat-card__skeleton" aria-label="Đang tải thống kê">
          <div className="skeleton-shimmer shared-stat-card__skeleton-icon" />
          <div className="skeleton-shimmer shared-stat-card__skeleton-value" />
          <div className="skeleton-shimmer shared-stat-card__skeleton-label" />
          <div className="skeleton-shimmer shared-stat-card__skeleton-trend" />
        </div> : <>
          <div className="shared-stat-card__header">
            <span className="shared-stat-card__label">{label}</span>
            {icon && <span className="shared-stat-card__icon" aria-hidden="true">
                <Icon icon={icon} width="16" />
              </span>}
          </div>

          <div className="shared-stat-card__value">{renderedValue}</div>

          {(description || renderedTrend) && <div className="shared-stat-card__footer">
              {description && <span className="shared-stat-card__description">{description}</span>}
              {renderedTrend && <span className="shared-stat-card__trend">{renderedTrend}</span>}
            </div>}
        </>}
    </Tag>;
}