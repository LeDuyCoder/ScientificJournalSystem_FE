import React from 'react';
import { Nav } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function JournalTabs({ activeTab, onTabChange }) {
  return (
    <Nav 
      variant="tabs" 
      activeKey={activeTab} 
      onSelect={onTabChange}
      className="tab-nav-custom mb-4 border-0 d-flex flex-nowrap overflow-auto"
      style={{ gap: '4px' }}
    >
      <Nav.Item>
        <Nav.Link 
          eventKey="ranking" 
          className="d-flex align-items-center gap-2 border-0 px-3 py-2 text-nowrap"
        >
          <Icon icon="lucide:bar-chart-3" width="16" />
          Lịch sử Ranking
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link 
          eventKey="volumes" 
          className="d-flex align-items-center gap-2 border-0 px-3 py-2 text-nowrap"
        >
          <Icon icon="lucide:book-open" width="16" />
          Volumes & Issues
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link 
          eventKey="articles" 
          className="d-flex align-items-center gap-2 border-0 px-3 py-2 text-nowrap"
        >
          <Icon icon="lucide:file-text" width="16" />
          Bài báo gần đây
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
