import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.getMe();
      setUser(data.data.user);
    } catch {
      tokenStorage.clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    const handleExpired = () => {
      tokenStorage.clearAccessToken();
      setUser(null);
    };
    window.addEventListener('sfb:auth-expired', handleExpired);
    return () => window.removeEventListener('sfb:auth-expired', handleExpired);
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    tokenStorage.setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    } finally {
      tokenStorage.clearAccessToken();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const { data } = await authService.getMe();
    setUser(data.data.user);
    return data.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
