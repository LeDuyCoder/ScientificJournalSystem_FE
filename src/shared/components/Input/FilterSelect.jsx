import React from 'react';
import { Form } from 'react-bootstrap';
import './FilterInput.css';

/**
 * Shared component cho ô Dropdown (Select) trong các Filter Card.
 * 
 * @param {Array} options - Mảng các { value, label, title }
 */
export default function FilterSelect({ 
  value, 
  onChange, 
  options = [], 
  disabled = false, 
  className = '', 
  style = {} 
}) {
  return (
    <Form.Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`shared-filter-select ${className}`.trim()}
      style={style}
    >
      {options.map((opt, idx) => (
        <option 
          key={opt.value || idx} 
          value={opt.value} 
          title={opt.title || opt.label}
        >
          {opt.label}
        </option>
      ))}
    </Form.Select>
  );
}
