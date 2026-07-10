import { useTranslation } from "react-i18next";
import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
function SimpleSvgBarChart({
  data,
  labelKey = 'name',
  valueKey = 'article_count',
  color = 'var(--primary)',
  emptyMessage
}) {
  const {
    t
  } = useTranslation();
  const resolvedEmptyMessage = emptyMessage || t("topic.khongCoDuLieu");
  if (!data || data.length === 0) {
    return <div className="d-flex flex-column align-items-center justify-content-center gap-2 py-5 h-100">
        <Icon icon="lucide:bar-chart-2" width={36} style={{
        color: 'var(--text-muted)'
      }} />
        <p className="text-muted-custom mb-0" style={{
        fontSize: '0.85rem'
      }}>{resolvedEmptyMessage}</p>
      </div>;
  }
  const W = 600,
    H = 240,
    PAD = {
      top: 20,
      right: 20,
      bottom: 60,
      left: 60
    };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.map(d => Number(d[valueKey]) || 0));
  const scaleY = maxVal === 0 ? 1 : chartH / maxVal;
  const barWidth = Math.max(10, Math.min(40, chartW / data.length - 10));
  const spacing = (chartW - barWidth * data.length) / (data.length || 1);
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{
    overflow: 'visible'
  }}>
      {/* Grid lines & Y-Axis labels */}
      {[0.25, 0.5, 0.75, 1].map(tick => {
      const y = PAD.top + chartH * (1 - tick);
      return <g key={tick}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--border)" strokeWidth={1} strokeDasharray="4,4" />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="var(--text-muted)" fontSize={11} style={{
          fontFamily: 'var(--font-display)'
        }}>
              {Math.round(maxVal * tick).toLocaleString()}
            </text>
          </g>;
    })}

      {/* Bars */}
      {data.map((item, i) => {
      const val = Number(item[valueKey]) || 0;
      const barH = val * scaleY;
      const x = PAD.left + spacing / 2 + i * (barWidth + spacing);
      const y = PAD.top + chartH - barH;

      // Truncate label
      let label = item[labelKey] || '';
      if (label.length > 12) label = label.substring(0, 10) + '...';
      return <g key={i}>
            <rect x={x} y={y} width={barWidth} height={Math.max(barH, 2)} fill={color} rx={4} ry={4} className="transition-all duration-300 hover:opacity-80" style={{
          cursor: 'pointer'
        }}>
              <title>{item[labelKey]}: {val.toLocaleString()}{t("author.baiBao")}</title>
            </rect>
            {/* Label below bar, rotated */}
            <text x={x + barWidth / 2} y={PAD.top + chartH + 16} textAnchor="end" transform={`rotate(-45, ${x + barWidth / 2}, ${PAD.top + chartH + 16})`} style={{
          fontSize: 10,
          fill: 'var(--text-main)',
          fontFamily: 'var(--font-display)',
          fontWeight: 500
        }}>
              {label}
            </text>
          </g>;
    })}
    </svg>;
}
export default function GeographyChart({
  countryStats = [],
  regions = [],
  selectedCountry = null,
  loading = false
}) {
  const {
    t
  } = useTranslation();
  // Determine mode: if a country is selected and has regions, show region chart.
  // Otherwise, show top countries chart.
  const isRegionMode = selectedCountry !== null;
  const chartData = useMemo(() => {
    if (isRegionMode) {
      // Sort regions by article_count desc and take top 10
      return [...regions].sort((a, b) => (Number(b.article_count) || 0) - (Number(a.article_count) || 0)).slice(0, 15);
    } else {
      // Top 15 countries
      return [...countryStats].sort((a, b) => (Number(b.article_count) || 0) - (Number(a.article_count) || 0)).slice(0, 15);
    }
  }, [countryStats, regions, isRegionMode]);
  const title = isRegionMode ? `Top Khu vực tại ${selectedCountry?.name}` : t("zone.top15QuocGiaNhieuBaiBaoNhat");
  const color = isRegionMode ? '#6366f1' : 'var(--primary)';
  return <div className="p-4 journal-dark-card d-flex flex-column" style={{
    minHeight: '380px'
  }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Icon icon={isRegionMode ? "lucide:map-pin" : "lucide:bar-chart-2"} width={18} style={{
            color
          }} />
            <h3 className="font-display fw-bold text-main mb-0" style={{
            fontSize: '1.1rem'
          }}>
              {title}
            </h3>
          </div>
          <p className="text-muted-custom mb-0" style={{
          fontSize: '0.8rem'
        }}>{t("zone.bieuDoTrucQuanHoaSanLuongBaiBa")}</p>
        </div>
      </div>

      <div className="flex-grow-1 position-relative">
        {loading ? <div className="d-flex align-items-end h-100 gap-2 pb-5 pt-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="skeleton-shimmer flex-grow-1" style={{
          height: `${Math.max(20, Math.random() * 80 + 20)}%`,
          borderRadius: '4px 4px 0 0'
        }} />)}
          </div> : <SimpleSvgBarChart data={chartData} color={color} emptyMessage={isRegionMode ? `Không đủ dữ liệu khu vực cho ${selectedCountry.name}` : t("zone.khongCoDuLieuQuocGia")} />}
      </div>
    </div>;
}