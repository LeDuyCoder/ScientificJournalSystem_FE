import { useState, useCallback } from 'react';
import {
  loginApi,
  registerApi,
  getProfileApi,
  loginGoogleApi,
} from '../api/auth.api';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProfileApi();
      if (response.data && response.data.success !== false) {
        setUser(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err.response?.data?.message || err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginApi({ email, password });
      if (response.data && response.data.success !== false) {
        const { token, user: userData } = response.data.data || {};
        if (token) {
          localStorage.setItem('researchpulse_token', token);
        }
        setUser(userData || null);
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (idToken) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginGoogleApi(idToken);
      if (response.data && response.data.success !== false) {
        const { token, user: userData } = response.data.data || {};
        if (token) {
          localStorage.setItem('researchpulse_token', token);
        }
        setUser(userData || null);
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Google login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerApi(data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('researchpulse_token');
    setUser(null);
  }, []);

  return {
    user,
    setUser,
    isLoading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    fetchProfile,
  };
}
