// ─────────────────────────────────────────────────────────────────
// 1. DASHBOARD SUMMARY (raw) - khớp shape GET /admin/dashboard/summary
// ─────────────────────────────────────────────────────────────────
// - total_journals / total_articles / pending_reviews / active_users:
//   số liệu thô từ backend.
// - journal_growth / article_growth: số tăng/giảm so với kỳ trước,
//   dùng để hiển thị dòng "note" trên stat card.
export const mockDashboardSummary = {
  total_journals: 12,
  total_articles: 1428,
  pending_reviews: 42,
  active_users: 856,
  journal_growth: 2, // "+2 since last year"
  article_growth: 8,
};

// ─────────────────────────────────────────────────────────────────
// 2. STAT CARDS (display) - 4 card đầu trang dashboard
// ─────────────────────────────────────────────────────────────────
// buildStatCards(summary) chuyển dữ liệu thô (mockDashboardSummary hoặc
// response API thật có cùng shape) thành mảng item cho DashboardStatCard:
// - key:      định danh duy nhất (React key).
// - label:    tiêu đề card (VD: "Total Journals").
// - value:    giá trị chính hiển thị to (đã format dấu phẩy nếu cần).
// - icon:     icon Iconify hiển thị ở góc card.
// - note:     dòng chữ nhỏ phía dưới value (VD: "+2 since last year").
// - noteType: loại note để style màu chữ:
//             'positive' -> xanh (tăng trưởng tốt)
//             'negative' -> đỏ/cam (cần chú ý)
//             'neutral'  -> xám (thông tin trung tính, VD thời gian update)
//
// Một số thông tin (VD "Updated 12m ago", "124 Currently Online",
// "12 Critical Attention") chưa có field tương ứng trong API summary
// -> tạm giữ là text tĩnh, sẽ map field thật khi backend bổ sung.
export function buildStatCards(summary) {
  return [
    {
      key: 'totalJournals',
      label: 'Total Journals',
      value: summary.total_journals,
      icon: 'lucide:bookmark',
      note: `+${summary.journal_growth} since last year`,
      noteType: 'positive',
    },
    {
      key: 'totalArticles',
      label: 'Total Articles',
      value: summary.total_articles.toLocaleString('en-US'),
      icon: 'lucide:file-text',
      note: 'Updated 12m ago', // chưa có field "last_updated" trong API summary
      noteType: 'neutral',
    },
    {
      key: 'pendingReviews',
      label: 'Pending Reviews',
      value: summary.pending_reviews,
      icon: 'lucide:clipboard-list',
      note: '12 Critical Attention', // chưa có field "critical_reviews" trong API summary
      noteType: 'negative',
    },
    {
      key: 'activeUsers',
      label: 'Active Users',
      value: summary.active_users,
      icon: 'lucide:users',
      note: '124 Currently Online', // chưa có field "online_users" trong API summary
      noteType: 'positive',
    },
  ];
}

// ─────────────────────────────────────────────────────────────────
// 3. PUBLICATION TRENDS (raw) - khớp shape
//    GET /admin/dashboard/publication-trends?year=...
// ─────────────────────────────────────────────────────────────────
// Cấu trúc: object có key là năm (số), value là { year, items }.
// Mỗi item trong "items":
// - month:       số thứ tự tháng (1-12), giống response thật.
// - manuscripts: tổng số bài nộp trong tháng (cột màu xám - bg-section).
// - published:   số bài đã xuất bản trong tháng (cột màu cam - primary).
// Year selector trên UI dùng key của object này để đổi dữ liệu hiển thị.
export const mockPublicationTrends = {
  2024: {
    year: 2024,
    items: [
      { month: 1, manuscripts: 950, published: 620 },
      { month: 2, manuscripts: 1020, published: 700 },
      { month: 3, manuscripts: 780, published: 380 },
      { month: 4, manuscripts: 1180, published: 980 },
      { month: 5, manuscripts: 1100, published: 940 },
      { month: 6, manuscripts: 980, published: 640 },
    ],
  },
  2023: {
    year: 2023,
    items: [
      { month: 1, manuscripts: 820, published: 520 },
      { month: 2, manuscripts: 900, published: 600 },
      { month: 3, manuscripts: 700, published: 340 },
      { month: 4, manuscripts: 1020, published: 860 },
      { month: 5, manuscripts: 980, published: 820 },
      { month: 6, manuscripts: 860, published: 560 },
    ],
  },
};

