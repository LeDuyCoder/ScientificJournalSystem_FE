import React from 'react';

/**
 * UserStatusBadge Component
 * Renders user status with bullet indicators matching Page 3 mockup.
 * 
 * @param {Object} props - Props
 * @param {string} props.status - User status: 'Active', 'Inactive', 'Pending'
 */
export default function UserStatusBadge({ status }) {
  // Map color points and font color values for statuses
  const statusConfig = {
    Active: {
      dotColor: '#16a34a', // Vibrant green
      textColor: '#16a34a',
    },
    Inactive: {
      dotColor: '#0284c7', // Cyan/blue
      textColor: '#0284c7',
    },
    Pending: {
      dotColor: '#f97316', // Orange
      textColor: '#f97316',
    }
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <div className="d-inline-flex align-items-center fw-medium text-xs" style={{ fontSize: '0.825rem', color: config.textColor, gap: '8px' }}>
      <span 
        className="rounded-circle d-inline-block" 
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: config.dotColor,
        }}
      />
      <span>{status}</span>
    </div>
  );
}
