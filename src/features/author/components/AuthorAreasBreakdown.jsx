/**
 * @file AuthorAreasBreakdown.jsx
 * @description Hiển thị trực quan hóa tỷ lệ phần trăm phân bổ các bài báo xuất bản của tác giả
 * trên các lĩnh vực nghiên cứu học thuật khác nhau.
 * 
 * Điểm nổi bật về Thiết kế & Hiệu năng:
 * - Tự xây dựng biểu đồ hình tròn/donut tùy chỉnh bằng SVG (không dùng thư viện biểu đồ nặng nề bên ngoài).
 * - Tính toán động stroke-dasharray và stroke-dashoffset của SVG dựa trên tỷ lệ phần trăm.
 * - Hiển thị danh sách tiến độ song song với biểu đồ donut sử dụng hiệu ứng chuyển động CSS.
 * - Xử lý riêng biệt các trạng thái loading (shimmer skeleton) và empty/error để đảm bảo độ tin cậy.
 */

import { Row, Col, Card } from 'react-bootstrap';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import EmptyState from '../../../shared/components/EmptyState';

/**
 * @component AuthorAreasBreakdown
 * @description Component hiển thị phân bổ lĩnh vực nghiên cứu của tác giả.
 * 
 * @param {Object} props
 * @param {Array} props.breakdown - Mảng thống kê các lĩnh vực: { subject_area, percentage, count }
 * @param {boolean} props.loading - Cờ hiển thị trạng thái đang tải dữ liệu
 * @param {Object|string} props.error - Đối tượng/thông báo lỗi khi gọi API thất bại
 */
