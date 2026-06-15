import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArticleFilterBar,
  ArticleTable,
  Pagination,
  EditorInsightsCard,
  PeerMatchingPromoCard,
} from '../components/article-repository';
import { mockArticleList, mockEditorInsights } from '../data/mockArticleRepository';
import { JOURNAL_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../constants/articleListFilters';
import ROUTES from '../../../app/routes/routePaths';

// Số article hiển thị mỗi trang
const PAGE_SIZE = 4;

// Giá trị filter mặc định (chưa áp dụng bộ lọc nào)
const DEFAULT_FILTERS = {
  journal: JOURNAL_FILTER_OPTIONS[0], // "All Journals"
  status: STATUS_FILTER_OPTIONS[0].value, // "all"
  submittedDate: '',
};

export default function ArticleRepositoryPage() {
  const navigate = useNavigate();

  // Draft filters - giá trị đang chọn trên filter bar
  const [journalFilter, setJournalFilter] = useState(DEFAULT_FILTERS.journal);
  const [statusFilter, setStatusFilter] = useState(DEFAULT_FILTERS.status);
  const [submittedDateFilter, setSubmittedDateFilter] = useState(DEFAULT_FILTERS.submittedDate);

  // Applied filters - bản filter thực sự đang áp dụng lên danh sách
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  // Trang hiện tại của table
  const [currentPage, setCurrentPage] = useState(1);

  // Áp dụng filter đang chọn vào appliedFilters, reset về trang 1
  const handleApplyFilters = () => {
    setAppliedFilters({
      journal: journalFilter,
      status: statusFilter,
      submittedDate: submittedDateFilter,
    });
    setCurrentPage(1);
  };

  // Reset cả draft filters và applied filters về mặc định, về trang 1
  const handleClearFilters = () => {
    setJournalFilter(DEFAULT_FILTERS.journal);
    setStatusFilter(DEFAULT_FILTERS.status);
    setSubmittedDateFilter(DEFAULT_FILTERS.submittedDate);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  // Danh sách article sau khi lọc theo appliedFilters.
  // useMemo để tránh tính lại không cần thiết khi chỉ đổi trang.
  const filteredArticles = useMemo(() => {
    return mockArticleList.filter((article) => {
      const matchJournal =
        appliedFilters.journal === JOURNAL_FILTER_OPTIONS[0] || article.journal === appliedFilters.journal;

      const matchStatus = appliedFilters.status === 'all' || article.status === appliedFilters.status;

      // submittedDate trong mock là string đã format (VD "Oct 12, 2023"),
      // chưa thể so sánh trực tiếp với <input type="date"> (yyyy-mm-dd)
      // -> ở mức mock, filter ngày chỉ được áp dụng khi có API trả về
      // submittedDate dạng ISO. Tạm thời bỏ qua điều kiện ngày.
      const matchDate = true;

      return matchJournal && matchStatus && matchDate;
    });
  }, [appliedFilters]);

  // Tính phân trang dựa trên danh sách đã lọc
  const totalItems = filteredArticles.length;
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  // Đảm bảo currentPage không vượt quá totalPages (VD sau khi filter làm giảm số trang)
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageItems = filteredArticles.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <>
      {/* Breadcrumb */}
      <p className="admin-breadcrumb">
        Management / <span className="admin-breadcrumb__current">Manuscripts</span>
      </p>

      {/* Header: title + nút "Submit New Article" */}
      <div className="admin-page-header">
        <h2 className="mb-0">Article Repository</h2>
        <button
          type="button"
          className="admin-btn admin-btn--primary admin-btn--auto"
          onClick={() => navigate(ROUTES.ADMIN_ARTICLE_CREATE)}
        >
          + Submit New Article
        </button>
      </div>

      {/* Filter bar - hoạt động ở mức frontend, chỉ áp dụng khi bấm Apply */}
      <ArticleFilterBar
        journal={journalFilter}
        status={statusFilter}
        submittedDate={submittedDateFilter}
        onChangeJournal={setJournalFilter}
        onChangeStatus={setStatusFilter}
        onChangeSubmittedDate={setSubmittedDateFilter}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Article table - hiển thị item của trang hiện tại */}
      <ArticleTable
        items={pageItems}
        totalItems={totalItems}
        startIndex={totalItems === 0 ? 0 : startIndex + 1}
        endIndex={Math.min(startIndex + PAGE_SIZE, totalItems)}
      />

      {/* Pagination - tự ẩn nếu chỉ có 1 trang */}
      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Bottom row: Editor's Insights (trái) + Peer-Matching promo (phải) */}
      <div className="admin-repository-bottom-row">
        <EditorInsightsCard insights={mockEditorInsights} />
        <PeerMatchingPromoCard />
      </div>
    </>
  );
}