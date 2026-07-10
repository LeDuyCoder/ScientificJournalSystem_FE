import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import './FilterInput.css';

/**
 * Shared component cho ô tìm kiếm trong các Filter Card.
 * Hỗ trợ 2 chế độ:
 * 1. Debounced: dùng `initialValue` + `onSearchChange` (Tự động trigger sau 400ms)
 * 2. Controlled: dùng `value` + `onChange` (Chế độ form thường)
 */
export default function FilterSearch({
  value,
  onChange,
  initialValue,
  onSearchChange,
  placeholder,
  className = '',
  actionButton = null,
  style = {}
}) {
  const {
    t
  } = useTranslation();
  const resolvedPlaceholder = placeholder || t("common.timKiem");
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(initialValue || '');

  // Cập nhật giá trị nội bộ nếu initialValue bên ngoài thay đổi
  useEffect(() => {
    if (!isControlled && initialValue !== undefined) {
      setInternalVal(initialValue);
    }
  }, [initialValue, isControlled]);
  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  // Xử lý debounce
  useEffect(() => {
    if (isControlled) return;
    const timer = setTimeout(() => {
      onSearchChangeRef.current && onSearchChangeRef.current(internalVal);
    }, 400);
    return () => clearTimeout(timer);
  }, [internalVal, isControlled]);
  const handleChange = e => {
    if (isControlled) {
      onChange && onChange(e);
    } else {
      setInternalVal(e.target.value);
    }
  };
  const handleClear = () => {
    if (isControlled) {
      onChange && onChange({
        target: {
          value: ''
        }
      });
    } else {
      setInternalVal('');
    }
  };
  const displayValue = isControlled ? value : internalVal;
  return <div className={`shared-search-container ${className}`.trim()} style={style}>
      <div className="search-icon-wrapper">
        <Icon icon="lucide:search" width="18" height="18" />
      </div>
      
      <input type="text" value={displayValue} onChange={handleChange} placeholder={resolvedPlaceholder} className="search-input" />
      
      {displayValue && <button type="button" className="clear-icon-btn" onClick={handleClear} title={t("common.xoaTimKiem")}>
          <Icon icon="lucide:x" width="16" height="16" />
        </button>}

      {actionButton && <div className="search-action-wrapper">
          {actionButton}
        </div>}
    </div>;
}