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
      <div 
        className="journal-dark-card p-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
      >
        {[1, 2, 3].map(i => (
          <div key={i} className="mb-3 p-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <LoadingSkeleton width="200px" height="24px" className="mb-2" />
            <LoadingSkeleton width="120px" height="16px" />
          </div>
        ))}
      </div>
    );
  }

  if (!volumes || volumes.length === 0) {
    return (
      <div 
        className="journal-dark-card p-5 text-center text-muted-custom"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
      >
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
              borderRadius: '12px',
              backgroundColor: 'var(--bg-card)',
              transition: 'all 0.2s ease',
              border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border)'
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
                  className={isExpanded ? 'text-primary' : 'text-muted-custom'}
                  width="20" 
                />
                <span className="text-main fw-bold font-display" style={{ fontSize: '1.05rem' }}>
                  Volume {vol.volume_number} <span className="text-muted-custom fw-normal">· {vol.year}</span>
                </span>
              </div>
              <Button 
                variant="link" 
                className="text-muted-custom p-0 d-flex align-items-center"
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
              <div 
                className="px-4 pb-3 pt-1 border-top" 
                style={{ 
                  borderColor: 'var(--border) !important', 
                  backgroundColor: 'var(--bg-main)' 
                }}
              >
                {issues === undefined ? (
                  <div className="d-flex align-items-center gap-2 py-3 text-muted-custom" style={{ fontSize: '0.9rem' }}>
                    <Spinner animation="border" size="sm" variant="primary" />
                    Đang tải danh sách issue...
                  </div>
                ) : !issues || issues.length === 0 ? (
                  <div className="text-muted-custom py-3 text-start" style={{ fontSize: '0.9rem' }}>
                    Volume này chưa có issue.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2 py-2">
                    {issues.map((issue) => (
                      <div 
                        key={issue.id} 
                        className="d-flex align-items-center justify-content-between p-2 rounded"
                        style={{ 
                          borderLeft: '2px solid var(--primary)', 
                          backgroundColor: 'var(--bg-card)', 
                          paddingLeft: '12px' 
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <Icon icon="lucide:file-stack" className="text-primary" width="16" />
                          <span className="text-main font-display" style={{ fontSize: '0.95rem' }}>
                            Issue {issue.issue_number} <span className="text-muted-custom" style={{ fontSize: '0.85rem' }}>({issue.year})</span>
                          </span>
                        </div>
                        {issue.article_count !== undefined && (
                          <Badge 
                            className="px-2 py-1" 
                            style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 600, 
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--bg-main)',
                              color: 'var(--text-muted)'
                            }}
                          >
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
