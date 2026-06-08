import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from '../../../shared/utils/toast';
import { useAuthStore } from '../../../app/store/authStore';
import { useUserStore } from '../../../app/store/userStore';
import {
  deleteCurrentAccount,
  fetchCurrentProfile,
  loginWithGoogleCode,
  loginWithPassword,
  logoutSession,
  registerUser,
  updateCurrentProfile,
} from '../services/authService';

/**
 * Zustand-backed auth hook.
 * Provides the same public API as the old AuthContext while avoiding Context Provider state.
 */
export default function useAuth() {
  const navigate = useNavigate();
  const [googleRedirect, setGoogleRedirect] = useState('/');

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const clearAuthState = useAuthStore((state) => state.logout);
  const setEmail = useUserStore((state) => state.setEmail);
  const clearEmail = useUserStore((state) => state.clearEmail);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchCurrentProfile();
      setUser(userData);
      setEmail(userData.email);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setEmail, setError, setLoading, setUser]);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setLoading(true);
      setError(null);
      try {
        const { response, token: googleToken, email } = await loginWithGoogleCode(codeResponse.code);
        if (response?.success && googleToken) {
          loginSuccess(googleToken);
          setEmail(email);
          toast.success('Đăng nhập thành công');
          navigate(googleRedirect, { replace: true });
        } else {
          toast.error('Đăng nhập thất bại');
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
        setError(message);
        toast.error('Đăng nhập thất bại');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error('Đăng nhập Google thất bại');
    },
  });

  /**
   * Login with email/password.
   * Keeps optional callback argument for backward compatibility with current LoginPage.
   */
  const login = useCallback(async (email, password, remember = true, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithPassword(email, password, remember);
      if (result.token) {
        loginSuccess(result.token);
        onSuccess?.(result.token);
        setEmail(result.email);
      }
      return result.response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loginSuccess, setEmail, setError, setLoading]);

  const loginWithGoogle = useCallback((redirectTo = '/') => {
    setGoogleRedirect(redirectTo);
    googleLogin();
  }, [googleLogin]);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      return await registerUser(data);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  const logout = useCallback(() => {
    logoutSession();
    clearAuthState();
    clearEmail();
    navigate('/login', { replace: true });
  }, [clearAuthState, clearEmail, navigate]);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await updateCurrentProfile(profileData);
      setUser(updatedUser);
      if (updatedUser.email) {
        setEmail(updatedUser.email);
      }
      return updatedUser;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setEmail, setError, setLoading, setUser]);

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteCurrentAccount();
      clearAuthState();
      clearEmail();
      navigate('/register', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete account';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearAuthState, clearEmail, navigate, setError, setLoading]);

  return {
    user,
    setUser,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    fetchProfile,
    updateProfile,
    deleteAccount,
  };
}
