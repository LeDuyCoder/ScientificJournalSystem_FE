import { useTranslation } from "react-i18next";
import React from 'react';
import { Icon } from '@iconify/react';
export default function EmptyState({
  icon = 'lucide:info',
  title,
  description,
  className = '',
  style = {}
}) {
  const {
    t
  } = useTranslation();
  const resolvedTitle = title || t("topic.khongCoDuLieu");
  const resolvedDescription = description || t("zone.khongTimThayThongTinPhuHop");
  return <div className={`text-center py-5 px-4 border border-light d-flex flex-column align-items-center justify-content-center ${className}`} style={{
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    minHeight: '220px',
    ...style
  }}>
      <div className="d-flex align-items-center justify-content-center mb-3" style={{
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-light)',
      color: 'var(--primary)'
    }}>
        <Icon icon={icon} width="24" height="24" />
      </div>
      <h5 className="font-display text-main fw-semibold mb-2" style={{
      fontSize: '1.05rem'
    }}>{resolvedTitle}</h5>
      <p className="text-muted-custom mb-0 text-center" style={{
      fontSize: '0.8rem',
      maxWidth: '320px',
      lineHeight: '1.5'
    }}>
        {resolvedDescription}
      </p>
    </div>;
}