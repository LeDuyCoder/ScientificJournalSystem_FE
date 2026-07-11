import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { EntityCard } from '../../../shared/components/Card';
const ProjectCard = ({
  project,
  onDelete,
  onRestore,
  isRecent = false,
  currentUser = null
}) => {
  const { t } = useTranslation();
  const handleDelete = e => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(project.project_id || project.id);
  };
  const handleRestore = e => {
    e.preventDefault();
    e.stopPropagation();
    if (onRestore) onRestore(project.project_id || project.id);
  };
  const title = project.title || 'Untitled Project';
  const areaName = project.subject_area?.name || project.subject_area || t("project.chuaXacDinhLinhVuc");
  const createdAt = project.created_at ? new Date(project.created_at).toLocaleDateString('vi-VN') : 'N/A';

  // Try to find counts
  const keywordCount = project.keywords_count || project.watch_keywords?.length || 0;

  const getInitials = (first, last, email) => {
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
  };

  const renderAvatarGroup = () => {
    const owner = project.owner;
    const members = project.members || [];
    const allUsers = [];
    if (owner) allUsers.push({ ...owner, isOwner: true });
    members.forEach(m => allUsers.push(m));

    if (allUsers.length === 0) return null;

    const maxDisplay = 3;
    const displayUsers = allUsers.slice(0, maxDisplay);
    const extraCount = allUsers.length - maxDisplay;

    return (
      <div className="d-flex align-items-center">
        {displayUsers.map((u, idx) => (
          <div 
            key={idx} 
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
            style={{
              width: '26px', height: '26px', fontSize: '10px',
              backgroundColor: u.isOwner ? '#ff7a33' : '#6b7280',
              marginLeft: idx > 0 ? '-8px' : '0',
              border: '2px solid white',
              zIndex: 10 - idx
            }}
            title={`${u.first_name || ''} ${u.last_name || ''} ${u.isOwner ? '(Owner)' : ''}`}
          >
            {getInitials(u.first_name, u.last_name, u.email)}
          </div>
        ))}
        {extraCount > 0 && (
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center text-secondary fw-medium shadow-sm bg-light"
            style={{
              width: '26px', height: '26px', fontSize: '10px',
              marginLeft: '-8px',
              border: '2px solid white',
              zIndex: 0
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    );
  };
  const handleCardClick = () => {
    try {
      const storageKey = 'recently_viewed_projects';
      const raw = localStorage.getItem(storageKey);
      let list = raw ? JSON.parse(raw) : [];
      const projectId = project.project_id || project.id;
      list = list.filter(id => id !== projectId);
      list.unshift(projectId);
      list = list.slice(0, 3); // Giới hạn tối đa 3 dự án xem gần nhất
      localStorage.setItem(storageKey, JSON.stringify(list));
    } catch (e) {
      console.error(t("project.loiLuuDuAnXemGanDay"), e);
    }
  };
  if (isRecent) {
    return <Link to={`/projects/${project.project_id || project.id}`} className="text-decoration-none h-100 d-block" onClick={handleCardClick}>
        <div className="glass-card rounded-4 border shadow-sm p-3 h-100 d-flex align-items-center gap-3 project-card-recent-hover">
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{
          width: '46px',
          height: '46px',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)'
        }}>
            <Icon icon="lucide:folder-open" width="22" />
          </div>
          <div className="flex-grow-1 min-w-0" style={{
          minWidth: 0
        }}>
            <h6 className="fw-bold text-main mb-1 text-truncate">{title}</h6>
            <div className="d-flex align-items-center gap-2 text-truncate">
              <span className="badge fw-medium text-truncate" style={{
              fontSize: '0.65rem',
              backgroundColor: 'var(--bg-chip)',
              color: 'var(--text-muted)'
            }}>
                {areaName}
              </span>
              <span className="text-muted-custom small flex-shrink-0">• {createdAt}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-muted-custom recent-arrow-icon">
            <Icon icon="lucide:chevron-right" width="20" />
          </div>
        </div>
      </Link>;
  }
  const meta = <span className="badge rounded-pill fw-medium" style={{
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)'
  }}>
      {areaName}
    </span>;
  const isDeleted = project.status === 'DELETED';
  
  // Kiểm tra quyền owner
  const isOwner = currentUser && (
    (project.user_id && project.user_id === currentUser.id) || 
    (project.owner && project.owner.user_id === currentUser.id) ||
    (project.owner_id && project.owner_id === currentUser.id)
  );

  const actions = isOwner ? (isDeleted ? (
    <button className="btn btn-sm btn-link text-success p-0 ms-2 hover-primary" onClick={handleRestore} title="Khôi phục dự án">
      <Icon icon="lucide:refresh-cw" width="18" />
    </button>
  ) : (
    <button className="btn btn-sm btn-link text-muted p-0 ms-2 hover-danger" onClick={handleDelete} title={t("project.xoaDuAn")}>
      <Icon icon="lucide:trash-2" width="18" />
    </button>
  )) : null;
  const description = keywordCount > 0 ? <div>
      <span className="text-muted-custom small d-block mb-1">{t("project.tuKhoaTheoDoi")}{keywordCount}):</span>
      <div className="d-flex flex-wrap gap-1">
        {project.watch_keywords?.slice(0, 3).map((kw, idx) => <span key={idx} className="badge bg-light text-muted border fw-normal" style={{
        fontSize: '0.75rem'
      }}>
            {kw.keyword || kw}
          </span>)}
        {keywordCount > 3 && <span className="badge bg-light text-muted border fw-normal" style={{
        fontSize: '0.75rem'
      }}>
            +{keywordCount - 3}
          </span>}
      </div>
    </div> : null;
  const footer = <div className="d-flex justify-content-between align-items-center w-100 mt-2">
      <div className="d-flex align-items-center gap-2">
        {renderAvatarGroup()}
        <div className="d-flex flex-column justify-content-center" style={{ lineHeight: '1.2' }}>
          <span className="text-muted-custom" style={{ fontSize: '0.7rem' }}>
            Tạo bởi <span className="fw-semibold text-main">{project.owner?.last_name || 'Admin'}</span>
          </span>
          <span className="text-muted-custom" style={{ fontSize: '0.65rem' }}>{createdAt}</span>
        </div>
      </div>
      <span className="small fw-medium d-flex align-items-center gap-1 mt-1" style={{
      color: 'var(--primary)'
    }}>{t("article.chiTiet1")}<Icon icon="lucide:arrow-right" width="14" />
      </span>
    </div>;
  return <Link to={`/projects/${project.project_id || project.id}`} className="text-decoration-none h-100 d-block" onClick={handleCardClick}>
      <EntityCard className="h-100" title={title} meta={meta} actions={actions} description={description} footer={footer} bodyClassName="flex-column align-items-stretch" />
    </Link>;
};
export default ProjectCard;