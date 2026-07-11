import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './ChartRangeDropdown.css';
export default function ChartRangeDropdown({
  value,
  onChange
}) {
  const {
    t
  } = useTranslation();

  const OPTIONS = [{
    label: t("dashboard.5NamGanNhat"),
    value: '5'
  }, {
    label: t("dashboard.10NamGanNhat"),
    value: '10'
  }, {
    label: t("dashboard.tatCa"),
    value: 'all'
  }];
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);
  const selectedOption = OPTIONS.find(opt => opt.value === value) || OPTIONS[0];
  const handleSelect = val => {
    onChange(val);
    setIsOpen(false);
  };
  return <div className="position-relative chart-range-wrapper" ref={wrapperRef}>
      {/* Trigger Button */}
      <button className="btn chart-range-trigger d-flex align-items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption.label}</span>
        <Icon icon="lucide:chevron-down" width="16" className="text-muted" />
      </button>

      {/* Popover */}
      {isOpen && <div className="chart-range-popover">
          {/* Header */}
          <div className="crp-header">
            <span className="crp-title">{t("dashboard.khoangThoiGian")}</span>
            <button className="crp-reset" onClick={() => {
          onChange('5');
          setIsOpen(false);
        }}>
              Reset
            </button>
          </div>

          {/* List Options */}
          <div className="crp-list">
            {OPTIONS.map(opt => {
          const isSelected = opt.value === value;
          return <div key={opt.value} className="crp-item" onClick={() => handleSelect(opt.value)}>
                  <div className={`crp-checkbox ${isSelected ? 'selected' : ''}`}>
                    {isSelected && <Icon icon="lucide:check" width="14" />}
                  </div>
                  <span className="crp-label">{opt.label}</span>
                </div>;
        })}
          </div>
        </div>}
    </div>;
}