/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\i18n\i18n.js
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import viTranslation from './locales/vi.json';
import enTranslation from './locales/en.json';
import jaTranslation from './locales/ja.json';
import koTranslation from './locales/ko.json';

const resources = {
  vi: { translation: viTranslation },
  en: { translation: enTranslation },
  ja: { translation: jaTranslation },
  ko: { translation: koTranslation }
};

const getStoredLang = () => {
  try {
    const stored = localStorage.getItem('researchpulse_lang');
    if (['vi', 'en', 'ja', 'ko'].includes(stored)) return stored;
  } catch (e) {
    console.error('Error reading language from localStorage', e);
  }
  return null;
};

const getBrowserLang = () => {
  try {
    const browser = navigator.language?.split('-')[0];
    if (['vi', 'ja', 'ko'].includes(browser)) return browser;
  } catch (e) {
    console.error('Error reading browser language', e);
  }
  return 'en';
};

const initialLang = getStoredLang() || getBrowserLang();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
