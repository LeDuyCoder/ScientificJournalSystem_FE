/**
 * File: app/routes/languageRouting.js
 * Helpers for language handling, redirection and URL path rewriting.
 */
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

export const SUPPORTED_LANGS = ['vi', 'en', 'ja', 'ko'];
export const LANG_STORAGE_KEY = STORAGE_KEYS.LANGUAGE || 'researchpulse_lang';

export const isSupportedLang = (lang) => {
  return SUPPORTED_LANGS.includes(lang);
};

export const getStoredLang = () => {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && isSupportedLang(stored)) {
      return stored;
    }
  } catch (e) {
    console.error('Error reading language from localStorage', e);
  }
  return null;
};

export const getBrowserLang = () => {
  try {
    const browser = navigator.language?.split('-')[0];
    if (browser === 'vi') return 'vi';
  } catch (e) {
    console.error('Error reading browser language', e);
  }
  return 'en'; // fallback default
};

export const getDefaultLang = () => {
  return getStoredLang() || getBrowserLang();
};

export const replaceLangInPath = (pathname, newLang) => {
  if (!isSupportedLang(newLang)) return pathname;

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isSupportedLang(segments[0])) {
    segments[0] = newLang;
  } else {
    segments.unshift(newLang);
  }

  return '/' + segments.join('/');
};
