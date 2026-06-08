import { jwtDecode } from 'jwt-decode';
import {
  loginApi,
  registerApi,
  getProfileApi,
  updateProfileApi,
  deleteAccountApi,
  loginGoogleApi,
} from '../api/auth.api';
import { STORAGE_KEYS } from '../../../shared/constants/storageKeys';
import { removeToken } from '../../../shared/utils/auth';

/**
 * Persist access token according to remember-login option.
 *
 * @param {string} token - JWT access token from backend.
 * @param {boolean} remember - Whether token should persist in localStorage.
 */
const persistToken = (token, remember = true) => {
  const targetStorage = remember ? localStorage : sessionStorage;
  const fallbackStorage = remember ? sessionStorage : localStorage;
  fallbackStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  targetStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

/**
 * Safely extract email-like identity from JWT payload.
 *
 * @param {string} token - JWT access token.
 * @returns {string} Email/sub fallback for display.
 */
const getEmailFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.email || decoded.sub || 'User';
  } catch {
    return 'User';
  }
};

/**
 * Login using email/password and persist token.
 *
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @param {boolean} remember - Remember login flag.
 * @returns {Promise<{response: Object, token: string|null, email: string}>}
 */
export const loginWithPassword = async (email, password, remember = true) => {
  const response = await loginApi({ email, password });
  const token = response.data?.data?.token;
  if (token) {
    persistToken(token, remember);
  }

  return {
    response: response.data,
    token: token || null,
    email: token ? getEmailFromToken(token) : email,
  };
};

/**
 * Exchange Google auth code for backend token.
 *
 * @param {string} code - Google OAuth auth code.
 * @returns {Promise<{response: Object, token: string|null, email: string}>}
 */
export const loginWithGoogleCode = async (code) => {
  const result = await loginGoogleApi(code);
  const body = result.data;
  const token = body?.data?.token;
  if (token) {
    persistToken(token, true);
  }

  return {
    response: body,
    token: token || null,
    email: token ? getEmailFromToken(token) : 'User',
  };
};

/**
 * Register a new user account.
 *
 * @param {Object} payload - Register payload.
 * @returns {Promise<Object>} Backend response body.
 */
export const registerUser = async (payload) => {
  const response = await registerApi(payload);
  return response.data;
};

/**
 * Fetch current authenticated user's profile.
 *
 * @returns {Promise<Object>} User profile object.
 */
export const fetchCurrentProfile = async () => {
  const response = await getProfileApi();
  if (response.data?.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'Failed to fetch profile');
};

/**
 * Update current authenticated user's profile.
 *
 * @param {Object} profileData - Profile fields to update.
 * @returns {Promise<Object>} Updated user profile.
 */
export const updateCurrentProfile = async (profileData) => {
  const response = await updateProfileApi(profileData);
  if (response.data?.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'Failed to update profile');
};

/**
 * Delete current authenticated user's account.
 *
 * @returns {Promise<Object>} Backend response body.
 */
export const deleteCurrentAccount = async () => {
  const response = await deleteAccountApi();
  if (response.data?.success) {
    removeToken();
    return response.data;
  }
  throw new Error(response.data?.message || 'Failed to delete account');
};

/**
 * Clear all auth tokens from browser storage.
 */
export const logoutSession = () => {
  removeToken();
};
