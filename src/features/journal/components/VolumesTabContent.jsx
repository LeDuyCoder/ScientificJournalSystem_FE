import React, { useState } from 'react';
import { Button, Spinner, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';

export default function VolumesTabContent({
  volumes = [],
  issuesByVolume = {},
  onVolumeExpand,
  loading
}) {
  const [expandedVolumes, setExpandedVolumes] = useState({});

  const toggleVolume = (volumeId) => {
    const isNowExpanded = !expandedVolumes[volumeId];
    setExpandedVolumes(prev => ({ ...prev, [volumeId]: isNowExpanded }));
    
    if (isNowExpanded && onVolumeExpand) {
      onVolumeExpand(volumeId);
    }
  };

  if (loading) {
    return (
      <div className="journal-dark-card p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="mb-3 p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <LoadingSkeleton width="200px" height="24px" className="mb-2" />
            <LoadingSkeleton width="120px" height="16px" />
          </div>
        ))}
      </div>
    );
  }

  if (!volumes || volumes.length === 0) {
    return (
      <div className="journal-dark-card p-5 text-center text-secondary">
        Journal này chưa có dữ liệu volume.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {volumes.map((vol) => {
        const isExpanded = !!expandedVolumes[vol.id];
        const issues = issuesByVolume[vol.id];
        
        return (
          <div 
            key={vol.id} 
            className="journal-dark-card overflow-hidden" 
            style={{ 
              backgroundColor: 'rgba(14, 19, 34, 0.5)',
              transition: 'all 0.2s ease',
              border: isExpanded ? '1px solid rgba(0, 210, 255, 0.2)' : '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {/* Volume Title Header */}
            <div 
              className="p-3 d-flex align-items-center justify-content-between" 
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => toggleVolume(vol.id)}
            >
              <div className="d-flex align-items-center gap-3">
                <Icon 
                  icon={isExpanded ? 'lucide:folder-open' : 'lucide:folder'} 
                  className={isExpanded ? 'text-info' : 'text-secondary'}
                  width="20" 
                />
                <span className="text-white fw-bold font-display" style={{ fontSize: '1.05rem' }}>
                  Volume {vol.volume_number} <span className="text-secondary fw-normal">· {vol.year}</span>
                </span>
              </div>
              <Button 
                variant="link" 
                className="text-secondary p-0 d-flex align-items-center"
                style={{ textDecoration: 'none' }}
              >
                <Icon 
                  icon={isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  width="20" 
                />
              </Button>
            </div>

            {/* Volume Body (Nested Issues) */}
            {isExpanded && (
              <div className="px-4 pb-3 pt-1 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.04) !important', backgroundColor: 'rgba(9, 13, 22, 0.3)' }}>
                {issues === undefined ? (
                  <div className="d-flex align-items-center gap-2 py-3 text-secondary" style={{ fontSize: '0.9rem' }}>
                    <Spinner animation="border" size="sm" variant="info" />
                    Đang tải danh sách issue...
                  </div>
                ) : !issues || issues.length === 0 ? (
                  <div className="text-secondary py-3 text-start" style={{ fontSize: '0.9rem' }}>
                    Volume này chưa có issue.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2 py-2">
                    {issues.map((issue) => (
                      <div 
                        key={issue.id} 
                        className="d-flex align-items-center justify-content-between p-2 rounded hover-dark-row"
                        style={{ borderLeft: '2px solid rgba(0, 210, 255, 0.25)', backgroundColor: 'rgba(255,255,255,0.01)', paddingLeft: '12px' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <Icon icon="lucide:file-stack" className="text-info" width="16" />
                          <span className="text-white-50 font-display" style={{ fontSize: '0.95rem' }}>
                            Issue {issue.issue_number} <span className="text-muted" style={{ fontSize: '0.85rem' }}>({issue.year})</span>
                          </span>
                        </div>
                        {issue.article_count !== undefined && (
                          <Badge bg="dark" className="text-secondary-50 px-2 py-1" style={{ fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            {issue.article_count} bài báo
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
