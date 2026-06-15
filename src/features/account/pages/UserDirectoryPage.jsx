import React, { useState } from 'react';
import { Row, Col, Card, ProgressBar, Button, Pagination, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../../shared/components/Icon';
import UserTable from '../components/UserTable';
import UserFilterBar from '../components/UserFilterBar';
import PendingRequestCard from '../components/PendingRequestCard';
import { useAdminStore } from '../../../app/store/adminStore';
import ROUTES from '../../../app/routes/routePaths';

/**
 * UserDirectoryPage Component
 * Renders the administrator's account directory page (Page 3).
 */
export default function UserDirectoryPage() {
  const navigate = useNavigate();
  const { users, pendingRequests, approveRequest, declineRequest, deleteUser } = useAdminStore();

  // Search and filter states
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Match the mockup showing "Showing 1 to 3 of 28 users"

  /**
   * Filter users list based on criteria.
   */
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate paging indexes
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  /**
   * Handle pagination click.
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Handle Approve button click.
   */
  const handleApprove = (id) => {
    approveRequest(id);
    alert('Approved role request successfully!');
  };

  /**
   * Handle Decline button click.
   */
  const handleDecline = (id) => {
    declineRequest(id);
    alert('Declined role request successfully.');
  };

  return (
    <div className="container-fluid py-2">
      {/* Page Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb text-muted-custom small mb-0">
          <li className="breadcrumb-item">Management</li>
          <li className="breadcrumb-item active" aria-current="page">User Directory</li>
        </ol>
      </nav>

      {/* Main Header title & actions section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h1 className="font-display fw-bold text-main mb-1" style={{ fontSize: '1.8rem' }}>User Directory</h1>
          <p className="text-muted-custom small mb-0" style={{ maxWidth: '680px' }}>
            Manage platform contributors, their access levels, and account status within the ResearchPulse ecosystem.
          </p>
        </div>
        
        {/* Submit New Account button (leads to Page 17) - Sử dụng hằng số định tuyến */}
        <Button 
          onClick={() => navigate(ROUTES.ADMIN_USERS_CREATE)}
          className="btn-primary-glow border-0 d-flex align-items-center gap-2 rounded-pill px-4 py-2"
          style={{ fontSize: '0.88rem' }}
        >
          <Icon icon="lucide:plus-circle" width="18" />
          <span>Submit New Account</span>
        </Button>
      </div>

      <Row className="g-4">
        {/* Left column: User filter bar and User Table */}
        <Col xs={12} lg={8.5} className="col-lg-8">
          <Card className="p-4 rounded-4 border bg-white shadow-sm">
            {/* Filter controls */}
            <UserFilterBar 
              search={search}
              onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
              selectedRole={selectedRole}
              onRoleChange={(val) => { setSelectedRole(val); setCurrentPage(1); }}
              selectedStatus={selectedStatus}
              onStatusChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
              totalCount={totalItems}
            />

            {/* User Directory Table grid - Sử dụng hằng số định tuyến có tham số ID */}
            <UserTable 
              users={currentItems}
              onEdit={(id) => navigate(ROUTES.ADMIN_USERS_EDIT.replace(':id', id))}
              onDelete={deleteUser}
            />

            {/* Pagination Controls matching style in mockup */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4 pt-2">
                <span className="text-muted-custom small">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} users
                </span>
                
                <Pagination size="sm" className="mb-0 gap-1 pagination-custom">
                  <Pagination.Prev 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="border-0 bg-transparent text-muted"
                  />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item 
                      key={i + 1} 
                      active={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      style={{
                        '--bs-pagination-active-bg': 'var(--primary)',
                        '--bs-pagination-active-border-color': 'var(--primary)',
                        '--bs-pagination-color': 'var(--text-main)',
                      }}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="border-0 bg-transparent text-muted"
                  />
                </Pagination>
              </div>
            )}
          </Card>
        </Col>

        {/* Right column: Access Control and Pending Requests widgets */}
        <Col xs={12} lg={3.5} className="col-lg-4 d-flex flex-column gap-4">
          {/* Access Control Information box */}
          <Card 
            className="p-4 rounded-4 border-0 text-white"
            style={{
              background: 'linear-gradient(135deg, #ff7a33 0%, #ea580c 100%)',
              boxShadow: '0 4px 20px rgba(234, 88, 12, 0.15)'
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2.5">
              <Icon icon="lucide:shield-check" width="22" className="text-white" />
              <h5 className="fw-bold mb-0" style={{ fontSize: '1.05rem', letterSpacing: '-0.01em' }}>Access Control</h5>
            </div>
            <p className="mb-4 text-white-50 small lh-sm">
              Review system permissions and security logs for auditing purposes. Maintain strict compliance across all journal volumes.
            </p>
            <a 
              href="#security" 
              onClick={(e) => { e.preventDefault(); alert('Redirecting to Security Logs Overview...'); }}
              className="text-white fw-semibold small text-decoration-none d-flex align-items-center gap-1.5 hover-white-glow"
            >
              <span>Security Overview</span>
              <Icon icon="lucide:arrow-right" width="16" />
            </a>
          </Card>

          {/* Pending Requests Sidebar Widget */}
          <Card className="p-4 rounded-4 border bg-white shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3.5">
              <div className="d-flex align-items-center gap-2">
                <h6 className="fw-bold text-main mb-0" style={{ fontSize: '0.925rem' }}>PENDING REQUESTS</h6>
                {pendingRequests.length > 0 && (
                  <Badge className="bg-danger rounded-circle d-flex align-items-center justify-content-center px-1" style={{ minWidth: '18px', height: '18px', fontSize: '0.68rem' }}>
                    {pendingRequests.length}
                  </Badge>
                )}
              </div>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-4 text-muted-custom small">
                <Icon icon="lucide:check-circle-2" width="32" className="text-success mb-2 opacity-50" />
                <p className="mb-0">All clear! No pending requests.</p>
              </div>
            ) : (
              <div>
                {pendingRequests.map((req) => (
                  <PendingRequestCard 
                    key={req.id} 
                    request={req}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                  />
                ))}

                <button 
                  type="button"
                  onClick={() => alert('Viewing all authorization request queues...')}
                  className="btn btn-link w-100 p-0 text-center text-decoration-none text-muted-custom hover-primary small fw-semibold pt-1 border-top mt-2"
                  style={{ fontSize: '0.8rem' }}
                >
                  View All Requests
                </button>
              </div>
            )}
          </Card>

          {/* Platform Health indicators widget */}
          <Card className="p-4 rounded-4 border bg-white shadow-sm">
            <h6 className="fw-bold text-main mb-3 text-uppercase tracking-wider" style={{ fontSize: '0.78rem' }}>
              Platform Health
            </h6>
            
            {/* Storage indicator */}
            <div className="mb-3.5">
              <div className="d-flex justify-content-between small text-muted-custom mb-1.5" style={{ fontSize: '0.825rem' }}>
                <span>Storage Capacity</span>
                <strong className="text-main fw-semibold">78%</strong>
              </div>
              <ProgressBar now={78} variant="warning" style={{ height: '5px' }} />
            </div>

            {/* Active Authors indicator */}
            <div>
              <div className="d-flex justify-content-between small text-muted-custom mb-1.5" style={{ fontSize: '0.825rem' }}>
                <span>Active Authors</span>
                <strong className="text-main fw-semibold">1.2k</strong>
              </div>
              <ProgressBar now={55} style={{ height: '5px', backgroundColor: '#e2e8f0', '--bs-progress-bar-bg': 'var(--btn-dark)' }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
