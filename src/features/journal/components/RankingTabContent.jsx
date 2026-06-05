import React from 'react';
import { Row, Col, Table, Badge } from 'react-bootstrap';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';

export default function RankingTabContent({ rankingHistory = [], metricName = 'Impact Factor', loading }) {
  if (loading) {
    return (
      <Row className="gy-4">
        <Col lg={7}>
          <div 
            className="journal-dark-card p-4"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
          >
            <LoadingSkeleton width="180px" height="24px" className="mb-4" />
            <LoadingSkeleton width="100%" height="280px" />
          </div>
        </Col>
        <Col lg={5}>
          <div 
            className="journal-dark-card p-4"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
          >
            <LoadingSkeleton width="150px" height="24px" className="mb-4" />
            <LoadingSkeleton width="100%" height="280px" />
          </div>
        </Col>
      </Row>
    );
  }

  if (!rankingHistory || rankingHistory.length === 0) {
    return (
      <div 
        className="journal-dark-card p-5 text-center text-muted-custom"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
      >
        Chưa có dữ liệu lịch sử xếp hạng cho tạp chí này.
      </div>
    );
  }

  // Sort chronological for chart (oldest to newest)
  const chartData = [...rankingHistory].sort((a, b) => a.year - b.year);
  // Sort reverse chronological for table (newest to oldest)
  const tableData = [...rankingHistory].sort((a, b) => b.year - a.year);

  // SVG Chart Calculations
  const chartHeight = 260;
  const chartWidth = 500;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const graphHeight = chartHeight - paddingTop - paddingBottom;
  const graphWidth = chartWidth - paddingLeft - paddingRight;

  // Find max value for scaling
  const validValues = chartData.map(d => d.value).filter(v => typeof v === 'number' && !isNaN(v));
  const maxValue = validValues.length > 0 ? Math.max(...validValues) : 10;
  const yMax = Math.ceil(maxValue / 5) * 5; // round to next multiple of 5

  // Generate Y axis ticks
  const yTicks = [];
  for (let i = 0; i <= yMax; i += yMax / 5) {
    yTicks.push(Math.round(i * 10) / 10);
  }

  // Calculate coordinates
  const getX = (index) => {
    return paddingLeft + (index * (graphWidth / (chartData.length - 1 || 1)));
  };

  const getY = (value) => {
    if (value === null || value === undefined) return chartHeight - paddingBottom;
    const ratio = value / yMax;
    return chartHeight - paddingBottom - (ratio * graphHeight);
  };

  return (
    <Row className="gy-4 align-items-stretch">
      {/* Chart Column */}
      <Col lg={7}>
        <div 
          className="journal-dark-card p-4 h-100 d-flex flex-column" 
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
        >
          <h4 className="font-display fw-bold text-main mb-4" style={{ fontSize: '1.2rem' }}>
            {metricName} theo năm
          </h4>
          
          <div className="flex-grow-1 d-flex justify-content-center align-items-center overflow-auto py-2">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              width="100%" 
              style={{ minWidth: '400px', height: 'auto' }}
            >
              <defs>
                {/* Glowing glow effect filter */}
                <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Shimmer gradient for columns */}
                <linearGradient id="bar-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--primary-light)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {yTicks.map((tick, idx) => {
                const y = getY(tick);
                return (
                  <g key={idx}>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={chartWidth - paddingRight} 
                      y2={y} 
                      stroke="var(--border)" 
                      strokeWidth="1" 
                    />
                    <text 
                      x={paddingLeft - 8} 
                      y={y + 4} 
                      fill="var(--text-muted)" 
                      fontSize="10" 
                      textAnchor="end"
                      fontWeight="500"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {chartData.map((d, idx) => {
                if (d.value === null || d.value === undefined) return null;
                const x = getX(idx);
                const y = getY(d.value);
                const barWidth = 32;
                const barHeight = chartHeight - paddingBottom - y;
                
                return (
                  <g key={idx} className="chart-bar-group">
                    {/* Shadow/Glow behind stroke */}
                    <rect 
                      x={x - barWidth / 2} 
                      y={y} 
                      width={barWidth} 
                      height={barHeight} 
                      fill="transparent" 
                      stroke="var(--primary)" 
                      strokeWidth="1.5"
                      rx="6"
                      filter="url(#cyan-glow)"
                      opacity="0.15"
                    />
                    {/* Visual Bar */}
                    <rect 
                      x={x - barWidth / 2} 
                      y={y} 
                      width={barWidth} 
                      height={barHeight} 
                      fill="url(#bar-fill)" 
                      stroke="var(--primary)" 
                      strokeWidth="2"
                      rx="6"
                      style={{ transition: 'all 0.3s' }}
                    />
                    {/* Hover text label */}
                    <text 
                      x={x} 
                      y={y - 8} 
                      fill="var(--primary)" 
                      fontSize="10" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      {d.value}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Line */}
              <line 
                x1={paddingLeft} 
                y1={chartHeight - paddingBottom} 
                x2={chartWidth - paddingRight} 
                y2={chartHeight - paddingBottom} 
                stroke="var(--border)" 
                strokeWidth="1.5" 
              />

              {/* X Axis Labels */}
              {chartData.map((d, idx) => {
                const x = getX(idx);
                return (
                  <text 
                    key={idx} 
                    x={x} 
                    y={chartHeight - paddingBottom + 18} 
                    fill="var(--text-muted)" 
                    fontSize="11" 
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {d.year}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </Col>

      {/* Table Column */}
      <Col lg={5}>
        <div 
          className="journal-dark-card p-4 h-100" 
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
        >
          <h4 className="font-display fw-bold text-main mb-4" style={{ fontSize: '1.2rem' }}>
            Bảng xếp hạng lịch sử
          </h4>
          
          <div className="table-responsive">
            <Table 
              borderless 
              hover 
              className="align-middle mb-0 text-start text-main"
            >
              <thead>
                <tr className="border-bottom border-secondary-subtle" style={{ borderColor: 'var(--border) !important' }}>
                  <th className="text-muted-custom text-uppercase fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Năm</th>
                  <th className="text-muted-custom text-uppercase fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Quartile</th>
                  <th className="text-muted-custom text-uppercase fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>{metricName}</th>
                  <th className="text-muted-custom text-uppercase fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>H-Index</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className="border-bottom border-secondary-subtle" 
                    style={{ borderColor: 'var(--border) !important', cursor: 'pointer' }}
                  >
                    <td className="py-3 fw-medium text-main">{row.year}</td>
                    <td className="py-3">
                      {row.quartile ? (
                        <Badge 
                          className="font-display"
                          style={{ 
                            fontWeight: 700, 
                            borderRadius: '4px', 
                            fontSize: '0.75rem',
                            backgroundColor: row.quartile === 'Q1' ? 'rgba(47, 198, 70, 0.12)'
                                           : row.quartile === 'Q2' ? 'var(--primary-light)' 
                                           : 'var(--bg-section)',
                            color: row.quartile === 'Q1' ? 'var(--q1-color)' 
                                 : row.quartile === 'Q2' ? 'var(--primary)' 
                                 : 'var(--text-muted)',
                            border: row.quartile === 'Q1' ? '1px solid rgba(47, 198, 70, 0.3)' : '1px solid var(--border)'
                          }}
                        >
                          {row.quartile}
                        </Badge>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 fw-bold text-primary font-display">
                      {row.value !== null && row.value !== undefined ? row.value : <span className="text-muted">—</span>}
                    </td>
                    <td className="py-3 text-muted-custom font-display">
                      {row.h_index || <span className="text-muted">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Col>
    </Row>
  );
}
