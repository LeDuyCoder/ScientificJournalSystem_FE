import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Icon from '../../../shared/components/Icon';

const ROLES = [
  {
    key: 'STUDENT',
    label: 'Sinh viên',
    desc: 'Đang đi học',
    icon: 'lucide:graduation-cap'
  },
  {
    key: 'LECTURER',
    label: 'Giảng viên',
    desc: 'Đang giảng dạy',
    icon: 'lucide:user-check'
  },
  {
    key: 'RESEARCHER',
    label: 'Nhà nghiên cứu',
    desc: 'Đang làm việc',
    icon: 'lucide:flask-conical'
  }
];

export default function RoleSelect({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false
}) {
  const handleSelect = (roleKey) => {
    if (disabled) return;
    onChange({
      target: {
        name,
        value: roleKey
      }
    });
  };

  return (
    <Form.Group className="mb-4">
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

      <Row className="g-3">
        {ROLES.map((role) => {
          const isSelected = value === role.key;
          return (
            <Col key={role.key} xs={4}>
              <div
                onClick={() => handleSelect(role.key)}
                className="w-100 p-3 rounded-3 text-center transition-all d-flex flex-column align-items-center justify-content-center gap-2 select-none"
                style={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  background: '#ffffff',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                  boxShadow: isSelected ? '0 4px 12px rgba(255, 122, 51, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
                  opacity: disabled ? 0.6 : 1,
                  minHeight: '110px'
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '32px',
                    height: '32px',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon icon={role.icon} width="22" />
                </div>
                <div>
                  <div 
                    className="font-semibold"
                    style={{ 
                      fontSize: '13px', 
                      color: isSelected ? 'var(--text-main)' : 'var(--text-main)',
                      fontWeight: isSelected ? '700' : '600'
                    }}
                  >
                    {role.label}
                  </div>
                  <div 
                    style={{ 
                      fontSize: '10px', 
                      color: 'var(--text-muted)',
                      marginTop: '2px'
                    }}
                  >
                    {role.desc}
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

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
