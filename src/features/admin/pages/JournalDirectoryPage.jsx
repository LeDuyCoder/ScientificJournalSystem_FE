import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { useJournalManagement } from '../../journal/hooks/useJournalManagement';
import JournalFilterBar from '../components/JournalFilterBar';
import JournalTableAdmin from '../components/JournalTableAdmin';
import JournalCardAdmin from '../components/JournalCardAdmin';
import AddJournalModal from '../components/modals/AddJournalModal';
import Pagination from '../components/Pagination';
import AdminLayout from '../../../app/layouts/AdminLayout';

/**
 * JournalDirectoryPage - Màn hình chính quản lý thư mục các Tạp chí dành cho Admin.
 */
export default function JournalDirectoryPage() {
  const { journals, fetchInitialData, loading } = useJournalManagement();

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch initial data on mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, subjectFilter]);

  // Search & filter logic
  const filteredJournals = (journals || []).filter((journal) => {
    const title = journal.title || journal.display_name || '';
    const issn = journal.issn || '';
    const status = journal.status || 'Draft';
    const category = journal.subjectCategory || '';

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      issn.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || category === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Calculate paginated journals
  const paginatedJournals = filteredJournals.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <AdminLayout>
      <div className="d-flex flex-column gap-3">
        {/* Header Title Section */}
        <div className="text-start mb-2">
          <h2 className="font-display fw-bold text-main mb-1">Journal Directory</h2>
          <p className="text-muted-custom small mb-0">
            Manage and monitor the entire publication lifecycle for your academic portfolio.
          </p>
        </div>

        {/* Filters and Search toolbar */}
        <JournalFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          subjectFilter={subjectFilter}
          onSubjectChange={setSubjectFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenAddModal={() => setShowAddModal(true)}
        />

        {/* Display journals */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading journals...</span>
            </div>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 border" style={{ borderColor: 'var(--border)' }}>
            <p className="text-muted-custom mb-0">No journals match the selected filters.</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="glass-card p-0 border-0 shadow-sm text-start bg-white rounded-3 overflow-hidden">
            <JournalTableAdmin
              journals={paginatedJournals}
              page={currentPage}
              limit={limit}
            />
            <Pagination
              totalItems={filteredJournals.length}
              currentPage={currentPage}
              limit={limit}
              onPageChange={setCurrentPage}
              onLimitChange={setLimit}
              entityName="journals"
            />
          </div>
        ) : (
          <div>
            <Row className="g-3 mb-4">
              {paginatedJournals.map((j) => (
                <JournalCardAdmin key={j.id || j.journal_id} journal={j} />
              ))}
            </Row>
            <Pagination
              totalItems={filteredJournals.length}
              currentPage={currentPage}
              limit={limit}
              onPageChange={setCurrentPage}
              onLimitChange={setLimit}
              entityName="journals"
            />
          </div>
        )}

        {/* Add Journal Modal */}
        <AddJournalModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
        />
      </div>
    </AdminLayout>
  );
}
