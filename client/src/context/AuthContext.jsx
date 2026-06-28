import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('task-user') || 'null');
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('task-token'));
  const [user, setUser] = useState(readStoredUser);
  const [initializing, setInitializing] = useState(Boolean(token));

  const persistSession = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem('task-token', nextToken);
    localStorage.setItem('task-user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const updateStoredUser = (nextUser) => {
    localStorage.setItem('task-user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = (message) => {
    localStorage.removeItem('task-token');
    localStorage.removeItem('task-user');
    localStorage.removeItem('task-draft');
    setToken(null);
    setUser(null);
    if (message) toast.error(message);
  };

  useEffect(() => {
    const handleExpired = () => logout('Your session expired. Please log in again.');
    window.addEventListener('auth-expired', handleExpired);
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const response = await authApi.me();
        const nextUser = response.data.data.user;
        localStorage.setItem('task-user', JSON.stringify(nextUser));
        setUser(nextUser);
      } catch {
        logout();
      } finally {
        setInitializing(false);
      }
    };

    loadProfile();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(token && user),
      login: async (payload) => {
        const response = await authApi.login(payload);
        persistSession(response.data.data);
        return response;
      },
      signup: async (payload) => {
        return authApi.signup(payload);
      },
      updateProfile: async (payload) => {
        const response = await authApi.updateProfile(payload);
        updateStoredUser(response.data.data.user);
        return response;
      },
      changePassword: (payload) => authApi.changePassword(payload),
      refreshUser: async () => {
        const response = await authApi.me();
        updateStoredUser(response.data.data.user);
        return response;
      },
      logout,
    }),
    [initializing, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
