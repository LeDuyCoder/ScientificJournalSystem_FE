import axiosClient from '../../../api/axiosClient';

const TOKEN_KEY = 'token';

export const saveToken = (token, rememberMe) => {
  removeToken();

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  if (axiosClient?.defaults) {
    axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

export const getToken = () => {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY)
  );
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);

  if (axiosClient?.defaults?.headers) {
    delete axiosClient.defaults.headers.Authorization;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true; // Invalid JWT structure
    const payloadBase64 = parts[1];
    if (!payloadBase64) return true;
    
    const normalizedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(window.atob(normalizedPayload));
    
    if (decodedPayload.exp) {
      const expirationDate = decodedPayload.exp * 1000;
      return Date.now() >= expirationDate;
    }
    return false;
  } catch (e) {
    return true;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};