import { useState } from 'react';
import {
  PrimaryInformationSection,
  MetadataSection,
  ManuscriptFilesSection,
  ReviewStatusPanel,
  DeleteArticleModal,
} from '../components/update-article';
import {
  mockArticleDetail,
  mockJournalOptions,
  mockManuscriptFiles,
  mockReviewStatus,
} from '../data/mockUpdateArticle';
import { toast } from '../../../shared/utils/toast';

export default function UpdateArticlePage() {
  // Form state cho Primary Information - khởi tạo từ mock data cố định.
  // Khi có API, sẽ khởi tạo bằng dữ liệu fetch theo :id từ URL.
  const [title, setTitle] = useState(mockArticleDetail.title);
  const [leadAuthor, setLeadAuthor] = useState(mockArticleDetail.leadAuthor);
  const [journal, setJournal] = useState(mockArticleDetail.journal);

  // Form state cho Metadata - khởi tạo từ mock data cố định.
  // submissionId không có setter vì là field read-only (mã hệ thống).
  const [abstract, setAbstract] = useState(mockArticleDetail.abstract);
  const [keywords, setKeywords] = useState(mockArticleDetail.keywords);
  const [submissionDate, setSubmissionDate] = useState(mockArticleDetail.submissionDate);

  // State cho Review Status - dropdown "Update Status" và badge "Current Status"
  // dùng chung 1 giá trị "status" để preview ngay khi đổi dropdown.
  const [status, setStatus] = useState(mockReviewStatus.status);

  // State điều khiển hiển thị Delete Article confirm modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Xử lý nút "Update Article" - chỉ UI ở bước này (không gọi API thật).
  // Khi tích hợp API: gọi PATCH /admin/articles/{id}/review-status (status)
  // cùng PUT /articles/{id} cho Primary Information/Metadata.
  const handleUpdate = () => {
    toast.success('Article updated (mock) - chưa kết nối API thật.');
  };

  // Xử lý nút "Cancel Changes" - reset toàn bộ field về giá trị mock ban đầu.
  const handleCancel = () => {
    setTitle(mockArticleDetail.title);
    setLeadAuthor(mockArticleDetail.leadAuthor);
    setJournal(mockArticleDetail.journal);
    setAbstract(mockArticleDetail.abstract);
    setKeywords(mockArticleDetail.keywords);
    setSubmissionDate(mockArticleDetail.submissionDate);
    setStatus(mockReviewStatus.status);
    toast.info('Changes have been reverted.');
  };

  // Xử lý xác nhận xóa article trong DeleteArticleModal.
  // Chỉ UI ở bước này (sẽ là DELETE /api/v1/articles/{id} khi tích hợp API).
  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    toast.success('Article deleted (mock) - chưa kết nối API thật.');
  };

  return (
    <>
      {/* Breadcrumb - chỉ UI, chưa gắn link điều hướng thật */}
      <p className="admin-breadcrumb">
        Management / Articles / <span className="admin-breadcrumb__current">Update Article</span>
      </p>

      {/* Page title + description - h2 tự áp dụng font-display theo index.css */}
      <h2 className="mb-1">Update Article (Cập nhật Bài báo)</h2>
      <p className="admin-page-description">
        Modify the manuscript details, metadata, and associated files for the selected submission.
        Changes will be logged for version control.
      </p>

      {/* Layout 2 cột: main content (trái) + review status panel (phải) */}
      <div className="admin-update-article-row">
        {/* Cột trái: các section form */}
        <div className="admin-update-article-main">
          <PrimaryInformationSection
            title={title}
            leadAuthor={leadAuthor}
            journal={journal}
            journalOptions={mockJournalOptions}
            onChangeTitle={setTitle}
            onChangeLeadAuthor={setLeadAuthor}
            onChangeJournal={setJournal}
          />

          <MetadataSection
            abstract={abstract}
            keywords={keywords}
            submissionId={mockArticleDetail.submissionId}
            submissionDate={submissionDate}
            onChangeAbstract={setAbstract}
            onChangeKeywords={setKeywords}
            onChangeSubmissionDate={setSubmissionDate}
          />

          <ManuscriptFilesSection files={mockManuscriptFiles} />
        </div>

        {/* Cột phải: Review Status Panel */}
        <ReviewStatusPanel
          status={status}
          onChangeStatus={setStatus}
          stats={mockReviewStatus}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
          onDelete={() => setShowDeleteModal(true)}
        />
      </div>

      {/* Delete Article confirm modal */}
      <DeleteArticleModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        articleTitle={title}
      />
    </>
  );
}