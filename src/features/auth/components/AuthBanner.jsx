import React from 'react';
import Icon from '../../../shared/components/Icon';

const FEATURES = [
  'Miễn phí hoàn toàn, không cần thẻ',
  'Truy cập 200M+ bài báo khoa học',
  'Theo dõi keyword và nhận thông báo',
  'Tạo project và quản lý journal'
];

export default function AuthBanner() {
  return (
    <div 
      className="h-100 w-100 d-flex flex-column justify-content-between p-5 position-relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-section)', // #ECECEC
        color: 'var(--text-main)', // #0D1B1C
        minHeight: '100vh',
        borderRight: '1px solid var(--border)'
      }}
    >
      {/* Grid Overlay with light line opacity */}
      <div 
        className="position-absolute inset-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(13, 27, 28, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 27, 28, 0.02) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          backgroundPosition: 'center',
          opacity: 0.8,
          zIndex: 1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />

      {/* Logo Brand */}
      <div className="d-flex align-items-center gap-2" style={{ zIndex: 2 }}>
        <div 
          className="d-flex align-items-center justify-content-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary)',
            boxShadow: '0 4px 12px rgba(255, 122, 51, 0.2)'
          }}
        >
          <Icon icon="lucide:activity" className="text-white text-lg" />
        </div>
        <span 
          className="fs-4 fw-bold font-display" 
          style={{ letterSpacing: '0.03em', color: 'var(--text-main)' }}
        >
          ResearchPulse
        </span>
      </div>

      {/* Content */}
      <div className="my-auto" style={{ zIndex: 2, maxWidth: '460px' }}>
        <h1 
          className="font-display fw-bold mb-3"
          style={{ 
            fontSize: '2.5rem', 
            lineHeight: '1.2',
            color: 'var(--text-main)'
          }}
        >
          Tham gia cộng đồng nghiên cứu
        </h1>
        
        <p className="fs-5 mb-5" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Cùng hàng nghìn nhà nghiên cứu sử dụng ResearchPulse để theo dõi xu hướng khoa học.
        </p>

        {/* Feature List */}
        <div className="d-flex flex-column gap-3.5">
          {FEATURES.map((feat, index) => (
            <div key={index} className="d-flex align-items-center gap-3">
              <div 
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary)'
                }}
              >
                <Icon icon="lucide:check" className="text-xs" style={{ color: 'var(--primary)', strokeWidth: '3' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-main)', letterSpacing: '0.01em' }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Text and Icons */}
      <div className="d-flex align-items-center justify-content-between text-xs" style={{ zIndex: 2, color: 'var(--text-muted)' }}>
        <span>© {new Date().getFullYear()} ResearchPulse. All rights reserved.</span>
        <div className="d-flex gap-3">
          <Icon icon="lucide:globe" width="16" style={{ cursor: 'pointer', opacity: 0.8 }} />
          <Icon icon="lucide:help-circle" width="16" style={{ cursor: 'pointer', opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}
