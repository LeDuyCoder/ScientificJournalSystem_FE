import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { Dropdown } from 'react-bootstrap';

const ProjectMembersList = ({ 
  members, 
  loading, 
  onInviteClick, 
  onChangeRole, 
  onRemoveMember,
  actionLoading,
  currentUser
}) => {
  const { t } = useTranslation();

  const getRoleBadgeColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return { bg: '#fee2e2', color: '#dc2626' }; // red
      case 'ADMIN': return { bg: '#e0e7ff', color: '#4f46e5' }; // indigo
      case 'MEMBER': return { bg: '#dcfce7', color: '#16a34a' }; // green
      case 'VIEWER': return { bg: '#f1f5f9', color: '#64748b' }; // slate
      default: return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  const translateRole = (role) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return t('project.chuSoHuu', 'Chủ sở hữu');
      case 'ADMIN': return t('project.quanTriVien', 'Quản trị viên');
      case 'MEMBER': return t('project.thanhVien', 'Thành viên');
      case 'VIEWER': return t('project.nguoiXem', 'Người xem');
      default: return role || 'MEMBER';
    }
  };

  const getStatusBadge = (status) => {
      if (status?.toUpperCase() === 'INVITED') {
      return (
        <span className="badge rounded-pill fw-medium px-2 py-1" style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.75rem' }}>
          {t("project.daMoi")}
        </span>
      );
    }
    return (
      <span className="badge rounded-pill fw-medium px-2 py-1" style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '0.75rem' }}>
        {t("project.dangHoatDong")}
      </span>
    );
  };

  const currentUserMember = members?.find(m => 
    (m.user_id && m.user_id === currentUser?.id) || 
    (m.id && m.id === currentUser?.id) || 
    (m.user_id && m.user_id === currentUser?.user_id) || 
    (m.id && m.id === currentUser?.user_id)
  );
  const currentUserRole = currentUserMember?.role?.toUpperCase() || 'VIEWER';
  const canManageOthers = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  return (
    <div className="glass-card rounded-4 shadow-sm border p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold text-main mb-1">{t("project.thanhVienDuAn")}</h5>
          <p className="text-muted-custom small mb-0">{t("project.quanLyNhungNguoiCoQuyen")}</p>
        </div>
        {canManageOthers && (
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2"
            onClick={onInviteClick}
            style={{ borderRadius: '12px', fontWeight: 500 }}
          >
            <Icon icon="lucide:user-plus" width="18" /> {t("project.themThanhVien")}
          </button>
        )}
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : members?.length === 0 ? (
        <div className="text-center py-5 text-muted-custom">
          <Icon icon="lucide:users" width="48" className="mb-3 opacity-50" />
          <p className="mb-0">{t("project.duAnNayChuaCoThanhVien")}</p>
        </div>
      ) : (
        <div className="list-group list-group-flush border-top pt-2">
          {members?.map((member) => {
            const roleStyle = getRoleBadgeColor(member.role);
            
            return (
              <div key={member.id || member.user_id} className="list-group-item bg-transparent px-0 py-3 border-bottom d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    {(member.user?.full_name?.charAt(0) || member.first_name?.charAt(0) || member.user?.email?.charAt(0) || member.email?.charAt(0) || 'U').toUpperCase()}
                  </div>
                  <div>
                    <h6 className="fw-bold text-main mb-0 d-flex align-items-center gap-2">
                      {member.user?.full_name || member.name || t("project.nguoiDung")} 
                      {getStatusBadge(member.status)}
                    </h6>
                    <div className="text-muted-custom small mt-1">
                      {member.user?.email || member.email}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="badge fw-medium px-2 py-1" style={{ 
                    backgroundColor: roleStyle.bg, 
                    color: roleStyle.color,
                    border: 'none'
                  }}>
                    {translateRole(member.role)}
                  </span>
                  {(() => {
                    const isSelf = 
                      (member.user_id && member.user_id === currentUser?.id) || 
                      (member.id && member.id === currentUser?.id) ||
                      (member.user_id && member.user_id === currentUser?.user_id) || 
                      (member.id && member.id === currentUser?.user_id);
                    
                    const isOwner = member.role?.toUpperCase() === 'OWNER';
                    
                    if (isOwner) return null; // Owner cannot be kicked/leave via this list
                    
                    if (isSelf) {
                      // Bản thân có thể tự rời đi
                      return (
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="light" 
                            className="btn-sm border-0 bg-transparent text-muted-custom" 
                            id={`dropdown-${member.id || member.user_id}`}
                            disabled={actionLoading}
                          >
                            <Icon icon="lucide:more-vertical" width="18" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end" className="shadow border-0 rounded-3">
                            <Dropdown.Item 
                              onClick={() => onRemoveMember(member.user_id)}
                              className="small text-danger dropdown-item-custom-hover"
                            >
                              <Icon icon="lucide:log-out" width="16" className="me-2" /> 
                              {t("project.roiKhoiDuAn", "Rời khỏi dự án")}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      );
                    }

                    if (canManageOthers) {
                      // Có quyền quản lý người khác
                      return (
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="light" 
                            className="btn-sm border-0 bg-transparent text-muted-custom" 
                            id={`dropdown-${member.id || member.user_id}`}
                            disabled={actionLoading}
                          >
                            <Icon icon="lucide:more-vertical" width="18" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end" className="shadow border-0 rounded-3">
                            <Dropdown.Item 
                              onClick={() => onChangeRole(member.user_id, 'ADMIN')}
                              className="small dropdown-item-custom-hover"
                            >
                              <Icon icon="lucide:shield" width="16" className="me-2" /> {t("project.datLamAdmin")}
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => onChangeRole(member.user_id, 'MEMBER')}
                              className="small dropdown-item-custom-hover"
                            >
                              <Icon icon="lucide:user" width="16" className="me-2" /> {t("project.datLamMember")}
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => onChangeRole(member.user_id, 'VIEWER')}
                              className="small dropdown-item-custom-hover"
                            >
                              <Icon icon="lucide:eye" width="16" className="me-2" /> {t("project.datLamViewer")}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              onClick={() => onRemoveMember(member.user_id)}
                              className="small text-danger dropdown-item-custom-hover"
                            >
                              <Icon icon="lucide:user-x" width="16" className="me-2" /> 
                              {member.status?.toUpperCase() === 'INVITED' ? t("project.huyLoiMoi") : t("project.xoaThanhVien")}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      );
                    }

                    return null;
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectMembersList;
