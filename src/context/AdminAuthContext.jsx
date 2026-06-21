import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminAuthService } from '../services/adminService';
import { tokenStorage } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdmin = useCallback(async () => {
    const token = tokenStorage.getAdminAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await adminAuthService.getMe();
      setAdmin(data.data.admin);
    } catch {
      tokenStorage.clearAdminAccessToken();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmin();

    const handleExpired = () => {
      tokenStorage.clearAdminAccessToken();
      setAdmin(null);
    };
    window.addEventListener('sfb:admin-auth-expired', handleExpired);
    return () => window.removeEventListener('sfb:admin-auth-expired', handleExpired);
  }, [loadAdmin]);

  const login = async (credentials) => {
    const { data } = await adminAuthService.login(credentials);
    tokenStorage.setAdminAccessToken(data.data.accessToken);
    setAdmin(data.data.admin);
    return data.data.admin;
  };

  const logout = async () => {
    try {
      await adminAuthService.logout();
    } catch {
      /* ignore */
    } finally {
      tokenStorage.clearAdminAccessToken();
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
};
