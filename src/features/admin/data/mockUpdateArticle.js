import { ARTICLE_REVIEW_STATUS } from '../constants/articleStatus';

// ─────────────────────────────────────────────────────────────────
// 1. PRIMARY INFORMATION + METADATA
// ─────────────────────────────────────────────────────────────────
// - id:              định danh article (giả lập, khớp với :id trên URL).
// - title:           tên bài báo.
// - leadAuthor:      tên tác giả chính.
// - journal:         journal hiện tại của bài báo (dùng cho <select> Journal).
// - abstract:        tóm tắt bài báo (textarea).
// - keywords:        mảng string - hiển thị dạng tag, có thể thêm/xóa qua KeywordInput.
// - submissionId:    mã submission (VD "2024-PX-9921").
// - submissionDate:  ngày nộp bài (định dạng yyyy-mm-dd để dùng trực tiếp cho <input type="date">).
export const mockArticleDetail = {
  id: '2024-PX-9921',
  title: 'Quantum Decoherence in Biological Systems',
  leadAuthor: 'Dr. Lisa Sterling',
  journal: 'Advanced Bio-Quantum Research',
  abstract:
    'This paper investigates the role of quantum decoherence in photosynthesis and avian navigation. We explore how environment-induced decoherence can be suppressed in biological structures at physiological temperatures, enabling quantum-enhanced performance in energy transfer and sensory perception.',
  keywords: ['Quantum Biology', 'Decoherence', 'Bio Physics'],
  submissionId: '2024-PX-9921',
  submissionDate: '2024-03-15',
};

// ─────────────────────────────────────────────────────────────────
// 2. JOURNAL OPTIONS - danh sách journal cho <select> "Journal"
// ─────────────────────────────────────────────────────────────────
// Tạm dùng mảng tĩnh; sẽ thay bằng GET /api/v1/journal khi có API.
export const mockJournalOptions = [
  'Advanced Bio-Quantum Research',
  'International Physics Review',
  'Journal of Applied Ethics Quarterly',
  'Civil Engineering Today',
];

// ─────────────────────────────────────────────────────────────────
// 3. MANUSCRIPT FILES
// ─────────────────────────────────────────────────────────────────
// Mỗi item:
// - id:         định danh file (dùng cho key + các action download/replace).
// - name:       tên file hiển thị.
// - type:       loại file ('pdf' | 'zip' | ...) -> dùng để chọn icon.
// - size:       dung lượng đã format sẵn (VD "4.2 MB").
// - uploadedAt: ngày upload đã format sẵn (VD "March 15, 2024").
export const mockManuscriptFiles = [
  {
    id: 'file-1',
    name: 'Main_Manuscript.pdf',
    type: 'pdf',
    size: '4.2 MB',
    uploadedAt: 'March 15, 2024',
  },
  {
    id: 'file-2',
    name: 'High_Res_Figures_Pack.zip',
    type: 'zip',
    size: '28.5 MB',
    uploadedAt: 'March 15, 2024',
  },
];

// ─────────────────────────────────────────────────────────────────
// 4. REVIEW STATUS PANEL - trạng thái + quick statistics
// ─────────────────────────────────────────────────────────────────
// - status:           giá trị trong ARTICLE_REVIEW_STATUS, dùng cho
//                      badge "Current Status" và giá trị mặc định của
//                      dropdown "Update Status".
// - wordCount:        tổng số từ trong manuscript.
// - referencesCount:  tổng số tài liệu tham khảo.
// - reviewersAssigned / reviewersTotal: số reviewer đã gán / tổng cần gán
//                      (hiển thị dạng "3/3" giống Figma).
// - lastUpdated:      thời điểm cập nhật gần nhất (hiển thị dạng text).
export const mockReviewStatus = {
  status: ARTICLE_REVIEW_STATUS.IN_REVIEW,
  wordCount: 8432,
  referencesCount: 42,
  reviewersAssigned: 3,
  reviewersTotal: 3,
  lastUpdated: 'Today at 09:42 AM',
};