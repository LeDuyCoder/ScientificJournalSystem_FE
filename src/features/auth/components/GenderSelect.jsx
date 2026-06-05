import React from 'react';
import { Form } from 'react-bootstrap';
import Icon from '../../../shared/components/Icon';

export default function GenderSelect({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false
}) {
  const handleSelect = (val) => {
    if (disabled) return;
    onChange({
      target: {
        name,
        value: val
      }
    });
  };

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label 
          className="text-xs font-bold mb-1.5 d-flex align-items-center gap-1"
          style={{ 
            letterSpacing: '0.05em', 
            color: 'var(--text-main)',
            textTransform: 'uppercase'
          }}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      <div
        className="p-1 rounded-3 d-flex align-items-center"
        style={{
          background: 'var(--bg-chip)',
          border: '1px solid var(--border)',
          width: '100%',
          height: '44px'
        }}
      >
        {/* Option: Male */}
        <div
          onClick={() => handleSelect(true)}
          className="flex-fill h-100 d-flex align-items-center justify-content-center gap-2 rounded-2 transition-all select-none"
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: value === true ? '#ffffff' : 'transparent',
            color: value === true ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: value === true ? '600' : '500',
            fontSize: '14px',
            boxShadow: value === true ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            border: value === true ? '1px solid rgba(255, 122, 51, 0.15)' : '1px solid transparent',
            opacity: disabled ? 0.6 : 1
          }}
        >
          <Icon icon="lucide:check-circle" width="16" style={{ opacity: value === true ? 1 : 0, transition: 'opacity 0.2s' }} />
          <span>Nam</span>
        </div>

        {/* Option: Female */}
        <div
          onClick={() => handleSelect(false)}
          className="flex-fill h-100 d-flex align-items-center justify-content-center gap-2 rounded-2 transition-all select-none"
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: value === false ? '#ffffff' : 'transparent',
            color: value === false ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: value === false ? '600' : '500',
            fontSize: '14px',
            boxShadow: value === false ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            border: value === false ? '1px solid rgba(255, 122, 51, 0.15)' : '1px solid transparent',
            opacity: disabled ? 0.6 : 1
          }}
        >
          <Icon icon="lucide:check-circle" width="16" style={{ opacity: value === false ? 1 : 0, transition: 'opacity 0.2s' }} />
          <span>Nữ</span>
        </div>
      </div>

      {error && (
        <div 
          className="text-danger text-xs mt-1.5 d-flex align-items-center gap-1 animate-fade-in"
          style={{ fontWeight: 500 }}
        >
          <Icon icon="lucide:alert-circle" width="12" />
          <span>{error}</span>
        </div>
      )}
    </Form.Group>
  );
}
