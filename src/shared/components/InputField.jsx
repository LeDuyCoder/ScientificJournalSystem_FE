import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Icon from './Icon';

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon,
  required = false,
  disabled = false,
  ...props
}) {
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
      
      <InputGroup 
        className="rounded-3 overflow-hidden border"
        style={{
          borderColor: error ? '#ef4444' : 'var(--border)',
          background: '#ffffff',
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}
      >
        {icon && (
          <InputGroup.Text 
            className="bg-transparent border-0 pe-1 text-muted-custom d-flex align-items-center justify-content-center"
            style={{ width: '40px' }}
          >
            <Icon icon={icon} width="18" className="text-muted-custom opacity-70" />
          </InputGroup.Text>
        )}
        
        <Form.Control
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="bg-transparent border-0 text-main text-sm py-2.5 ps-2"
          style={{
            boxShadow: 'none',
            outline: 'none',
            color: 'var(--text-main)'
          }}
          {...props}
        />
      </InputGroup>
      
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
