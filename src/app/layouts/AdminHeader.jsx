import React from 'react';
import { useUserStore } from '../store/userStore';
import Icon from '../../shared/components/Icon';

/**
 * AdminHeader Component
 * Renders the top search & user profile bar matching the mockups.
 */
export default function AdminHeader() {
  const email = useUserStore((state) => state.email) || 'admin@researchpulse.org';
  const name = email.split('@')[0];
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div 
      className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom bg-white"
      style={{ height: '70px', position: 'sticky', top: 0, zIndex: 99 }}
    >
      {/* Search Bar matching Page 3: "Search manuscripts, authors, or IDs..." */}
      <div 
        className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border)',
          width: '380px',
        }}
      >
        <Icon icon="lucide:search" width="16" style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search manuscripts, authors, or IDs..." 
          className="border-0 bg-transparent text-main w-100"
          style={{ outline: 'none', fontSize: '0.85rem' }}
        />
      </div>

      {/* Right control utilities and profile section */}
      <div className="d-flex align-items-center gap-4">
        {/* Notification Icon */}
        <div className="text-muted-custom position-relative" style={{ cursor: 'pointer' }}>
          <Icon icon="lucide:bell" width="20" />
          <span 
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"
            style={{ width: '8px', height: '8px' }}
          />
        </div>

        {/* Settings Icon */}
        <div className="text-muted-custom" style={{ cursor: 'pointer' }}>
          <Icon icon="lucide:settings" width="20" />
        </div>

        {/* User profile section matching mockup format */}
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <div className="text-sm fw-bold text-main" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
              {formattedName}
            </div>
            <div className="text-muted-custom" style={{ fontSize: '0.75rem', lineHeight: '1' }}>
              System Administrator
            </div>
          </div>
          {/* Avatar image */}
          <div 
            className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              border: '2px solid var(--primary-light)',
              backgroundColor: 'var(--bg-section)'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
              alt="User Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none'; // Fallback if image fails to load
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