// Tên viết tắt 12 tháng - dùng để convert số tháng (1-12) từ API
// thành label hiển thị trên trục X của chart (Jan, Feb, ...).
export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// ─────────────────────────────────────────────────────────────────
// 4. RECENT ACTIVITY - dữ liệu cho ActivityTimeline
// ─────────────────────────────────────────────────────────────────
// Tương ứng GET /admin/dashboard/recent-activities (P0).
// Mỗi item:
// - id:          định danh duy nhất.
// - type:        loại hoạt động, dùng để chọn icon/màu chấm tròn timeline.
//                'published' -> chấm cam (sự kiện chính, tích cực).
//                'revision'  -> chấm xanh dương nhạt (cập nhật thông thường).
//                'reviewer'  -> chấm xám (hoạt động phụ, thông tin).
//                'overdue'   -> chấm đỏ (cảnh báo, cần xử lý gấp).
// - title:       tiêu đề ngắn của hoạt động (in đậm).
// - description: mô tả chi tiết (in thường, màu text-muted).
// - time:        thời gian tương đối (VD: "2 hours ago", "Yesterday").
export const mockRecentActivity = [
  {
    id: 1,
    type: 'published',
    title: 'Manuscript Published',
    description: '"Quantum Entanglement in Biological Systems"',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'revision',
    title: 'New Revision Submitted',
    description: 'Dr. Sarah Jenkins uploaded revised figures.',
    time: '5 hours ago',
  },
  {
    id: 3,
    type: 'reviewer',
    title: 'Reviewer Assigned',
    description: 'Assigned 3 peer reviewers to Journal #405.',
    time: 'Yesterday',
  },
  {
    id: 4,
    type: 'overdue',
    title: 'Overdue Review',
    description: 'MS-2024-88 is 3 days past review deadline.',
    time: 'Yesterday',
  },
];

// ─────────────────────────────────────────────────────────────────
// 5. VOLUME & ISSUE STATUS - dữ liệu cho table cuối dashboard
// ─────────────────────────────────────────────────────────────────
// Tương ứng GET /admin/dashboard/volume-issue-status (P0).
// Mỗi item:
// - id:              định danh duy nhất (key cho table row).
// - volume:          tên volume kèm năm (VD: "Vol 15 (2024)").
// - totalIssues:     tổng số issue trong volume.
// - publicationDate: ngày xuất bản (có thể kèm ghi chú "(Planned)").
// - status:          một trong các giá trị của VOLUME_STATUS
//                     (constants/volumeStatus.js) -> dùng cho StatusBadge.
// - progress:        % hoàn thành (0-100) -> dùng cho ProgressBar
//                     (Published/Archived = 100, In Prep = % thực tế).
export const mockVolumeStatus = [
  {
    id: 1,
    volume: 'Vol 15 (2024)',
    totalIssues: 4,
    publicationDate: 'Mar 15, 2024',
    status: 'published',
    progress: 100,
  },
  {
    id: 2,
    volume: 'Vol 16 (2025)',
    totalIssues: 1,
    publicationDate: 'Oct 02, 2024 (Planned)',
    status: 'in_prep',
    progress: 25,
  },
  {
    id: 3,
    volume: 'Vol 14 (2023)',
    totalIssues: 12,
    publicationDate: 'Dec 20, 2023',
    status: 'archived',
    progress: 100,
  },
];

// ─────────────────────────────────────────────────────────────────
// 6. TREND YEARS - danh sách năm cho year selector trên chart
// ─────────────────────────────────────────────────────────────────
// Dùng để render dropdown/select năm. Giá trị phải khớp với key
// của object mockPublicationTrends ở trên.
export const mockTrendYears = [2024, 2023];