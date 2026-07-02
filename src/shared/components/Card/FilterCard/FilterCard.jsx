import React from 'react';
import './FilterCard.css';

/**
 * Shared FilterCard - Sử dụng làm khung bao (wrapper) cho các bộ lọc phức tạp
 * (như thanh search, nhiều dropdown filter) để đồng bộ form UI trên toàn hệ thống.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Các thành phần input, select, form...
 * @param {string} props.className - Class bổ sung (nếu cần)
 */
export default function FilterCard({ children, className = '' }) {
  return (
    <div className={`shared-filter-card ${className}`.trim()}>
      {children}
    </div>
  );
}
