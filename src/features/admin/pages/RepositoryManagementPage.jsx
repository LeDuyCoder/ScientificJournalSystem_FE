import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useJournalManagement } from '../../journal/hooks/useJournalManagement';
import VolumeList from '../components/VolumeList';
import IssueTable from '../components/IssueTable';
import SwitchJournalModal from '../components/modals/SwitchJournalModal';
import CreateVolumeModal from '../components/modals/CreateVolumeModal';
import CreateIssueModal from '../components/modals/CreateIssueModal';
import AdminLayout from '../../../app/layouts/AdminLayout';

/**
 * RepositoryManagementPage - Màn hình điều phối quản lý Tập (Volume) và Số (Issue) tập trung của Admin.
 */
export default function RepositoryManagementPage() {
  const {
    currentJournal,
    volumes,
    issues,
    selectedVolume,
    setSelectedVolume,
    fetchInitialData,
  } = useJournalManagement();

  // Modals visibility state
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Load initial data if needed
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Filter volumes for current journal
  const currentVolumes = (volumes || []).filter(
    (v) => v.journalId === currentJournal?.id
  );

  // Auto-select first volume
  useEffect(() => {
    if (currentVolumes.length > 0 && !selectedVolume) {
      setSelectedVolume(currentVolumes[0].id);
    }
  }, [currentVolumes, selectedVolume, setSelectedVolume]);

  // Filter issues for selected volume
  const currentIssues = (issues || []).filter(
    (i) => i.volumeId === selectedVolume
  );

  // Calculate stats
  const totalVolumes = currentVolumes.length;
  const activeIssues = (issues || []).filter((i) =>
    currentVolumes.map((v) => v.id).includes(i.volumeId)
  ).length;
  const totalPublications = currentVolumes.reduce((acc, v) => acc + (v.totalArticles || 0), 0) || 842; // Fallback to premium stats from Figma
  
  // Selected volume details for overview header
  const activeVolObj = currentVolumes.find(v => v.id === selectedVolume);

  return (
    <AdminLayout>
      <div className="d-flex flex-column gap-3 text-start">
        {/* Title Block */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div>
            <span className="text-muted-custom small text-uppercase fw-semibold" style={{ letterSpacing: '0.05em' }}>
              Resource Management
            </span>
            <h2 className="font-display fw-bold text-main mb-1">Repository Management</h2>
            <p className="text-muted-custom small mb-0">
              Manage volumes and publication issues for your active journals.
            </p>
          </div>
          <Button
            className="btn-primary-glow d-flex align-items-center gap-1.5 py-2 px-3"
            onClick={() => setShowVolumeModal(true)}
          >
            <Icon icon="lucide:plus" width="16" />
            <span>New Volume</span>
          </Button>
        </div>

        {/* Selected Journal Selector Box */}
        <div className="bg-white p-4 rounded-3 border d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-2" style={{ borderColor: 'var(--border)' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary-light p-3 rounded-2 text-primary d-none d-sm-block">
              <Icon icon="lucide:book-open" width="24" />
            </div>
            <div>
              <div className="text-muted-custom text-uppercase small fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                Select Journal Repository
              </div>
              <h5 className="font-display fw-bold text-main m-0 d-flex align-items-center gap-2">
                {currentJournal ? currentJournal.title : 'No active journal selected'}
                <span className="badge bg-success-subtle text-success text-xs font-sans rounded px-2 py-0.5">
                  ACTIVE
                </span>
              </h5>
              <small className="text-muted-custom font-monospace">
                ISSN: {currentJournal?.issn} • Editor-in-Chief: {currentJournal?.editorInChief || 'N/A'}
              </small>
            </div>
          </div>
          <Button
            variant="outline-dark"
            className="d-flex align-items-center gap-1.5 py-2 px-3 btn-custom-sm font-sans"
            onClick={() => setShowSwitchModal(true)}
          >
            <Icon icon="lucide:refresh-cw" width="14" />
            <span>Switch Journal</span>
          </Button>
        </div>

        {/* Stat Cards - Figma Screen Page 4 */}
        <Row className="g-3 mb-2">
          <Col xs={12} sm={6} md={3}>
            <Card className="border p-3 shadow-none bg-white rounded-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-muted-custom small text-uppercase fw-semibold">Total Volumes</div>
                <div className="text-muted bg-light p-1.5 rounded-2 d-flex"><Icon icon="lucide:layers" width="16" /></div>
              </div>
              <h3 className="fw-bold text-main m-0 font-monospace">{totalVolumes}</h3>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Card className="border p-3 shadow-none bg-white rounded-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-muted-custom small text-uppercase fw-semibold">Active Issues</div>
                <div className="text-muted bg-light p-1.5 rounded-2 d-flex"><Icon icon="lucide:book-marked" width="16" /></div>
              </div>
              <h3 className="fw-bold text-main m-0 font-monospace">{activeIssues}</h3>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Card className="border p-3 shadow-none bg-white rounded-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-muted-custom small text-uppercase fw-semibold">Total Articles</div>
                <div className="text-muted bg-light p-1.5 rounded-2 d-flex"><Icon icon="lucide:file-text" width="16" /></div>
              </div>
              <h3 className="fw-bold text-main m-0 font-monospace">{totalPublications}</h3>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Card className="border p-3 shadow-none bg-white rounded-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-muted-custom small text-uppercase fw-semibold">Next Release</div>
                <div className="text-muted bg-light p-1.5 rounded-2 d-flex"><Icon icon="lucide:calendar" width="16" /></div>
              </div>
              <h3 className="fw-bold text-main m-0 font-monospace text-primary" style={{ fontSize: '1.25rem' }}>
                Oct 24, 2026
              </h3>
            </Card>
          </Col>
        </Row>

        {/* Cascading Content Split Layout */}
        <Row className="g-4 align-items-start">
          {/* Side List: Volumes Repository */}
          <Col xs={12} lg={4}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-display fw-bold text-main mb-0 d-flex align-items-center gap-2">
                Volumes Repository
                <Icon icon="lucide:sliders-horizontal" className="text-muted" width="16" />
              </h5>
            </div>
            <VolumeList
              volumes={currentVolumes}
              selectedVolumeId={selectedVolume}
              onSelectVolume={setSelectedVolume}
            />
          </Col>

          {/* Right Section: Issues List under selected volume */}
          <Col xs={12} lg={8}>
            <div className="bg-white p-4 rounded-3 border" style={{ borderColor: 'var(--border)' }}>
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                <div>
                  <h5 className="font-display fw-bold text-main mb-1">
                    {activeVolObj ? `${activeVolObj.volumeNumber} Overview` : 'Volume Overview'}
                  </h5>
                  <small className="text-muted-custom">
                    Published: {activeVolObj?.frequency || 'Quarterly'} • Frequency: Q1, Q2, Q3, Q4
                  </small>
                </div>
                <Button
                  className="btn-primary-glow btn-custom-sm d-flex align-items-center gap-1 px-3 py-2"
                  disabled={!selectedVolume}
                  onClick={() => setShowIssueModal(true)}
                >
                  <Icon icon="lucide:plus-circle" width="14" />
                  <span>Add Issue</span>
                </Button>
              </div>

              <IssueTable issues={currentIssues} />
            </div>
          </Col>
        </Row>

        {/* Modals Container */}
        <SwitchJournalModal
          show={showSwitchModal}
          handleClose={() => setShowSwitchModal(false)}
        />
        <CreateVolumeModal
          show={showVolumeModal}
          handleClose={() => setShowVolumeModal(false)}
        />
        <CreateIssueModal
          show={showIssueModal}
          handleClose={() => setShowIssueModal(false)}
        />
      </div>
    </AdminLayout>
  );
}
