/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\components\TrendingKeywordsCard.jsx
 */
import { Icon } from '@iconify/react';
import { EntityCard } from '../../../shared/components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function KeywordsRechart({ chartData, onKeywordClick }) {
  const labels = chartData?.labels || [];
  const dataset = chartData?.datasets?.[0] || { data: [] };

  const mappedData = labels.map((label, index) => ({
    keyword: label,
    value: dataset.data[index] ?? 0
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={mappedData}
        layout="vertical"
        margin={{ left: 5, right: 10, top: 5, bottom: 5 }}
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="keyword"
          type="category"
          width={110}
          tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-display)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'var(--bg-section)', opacity: 0.5 }}
          contentStyle={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontSize: '11px',
            fontFamily: 'var(--font-display)'
          }}
        />
        <Bar
          dataKey="value"
          fill="var(--primary)"
          name={dataset.label || 'Số bài báo'}
          radius={[0, 4, 4, 0]}
          barSize={14}
          onClick={(data) => {
            if (data && data.keyword) {
              onKeywordClick?.(data.keyword);
            }
          }}
          style={{ cursor: 'pointer' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * TrendingKeywordsCard — card trending keywords với biểu đồ BarChart của Recharts
 */
export default function TrendingKeywordsCard({ keywords, loading, error, onKeywordClick, onViewMore }) {
  const actions = onViewMore ? (
    <button
      className="btn btn-link p-0 text-decoration-none"
      onClick={onViewMore}
      style={{ fontSize: '0.75rem', color: 'var(--primary)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = 'underline';
        e.currentTarget.style.textUnderlineOffset = '4px';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = 'none';
      }}
    >
      Xem thêm →
    </button>
  ) : null;

  const labels = keywords?.labels || [];
  const dataset = keywords?.datasets?.[0] || { data: [] };
  const hasData = labels.length > 0 && dataset.data?.length > 0;

  const description = loading ? (
    <div className="d-flex flex-column gap-3 py-2">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <div key={i} className="d-flex align-items-center gap-3">
          <div className="skeleton-shimmer rounded" style={{ width: 80, height: 16 }} />
          <div className="skeleton-shimmer rounded flex-grow-1" style={{ height: 16 }} />
        </div>
      ))}
    </div>
  ) : error ? (
    <div className="text-center py-4">
      <Icon icon="lucide:alert-circle" width={28} style={{ color: '#ef4444' }} />
      <p className="text-muted-custom mt-2 mb-0" style={{ fontSize: '0.8rem' }}>{error}</p>
    </div>
  ) : !hasData ? (
    <div className="text-center py-4">
      <Icon icon="lucide:tag" width={32} style={{ color: 'var(--text-muted)' }} />
      <p className="text-main fw-semibold mt-2 mb-1" style={{ fontSize: '0.85rem' }}>
        Chưa có keyword nào
      </p>
      <p className="text-muted-custom mb-0" style={{ fontSize: '0.75rem' }}>
        Thêm keyword vào project để bắt đầu theo dõi.
      </p>
    </div>
  ) : (
    <KeywordsRechart chartData={keywords} onKeywordClick={onKeywordClick} />
  );

  return (
    <EntityCard
      className="h-100"
      title={(
        <span className="d-flex align-items-center gap-2">
          <Icon icon="lucide:flame" width={16} style={{ color: 'var(--primary)' }} />
          <span>Trending Keywords</span>
        </span>
      )}
      actions={actions}
      description={description}
      bodyClassName="flex-column align-items-stretch"
    />
  );
}
