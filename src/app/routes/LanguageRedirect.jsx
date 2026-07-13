/**
 * File: app/routes/LanguageRedirect.jsx
 * Handles redirect from "/" to the appropriate language-prefixed root.
 * Priority: localStorage stored lang > browser language > 'en'
 */
import { Navigate } from 'react-router-dom';
import { getDefaultLang } from './languageRouting';

const LanguageRedirect = () => {
  const lang = getDefaultLang();
  return <Navigate to={`/${lang}`} replace />;
};

export default LanguageRedirect;
