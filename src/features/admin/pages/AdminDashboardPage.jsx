import { useState } from 'react';
import AdminLayout from '../../../app/layouts/AdminLayout';
import DashboardStatCard from '../components/DashboardStatCard';
import PublicationTrendsChart from '../components/PublicationTrendsChart';
import ActivityTimeline from '../components/ActivityTimeline';
import AllActivityModal from '../components/AllActivityModal';
import VolumeIssueTable from '../components/VolumeIssueTable';
import {
  mockDashboardSummary,
  buildStatCards,
  mockPublicationTrends,
  mockTrendYears,
  mockRecentActivity,
  mockAllActivity,
  mockVolumeStatus,
} from '../data/mockDashboard';

export default function AdminDashboardPage() {
  // Năm đang được chọn trên year selector của Publication Trends chart.
  // Mặc định lấy năm đầu tiên trong mockTrendYears (2024).
  const [selectedYear, setSelectedYear] = useState(mockTrendYears[0]);

  // State điều khiển hiển thị modal "View All Activity"
  const [showAllActivity, setShowAllActivity] = useState(false);

  // Build danh sách stat card từ dữ liệu summary thô (giống response API thật)
  const statCards = buildStatCards(mockDashboardSummary);

  // Dữ liệu chart tương ứng với năm đang chọn (lấy mảng "items" từ response)
  const trendsData = mockPublicationTrends[selectedYear]?.items || [];

  return (
    <AdminLayout>
      {/* Tiêu đề trang - h2 tự động áp dụng font-display theo index.css */}
      <h2 className="mb-3">Dashboard</h2>

      {/* Grid 4 stat card - map từ statCards, mỗi item có key riêng */}
      <div className="admin-stat-grid">
        {statCards.map((stat) => (
          <DashboardStatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            note={stat.note}
            noteType={stat.noteType}
          />
        ))}
      </div>

      {/* Hàng 2 cột: Publication Trends chart (trái) + Recent Activity (phải) */}
      <div className="admin-dashboard-row">
        <PublicationTrendsChart
          data={trendsData}
          years={mockTrendYears}
          selectedYear={selectedYear}
          onChangeYear={setSelectedYear}
        />

        <ActivityTimeline items={mockRecentActivity} onViewAll={() => setShowAllActivity(true)} />
      </div>

      {/* Volume & Issue Status table + Export CSV */}
      <VolumeIssueTable items={mockVolumeStatus} />

      {/* Modal "View All Activity" */}
      <AllActivityModal
        show={showAllActivity}
        onClose={() => setShowAllActivity(false)}
        items={mockAllActivity}
      />
    </AdminLayout>
  );
}