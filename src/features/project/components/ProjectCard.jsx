import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { EntityCard } from '../../../shared/components/Card';


const ProjectCard = ({ project, onDelete, isRecent = false }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa dự án này? Hành động này không thể hoàn tác.')) {
      onDelete(project.project_id || project.id);
    }
  };

  const title = project.title || 'Untitled Project';
  const areaName = project.subject_area?.name || project.subject_area || 'Chưa xác định lĩnh vực';
  const createdAt = project.created_at ? new Date(project.created_at).toLocaleDateString('vi-VN') : 'N/A';
  
  // Try to find counts
  const keywordCount = project.keywords_count || project.watch_keywords?.length || 0;

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
      console.error('Lỗi lưu dự án xem gần đây:', e);
    }
  };

  if (isRecent) {
    return (
      <Link 
        to={`/projects/${project.project_id || project.id}`} 
        className="text-decoration-none h-100 d-block"
        onClick={handleCardClick}
      >
        <div className="glass-card rounded-4 border shadow-sm p-3 h-100 d-flex align-items-center gap-3 project-card-recent-hover">
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '46px', height: '46px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Icon icon="lucide:folder-open" width="22" />
          </div>
          <div className="flex-grow-1 min-w-0" style={{ minWidth: 0 }}>
            <h6 className="fw-bold text-main mb-1 text-truncate">{title}</h6>
            <div className="d-flex align-items-center gap-2 text-truncate">
              <span className="badge fw-medium text-truncate" style={{ fontSize: '0.65rem', backgroundColor: 'var(--bg-chip)', color: 'var(--text-muted)' }}>
                {areaName}
              </span>
              <span className="text-muted-custom small flex-shrink-0">• {createdAt}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-muted-custom recent-arrow-icon">
            <Icon icon="lucide:chevron-right" width="20" />
          </div>
        </div>
      </Link>
    );
  }

  const meta = (
    <span className="badge rounded-pill fw-medium" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
      {areaName}
    </span>
  );

  const actions = (
    <button 
      className="btn btn-sm btn-link text-muted p-0 ms-2 hover-danger" 
      onClick={handleDelete}
      title="Xóa dự án"
    >
      <Icon icon="lucide:trash-2" width="18" />
    </button>
  );

  const description = keywordCount > 0 ? (
    <div>
      <span className="text-muted-custom small d-block mb-1">Từ khóa theo dõi ({keywordCount}):</span>
      <div className="d-flex flex-wrap gap-1">
        {project.watch_keywords?.slice(0, 3).map((kw, idx) => (
          <span key={idx} className="badge bg-light text-muted border fw-normal" style={{ fontSize: '0.75rem' }}>
            {kw.keyword || kw}
          </span>
        ))}
        {keywordCount > 3 && (
          <span className="badge bg-light text-muted border fw-normal" style={{ fontSize: '0.75rem' }}>
            +{keywordCount - 3}
          </span>
        )}
      </div>
    </div>
  ) : null;

  const footer = (
    <div className="d-flex justify-content-between align-items-center w-100">
      <span className="text-muted-custom small">
        Cập nhật: {createdAt}
      </span>
      <span className="small fw-medium d-flex align-items-center gap-1" style={{ color: 'var(--primary)' }}>
        Chi tiết <Icon icon="lucide:arrow-right" width="14" />
      </span>
    </div>
  );

  return (
    <Link 
      to={`/projects/${project.project_id || project.id}`} 
      className="text-decoration-none h-100 d-block"
      onClick={handleCardClick}
    >
      <EntityCard
        className="h-100"
        title={title}
        meta={meta}
        actions={actions}
        description={description}
        footer={footer}
        bodyClassName="flex-column align-items-stretch"
      />
    </Link>
  );
};

export default ProjectCard;
