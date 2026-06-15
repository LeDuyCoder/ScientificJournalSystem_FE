import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useJournalManagement } from '../../journal/hooks/useJournalManagement';
import Pagination from '../components/Pagination';
import SwitchJournalModal from '../components/modals/SwitchJournalModal';
import AdminLayout from '../../../app/layouts/AdminLayout';

/**
 * VolumeArchivePage - Màn hình Lưu trữ các Tập (Volume Archive) của Tạp chí đang chọn (Figma Screen Page 10).
 */
export default function VolumeArchivePage() {
  const navigate = useNavigate();
  const {
    currentJournal,
    volumes,
    setSelectedVolume,
    fetchInitialData
  } = useJournalManagement();

  // Dynamic route base path detection
  const isPreview = window.location.pathname.startsWith('/admin-preview');
  const basePath = isPreview ? '/admin-preview' : '/admin';

  // State filters & sort
  const [search, setSearch] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(6); // 6 cards per page fits nicely in a 3-column grid

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, frequencyFilter, sortBy]);

  // Filter volumes for current journal
  const currentVolumes = (volumes || []).filter(
    (v) => v.journalId === currentJournal?.id
  );

  // Apply search & filter & sort
  const filteredVolumes = currentVolumes
    .filter((vol) => {
      const volNum = vol.volumeNumber || '';
      const freq = vol.frequency || '';

      const matchesSearch = volNum.toLowerCase().includes(search.toLowerCase());
      const matchesFreq = frequencyFilter === 'All' || freq === frequencyFilter;

      return matchesSearch && matchesFreq;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.publicationYear - a.publicationYear;
      } else {
        return a.publicationYear - b.publicationYear;
      }
    });

  // Calculate paginated volumes
  const paginatedVolumes = filteredVolumes.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handleViewDetails = (volumeId) => {
    // Set selected volume in store and navigate to Repository Management
    setSelectedVolume(volumeId);
    navigate(`${basePath}/journals/repository`);
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-column gap-3 text-start">
        {/* Breadcrumb */}
        <div>
          <div className="admin-breadcrumb mb-2">
            <span className="cursor-pointer text-muted-custom" onClick={() => navigate(`${basePath}/journals/repository`)}>
              Repository
            </span>
            <Icon icon="lucide:chevron-right" className="mx-1" />
            <span className="admin-breadcrumb__current">Volume Archive</span>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h2 className="font-display fw-bold text-main mb-1">Volume Archive</h2>
              <p className="text-muted-custom small mb-0">
                Explore the historical collection of published volumes and issue logs for{' '}
                <span className="fw-semibold text-main">{currentJournal?.title}</span>.
              </p>
            </div>
            <Button
              variant="outline-dark"
              className="d-flex align-items-center gap-1.5 py-2 px-3 btn-custom-sm font-sans"
              onClick={() => setShowSwitchModal(true)}
            >
              <Icon icon="lucide:refresh-cw" width="14" />
              <span>Change Journal</span>
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3 border mb-2 mt-2" style={{ borderColor: 'var(--border)' }}>
          <Row className="align-items-end g-3">
            {/* Search by Volume number */}
            <Col xs={12} md={5}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main text-uppercase mb-2" style={{ letterSpacing: '0.05em' }}>
                  Search Volumes
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: 'var(--bg-chip)', borderColor: 'var(--border)' }}>
                    <Icon icon="lucide:search" width="16" className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by volume number (e.g. Volume 1)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-chip)', borderColor: 'var(--border)', fontSize: '0.9rem' }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Filter by Frequency */}
            <Col xs={12} sm={6} md={3.5}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main text-uppercase mb-2" style={{ letterSpacing: '0.05em' }}>
                  Publication Period
                </Form.Label>
                <Form.Select
                  value={frequencyFilter}
                  onChange={(e) => setFrequencyFilter(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-chip)', borderColor: 'var(--border)', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  <option value="All">All Periods</option>
                  <option value="Quarterly">Quarterly (Hàng quý)</option>
                  <option value="Bi-annual">Bi-annual (Nửa năm)</option>
                  <option value="Annual">Annual (Hàng năm)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Sort by Year */}
            <Col xs={12} sm={6} md={3.5}>
              <Form.Group>
                <Form.Label className="fw-medium small text-main text-uppercase mb-2" style={{ letterSpacing: '0.05em' }}>
                  Sort Order
                </Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-chip)', borderColor: 'var(--border)', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  <option value="newest">Newest to Oldest</option>
                  <option value="oldest">Oldest to Newest</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Volumes Grid */}
        {filteredVolumes.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 border" style={{ borderColor: 'var(--border)' }}>
            <Icon icon="lucide:archive-x" width="48" className="text-muted-custom mb-3" />
            <p className="text-muted-custom mb-0">No volumes found matching the search criteria.</p>
          </div>
        ) : (
          <div>
            <Row className="g-4 mb-4">
              {paginatedVolumes.map((vol) => (
                <Col xs={12} md={6} lg={4} key={vol.id}>
                  <Card className="journal-dark-card h-100 shadow-sm border-1 transition-hover">
                    <Card.Body className="d-flex flex-column p-4">
                      
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="badge bg-dark text-white px-2.5 py-1 text-uppercase small font-monospace">
                          YEAR: {vol.publicationYear}
                        </span>
                        <span className="badge bg-primary-light text-primary px-2.5 py-1 text-uppercase small">
                          {vol.frequency || 'Quarterly'}
                        </span>
                      </div>

                      <Card.Title className="font-display fw-bold text-main mb-2 h4">
                        {vol.volumeNumber}
                      </Card.Title>

                      <p className="text-muted-custom small mb-4 line-clamp-2">
                        {vol.description || 'No description or internal notes configured for this volume.'}
                      </p>

                      <div className="bg-light p-3 rounded-3 mb-4 mt-auto" style={{ backgroundColor: 'var(--bg-chip)' }}>
                        <Row className="g-2 text-center">
                          <Col xs={6} className="border-end" style={{ borderColor: 'var(--border)' }}>
                            <div className="text-muted-custom text-uppercase small" style={{ fontSize: '0.65rem' }}>Total Issues</div>
                            <div className="fw-bold text-main font-monospace h5 m-0 mt-0.5">{vol.totalIssues || 0}</div>
                          </Col>
                          <Col xs={6}>
                            <div className="text-muted-custom text-uppercase small" style={{ fontSize: '0.65rem' }}>Total Articles</div>
                            <div className="fw-bold text-main font-monospace h5 m-0 mt-0.5">{vol.totalArticles || 0}</div>
                          </Col>
                        </Row>
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-2 pt-3 border-top mt-auto" style={{ borderColor: 'var(--border)' }}>
                        <Button 
                          variant="light" 
                          className="w-100 text-main btn-custom-sm d-flex align-items-center justify-content-center gap-1.5 py-2"
                          onClick={() => handleViewDetails(vol.id)}
                        >
                          <Icon icon="lucide:eye" width="14" />
                          <span>View Details</span>
                        </Button>
                        <Button 
                          variant="outline-dark" 
                          className="btn-custom-sm d-flex align-items-center justify-content-center p-2 rounded-2"
                          title="Export Volume Metadata"
                          onClick={() => alert(`Exporting metadata for ${vol.volumeNumber}...`)}
                        >
                          <Icon icon="lucide:download" width="16" />
                        </Button>
                      </div>

                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination Controls */}
            <Pagination
              totalItems={filteredVolumes.length}
              currentPage={currentPage}
              limit={limit}
              onPageChange={setCurrentPage}
              entityName="volumes"
            />
          </div>
        )}

        {/* Switch Journal Modal */}
        <SwitchJournalModal
          show={showSwitchModal}
          handleClose={() => setShowSwitchModal(false)}
        />
      </div>
    </AdminLayout>
  );
}
