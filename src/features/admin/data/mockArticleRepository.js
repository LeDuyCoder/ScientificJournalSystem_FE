import { ARTICLE_REVIEW_STATUS } from '../constants/articleStatus';

// ─────────────────────────────────────────────────────────────────
// 1. ARTICLE LIST
// ─────────────────────────────────────────────────────────────────
// - id:            định danh article, dùng cho route /admin/articles/:id khi Edit.
// - title:         tên bài báo.
// - msId:          mã submission hiển thị dưới title (VD "MS ID: 2024-PX-9921").
// - pages:         tổng số trang.
// - citations:     tổng số citation.
// - leadAuthor:    tên tác giả chính.
// - leadAuthorAvatar: URL avatar (placeholder pravatar), có thể null -> hiển thị initials.
// - journal:       tên journal hiển thị (kèm class màu riêng theo subject area).
// - status:        giá trị trong ARTICLE_REVIEW_STATUS - dùng StatusBadge.
// - submittedDate: ngày nộp (đã format sẵn để hiển thị, VD "Oct 12, 2023").
export const mockArticleList = [
  {
    id: '2024-PX-9921',
    title: 'Quantum Decoherence in Biological Systems',
    msId: 'MS ID: 2024-PX-9921',
    pages: 12,
    citations: 14,
    leadAuthor: 'Dr. Lisa Sterling',
    leadAuthorAvatar: 'https://i.pravatar.cc/40?img=47',
    journal: 'Int. Physics Review',
    status: ARTICLE_REVIEW_STATUS.IN_REVIEW,
    submittedDate: 'Oct 12, 2023',
  },
  {
    id: '2023-EM-4418',
    title: 'Sustainable Concrete Alternatives in Arid Climates',
    msId: 'MS ID: 2023-EM-4418',
    pages: 22,
    citations: 5,
    leadAuthor: 'Ahmed Mansour',
    leadAuthorAvatar: 'https://i.pravatar.cc/40?img=15',
    journal: 'Civil Engineering',
    status: ARTICLE_REVIEW_STATUS.PUBLISHED,
    submittedDate: 'Sep 05, 2023',
  },
  {
    id: '2023-ET-1102',
    title: 'Neurosurgery Ethics in the Age of Neuralink',
    msId: 'MS ID: 2023-ET-1102',
    pages: 8,
    citations: 0,
    leadAuthor: 'Clara Choi',
    leadAuthorAvatar: 'https://i.pravatar.cc/40?img=32',
    journal: 'Applied Ethics Quarterly',
    status: ARTICLE_REVIEW_STATUS.REVISION_REQUIRED,
    submittedDate: 'Nov 28, 2023',
  },
  {
    id: '2024-AI-7722',
    title: 'Machine Learning Patterns in Urban Planning',
    msId: 'MS ID: 2024-AI-7722',
    pages: 18,
    citations: 34,
    leadAuthor: 'Mark J. Henderson',
    leadAuthorAvatar: 'https://i.pravatar.cc/40?img=58',
    journal: 'Civil Engineering',
    status: ARTICLE_REVIEW_STATUS.PUBLISHED,
    submittedDate: 'Jan 14, 2024',
  },
  {
    id: '2024-BQ-3310',
    title: 'Protein Folding Prediction via Hybrid Neural Networks',
    msId: 'MS ID: 2024-BQ-3310',
    pages: 16,
    citations: 9,
    leadAuthor: 'Dr. Hannah Liu',
    leadAuthorAvatar: 'https://i.pravatar.cc/40?img=44',
    journal: 'Advanced Bio-Quantum Research',
    status: ARTICLE_REVIEW_STATUS.SUBMITTED,
    submittedDate: 'Feb 02, 2024',
  },
  {
    id: '2024-PX-5560',
    title: 'Thermal Noise Effects on Superconducting Qubits',
    msId: 'MS ID: 2024-PX-5560',
    pages: 10,
    citations: 3,
    leadAuthor: 'Dr. Lisa Sterling',
    leadAuthorAvatar: 'https://i.pravatar.cc/40?img=47',
    journal: 'Int. Physics Review',
    status: ARTICLE_REVIEW_STATUS.DRAFT,
    submittedDate: 'Feb 20, 2024',
  },
  {
    id: '2023-ET-9087',
    title: 'Informed Consent Frameworks for AI-Assisted Diagnosis',
    msId: 'MS ID: 2023-ET-9087',
    pages: 14,
    citations: 21,
    leadAuthor: 'Clara Choi',
    leadAuthorAvatar: 'https://i.pravatar.cc/40?img=32',
    journal: 'Applied Ethics Quarterly',
    status: ARTICLE_REVIEW_STATUS.REJECTED,
    submittedDate: 'Dec 18, 2023',
  },
  {
    id: '2024-AI-8841',
    title: 'Federated Learning for Smart Grid Load Forecasting',
    msId: 'MS ID: 2024-AI-8841',
    pages: 20,
    citations: 7,
    leadAuthor: 'Mark J. Henderson',
    leadAuthorAvatar: 'https://i.pravatar.cc/40?img=58',
    journal: 'Civil Engineering',
    status: ARTICLE_REVIEW_STATUS.ACCEPTED,
    submittedDate: 'Mar 03, 2024',
  },
];

// ─────────────────────────────────────────────────────────────────
// 2. EDITOR'S INSIGHTS - 3 mini stat dưới table
// ─────────────────────────────────────────────────────────────────
// - avgReviewTime:   số ngày trung bình review (hiển thị "12.4").
// - avgReviewTrend:  ghi chú thay đổi so với kỳ trước (VD "2.1 Days Improv.").
// - acceptanceRate:  tỉ lệ chấp nhận bài (hiển thị "32.1%").
// - acceptanceTrend: ghi chú so sánh (VD "Stable vs Q3").
// - activeReviewers: số reviewer đang hoạt động (hiển thị "1.1k").
// - reviewersTrend:  ghi chú tăng trưởng (VD "+ 8% Growth").
export const mockEditorInsights = {
  performanceLabel: 'Q4 Performance',
  summary:
    'Reviewer engagement has increased by 14% this quarter. Articles in "Peer Review" are currently averaging 12 days before a decision is made.',
  avgReviewTime: '12.4',
  avgReviewTrend: '2.1 Days Improv.',
  acceptanceRate: '32.1%',
  acceptanceTrend: 'Stable vs Q3',
  activeReviewers: '1.1k',
  reviewersTrend: '+8% Growth',
};