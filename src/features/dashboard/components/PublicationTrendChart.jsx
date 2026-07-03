/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\components\PublicationTrendChart.jsx
 */
import { useState } from 'react';
import { Icon } from '@iconify/react';
import '../Dashboard.css';
import ChartRangeDropdown from './ChartRangeDropdown';

/**
 * PublicationTrendChart — line chart xu hướng publication theo năm.
 * Dùng SVG thuần (không cần thư viện nặng như Chart.js / Recharts)
 * để giữ bundle nhỏ. Có thể swap thành Recharts sau này.
 *
 * Props:
 *   analytics  - object trả từ BE: { years: [...], series: [{label, data:[...]}] }
 *   loading
 *   error
 */

const LINE_COLORS = ['var(--primary)', 'var(--text-main)', 'var(--text-muted)', 'var(--border)'];

function SimpleSvgChart({ years, series }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!years?.length || !series?.length) return null;

  const W = 480, H = 160, PAD = { top: 12, right: 16, bottom: 28, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // flatten all values to get global min/max
  const allVals = series.flatMap(s => s.data ?? []).filter(Number.isFinite);
  const minVal = Math.min(0, ...allVals);
  const maxVal = Math.max(1, ...allVals);

  const xScale = (i) => PAD.left + (i / (years.length - 1 || 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - ((v - minVal) / (maxVal - minVal || 1)) * chartH;

  return (
    <div className="position-relative w-100 h-100">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = PAD.top + (1 - t) * chartH;
          return (
            <line key={t} x1={PAD.left} x2={PAD.left + chartW} y1={y} y2={y}
              stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 3" />
          );
        })}

        {/* X axis labels */}
        {years.map((yr, i) => {
          // Calculate dynamic step to avoid label overlaps for long year ranges
          const maxLabels = 8;
          const step = Math.ceil(years.length / maxLabels);
          
          // Always show the first and the last years, and other years at step intervals
          const shouldShow = i === 0 || i === years.length - 1 || i % step === 0;
          
          // Prevent showing label if it is too close to the last year label
          const isTooCloseToLast = i % step === 0 && (years.length - 1 - i) < step * 0.5 && i !== years.length - 1;

          if (!shouldShow || isTooCloseToLast) return null;

          return (
            <text key={yr} x={xScale(i)} y={H - 4} textAnchor="middle"
              style={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
              {yr}
            </text>
          );
        })}

        {/* Series lines */}
        {series.map((s, si) => {
          if (!s.data?.length) return null;
          const color = LINE_COLORS[si % LINE_COLORS.length];
          const pts = s.data.map((v, i) => `${xScale(i)},${yScale(v ?? 0)}`).join(' ');
          const pts0 = `${xScale(0)},${yScale(0)}`;
          const ptsN = `${xScale(s.data.length - 1)},${yScale(0)}`;

          // Hide small dots visually if there are too many data points (to keep the line clean)
          const showDots = years.length <= 25;

          return (
            <g key={si}>
              {/* Area fill */}
              <polygon
                points={`${pts0} ${pts} ${ptsN}`}
                fill={color} fillOpacity={0.08}
              />
              {/* Line */}
              <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
              {/* Dots */}
              {showDots && s.data.map((v, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(v ?? 0)} r={3}
                  fill={color} stroke="var(--bg-card)" strokeWidth={1.5} />
              ))}
              {/* Transparent larger hover targets (always active) */}
              {s.data.map((v, i) => (
                <circle
                  key={`hover-${i}`}
                  cx={xScale(i)}
                  cy={yScale(v ?? 0)}
                  r={12}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPoint({
                    year: years[i],
                    value: v ?? 0,
                    x: xScale(i),
                    y: yScale(v ?? 0)
                  })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>
      {/* Tooltip Overlay */}
      {hoveredPoint && (
        <div
          className="chart-svg-tooltip"
          style={{
            left: `${(hoveredPoint.x / W) * 100}%`,
            top: `${(hoveredPoint.y / H) * 100}%`,
            transform: 'translate(-50%, -100%) translateY(-8px)',
          }}
        >
          <div className="fw-semibold mb-0" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Năm {hoveredPoint.year}</div>
          <div className="fw-bold" style={{ fontSize: '12px', color: 'var(--primary)' }}>{hoveredPoint.value} bài báo</div>
        </div>
      )}
    </div>
  );
}

export default function PublicationTrendChart({ analytics, loading, error, onRetry, selectedRange, onRangeChange }) {
  // Normalise BE response shape
  const years  = analytics?.years  ?? analytics?.year_range  ?? [];
  const series = analytics?.series ?? (analytics?.data ? [{ label: 'Bài báo', data: analytics.data }] : []);

  const legend = series.length > 0 ? (
    <div className="d-flex flex-wrap gap-3 justify-content-end me-3">
      {series.map((s, i) => (
        <div key={i} className="d-flex align-items-center gap-1">
          <div style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: LINE_COLORS[i % LINE_COLORS.length] }} />
          <span className="text-muted-custom" style={{ fontSize: '0.65rem' }}>{s.label ?? `Series ${i + 1}`}</span>
        </div>
      ))}
    </div>
  ) : null;

  const description = (
    <>
      <p className="text-muted-custom mb-3" style={{ fontSize: '0.72rem' }}>
        Số bài báo theo năm trong projects của bạn
      </p>
      <div style={{ minHeight: 160 }}>
        {loading ? (
          <div className="skeleton-shimmer rounded-3 w-100" style={{ height: 160 }} />
        ) : error ? (
          <div className="d-flex flex-column align-items-center justify-content-center gap-2 py-5">
            <Icon icon="lucide:alert-triangle" width={28} style={{ color: '#ef4444' }} />
            <p className="text-muted-custom mb-0" style={{ fontSize: '0.8rem' }}>{error}</p>
            {onRetry && (
              <button className="btn btn-sm btn-outline-primary mt-2" onClick={onRetry}>Thử lại</button>
            )}
          </div>
        ) : years.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center gap-2 py-5">
            <Icon icon="lucide:bar-chart-2" width={36} style={{ color: 'var(--text-muted)' }} />
            <p className="text-main fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
              Chưa có dữ liệu xu hướng publication
            </p>
            <p className="text-muted-custom mb-0" style={{ fontSize: '0.75rem' }}>
              Tạo project đầu tiên để bắt đầu theo dõi.
            </p>
          </div>
        ) : (
          <SimpleSvgChart years={years} series={series} />
        )}
      </div>
    </>
  );

  return (
    <div className="publication-trend-card h-100">
      <div className="ptc-header">
        <div className="ptc-title">
          <Icon icon="lucide:trending-up" width={16} style={{ color: 'var(--primary)' }} />
          <span>Xu hướng Publication</span>
        </div>
        <div className="ptc-actions d-flex align-items-center">
          {legend}
          {onRangeChange && (
            <ChartRangeDropdown
              value={selectedRange}
              onChange={onRangeChange}
            />
          )}
        </div>
      </div>
      <div className="ptc-body">
        {description}
      </div>
    </div>
  );
}