export default function AuthorAreasBreakdown({ breakdown = [], loading = false, error = null }) {
  
  // ── TRẠNG THÁI LOADING ──────────────────────────────────────────────────────
  // Hiển thị khung tròn shimmer đại diện cho biểu đồ donut và các thanh skeleton song song cho các giá trị.
  if (loading) {
    return (
      <Card 
        className="p-4 mb-4" 
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          borderRadius: '16px' 
        }}
      >
        <h5 className="font-display fw-bold text-main mb-4">Phân bổ lĩnh vực nghiên cứu</h5>
        <Row className="align-items-center">
          <Col xs={12} md={5} className="d-flex justify-content-center mb-3 mb-md-0">
            <div className="skeleton-shimmer rounded-circle" style={{ width: '160px', height: '160px' }} />
          </Col>
          <Col xs={12} md={7}>
            <div className="d-flex flex-column gap-3">
              <LoadingSkeleton width="90%" height="28px" />
              <LoadingSkeleton width="80%" height="28px" />
              <LoadingSkeleton width="70%" height="28px" />
            </div>
          </Col>
        </Row>
      </Card>
    );
  }

  // ── TRẠNG THÁI TRỐNG & LỖI ──────────────────────────────────────────────────
  // Hiển thị giao diện EmptyState tiêu chuẩn trong một Card được định dạng sẵn.
  if (error || !breakdown || breakdown.length === 0) {
    return (
      <Card 
        className="p-4 mb-4" 
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          borderRadius: '16px' 
        }}
      >
        <h5 className="font-display fw-bold text-main mb-3">Phân bổ lĩnh vực nghiên cứu</h5>
        <EmptyState 
          title="Chưa có dữ liệu phân bổ" 
          description="Chưa có dữ liệu phân bổ lĩnh vực nghiên cứu của tác giả này."
          icon="lucide:pie-chart"
          className="border-0 py-4"
        />
      </Card>
    );
  }

  // ── TÍNH TOÁN VÀ HIỂN THỊ BIỂU ĐỒ DONUT SVG ────────────────────────────────
  // Bảng màu được xác định trước phù hợp với phong cách thương hiệu ResearchPulse.
  const colors = ['#FF7A33', '#6366F1', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  // Công thức toán học tính bán kính và chu vi hình tròn: C = 2 * PI * r
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercentage = 0; // Theo dõi góc quay bắt đầu của từng phần hình tròn

  return (
    <Card 
      className="p-4 mb-4" 
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border)', 
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.01)'
      }}
    >
      <h5 className="font-display fw-bold text-main mb-4" style={{ fontSize: '1.1rem' }}>
        📊 Phân bổ lĩnh vực nghiên cứu
      </h5>

      <Row className="align-items-center">
        {/* Left Column: SVG Donut Chart */}
        <Col xs={12} md={5} className="d-flex justify-content-center mb-4 mb-md-0">
          <div className="position-relative" style={{ width: '180px', height: '180px' }}>
            <svg 
              width="180" 
              height="180" 
              viewBox="0 0 140 140" 
              style={{ transform: 'rotate(-90deg)' }} // Quay SVG để phần đầu tiên bắt đầu từ vị trí chính giữa phía trên (12 giờ)
            >
              {/* Vòng tròn nền trung tính phía sau */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="var(--bg-section)"
                strokeWidth="14"
              />
              
              {/* Các lát cắt hình tròn động bằng SVG */}
              {breakdown.map((item, idx) => {
                const strokeColor = colors[idx % colors.length];
                const pct = item.percentage ?? 0;
                
                // dashArray: độ dài của phân đoạn lát cắt và khoảng trống chu vi còn lại
                const dashArray = `${(pct / 100) * circumference} ${circumference}`;
                
                // dashOffset: dịch chuyển vị trí bắt đầu nét vẽ để tránh chồng lên các lát cắt trước đó
                const dashOffset = -((accumulatedPercentage / 100) * circumference);
                
                // Cộng dồn phần trăm để lát cắt tiếp theo bắt đầu ngay nơi lát cắt này kết thúc
                accumulatedPercentage += pct;

                return (
                  <circle
                    key={idx}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={strokeColor}
                    strokeWidth="15"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                  />
                );
              })}
            </svg>

            {/* Thẻ nhãn nằm giữa hình tròn */}
            <div 
              className="position-absolute d-flex flex-column align-items-center justify-content-center"
              style={{
                top: '20px',
                left: '20px',
                right: '20px',
                bottom: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.02)'
              }}
            >
              <span className="text-muted-custom" style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lĩnh vực</span>
              <span className="text-main fw-bold mt-0.5" style={{ fontSize: '1.25rem' }}>{breakdown.length}</span>
            </div>
          </div>
        </Col>

        {/* Cột phải: Danh sách chú thích dạng văn bản đi kèm Thanh tiến trình dạng đường thẳng */}
        <Col xs={12} md={7}>
          <div className="d-flex flex-column gap-3.5">
            {breakdown.map((item, idx) => {
              const color = colors[idx % colors.length];
              const name = item.subject_area ?? item.name ?? 'Lĩnh vực khác';
              const pct = item.percentage ?? 0;
              const count = item.count ?? item.article_count ?? 0;

              return (
                <div key={idx}>
                  <div className="d-flex align-items-center justify-content-between mb-1.5" style={{ fontSize: '0.82rem' }}>
                    <div className="d-flex align-items-center gap-2 min-w-0">
                      {/* Chấm tròn chỉ thị màu sắc của chú thích */}
                      <span 
                        className="rounded-circle d-inline-block flex-shrink-0" 
                        style={{ width: '8px', height: '8px', backgroundColor: color }} 
                      />
                      <span className="text-main fw-medium text-truncate">{name}</span>
                    </div>
                    {/* Số lượng bài báo và giá trị phần trăm */}
                    <div className="d-flex gap-2 text-muted-custom font-semibold flex-shrink-0" style={{ fontSize: '0.78rem' }}>
                      <span>{count} bài báo</span>
                      <span>•</span>
                      <span className="text-main">{pct}%</span>
                    </div>
                  </div>
                  
                  {/* Thanh tiến trình trực quan */}
                  <div 
                    className="rounded-pill overflow-hidden" 
                    style={{ height: '6px', backgroundColor: 'var(--bg-section)' }}
                  >
                    <div 
                      className="h-100 rounded-pill"
                      style={{ 
                        width: `${pct}%`, 
                        backgroundColor: color,
                        transition: 'width 0.6s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </Card>
  );
}
