/**
 * File: app/layouts/LangLayout.jsx
 * Validates language route params, synchronizes localStorage + i18n,
 * and keeps the rest of the current path when recovering from invalid langs.
 */
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import i18n from '../../shared/i18n/i18n';
import {
  getDefaultLang,
  isSupportedLang,
  LANG_STORAGE_KEY,
} from '../routes/languageRouting';

const KNOWN_ROOT_ROUTES = [
  "login", "register", "verify-email", "forgot-password", "reset-password",
  "dashboard", "geography", "projects", "authors", "admin", "articles",
  "profile", "wallet", "catalog", "search", "journals", "keywords", "topics",
  "admin-preview"
];

const LangLayout = () => {
  const { lang } = useParams();
  const location = useLocation();

  if (!isSupportedLang(lang)) {
    const fallbackLang = getDefaultLang();
    const segments = location.pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    
    let fallbackPath;
    if (KNOWN_ROOT_ROUTES.includes(firstSegment)) {
      // It's a legacy route without language (e.g. /login) -> Prepend fallback language
      fallbackPath = `/${fallbackLang}${location.pathname}`;
    } else {
      // It's an invalid language code (e.g. /jp/login) -> Replace with fallback language
      const remainingSegments = segments.slice(1);
      fallbackPath = `/${fallbackLang}${remainingSegments.length ? `/${remainingSegments.join('/')}` : ''}`;
    }

    return <Navigate to={`${fallbackPath}${location.search}${location.hash}`} replace />;
  }

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);

    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return <Outlet />;
};

export default LangLayout;
