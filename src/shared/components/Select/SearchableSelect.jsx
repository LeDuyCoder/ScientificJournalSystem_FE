import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function SearchableSelect({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = "Chọn...", 
  disabled = false,
  loading = false,
  limit = 20,
  fetchOptions = null,
  debounceTime = 300
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    if (!fetchOptions) return;

    const fetchItems = async () => {
      const val = searchTerm.trim();
      setIsSearching(true);
      try {
        const results = await fetchOptions(val);
        setAsyncOptions(results || []);
      } catch (err) {
        console.error("Lỗi fetch options:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchItems, debounceTime);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchOptions, debounceTime]);

  const displayOptions = fetchOptions ? asyncOptions : options;

  const allFiltered = fetchOptions 
    ? displayOptions 
    : displayOptions.filter(opt => 
        (opt.label || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  const filteredOptions = fetchOptions ? allFiltered : allFiltered.slice(0, limit);

  const selectedOption = options.find(opt => String(opt.value) === String(value))
                      || asyncOptions.find(opt => String(opt.value) === String(value));

  const selectOption = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="position-relative" ref={wrapperRef}>
      <div 
        className={`form-control form-control-lg d-flex align-items-center gap-2 ${disabled ? 'bg-light text-muted' : ''}`}
        style={{ 
          cursor: disabled ? 'not-allowed' : 'pointer', 
          backgroundColor: 'var(--bg-main)', 
          color: 'var(--text-main)', 
          borderColor: 'var(--border)' 
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="text-truncate flex-grow-1" style={{ color: selectedOption ? 'inherit' : 'var(--text-muted)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {(loading || isSearching) && <span className="spinner-border spinner-border-sm text-primary" role="status"></span>}
          {selectedOption && !disabled && (
            <Icon 
              icon="lucide:x" 
              width="16" 
              className="text-muted hover-danger cursor-pointer" 
              onClick={handleClear}
            />
          )}
          <Icon icon="lucide:chevron-down" width="18" className="text-muted" />
        </div>
      </div>

      {isOpen && (
        <div className="position-absolute w-100 bg-white border rounded-3 shadow mt-1 z-3" style={{ maxHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <div className="p-2 border-bottom">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0">
                <Icon icon="lucide:search" width="14" className="text-muted" />
              </span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0 shadow-none" 
                placeholder="Tìm kiếm..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          
          <div className="overflow-auto py-1" style={{ maxHeight: '250px' }}>
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-muted small">
                {isSearching ? 'Đang tìm kiếm...' : 'Không tìm thấy kết quả phù hợp'}
              </div>
            ) : (
              filteredOptions.map(opt => (
                <div 
                  key={opt.value}
                  className={`dropdown-item px-3 py-2 d-flex align-items-center gap-2 cursor-pointer ${String(opt.value) === String(value) ? 'bg-light text-primary fw-medium' : 'text-dark'}`}
                  onClick={() => selectOption(opt.value)}
                >
                  <span className="text-truncate" title={opt.label || ''}>{opt.label || ''}</span>
                  {String(opt.value) === String(value) && (
                    <Icon icon="lucide:check" width="16" className="ms-auto text-primary" />
                  )}
                </div>
              ))
            )}
            {!fetchOptions && allFiltered.length > limit && (
               <div className="px-3 py-2 text-muted small fst-italic text-center bg-light border-top mt-1">
                 Đang hiển thị {limit} kết quả. Hãy nhập thêm để lọc...
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
