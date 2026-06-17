import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminProtectedRoute from './components/layout/AdminProtectedRoute';

import LandingPage from './pages/public/LandingPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsPage from './pages/public/TermsPage';

import RegisterPage from './pages/auth/RegisterPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import TransferPage from './pages/dashboard/TransferPage';
import TransactionsPage from './pages/dashboard/TransactionsPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import ProfilePage from './pages/dashboard/ProfilePage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import AdminTransactionDetailPage from './pages/admin/AdminTransactionDetailPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';


import NotFoundPage from './pages/NotFoundPage';
import AdminCreditAccountPage from './pages/admin/AdminCreditAccountPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <Routes>
              {/* --- Public site --- */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Route>

              {/* --- Customer auth --- */}
              <Route element={<AuthLayout />}>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* --- Customer dashboard (protected) --- */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardOverviewPage />} />
                  <Route path="/dashboard/transfer" element={<TransferPage />} />
                  <Route path="/dashboard/transactions" element={<TransactionsPage />} />
                  <Route path="/dashboard/notifications" element={<NotificationsPage />} />
                  <Route path="/dashboard/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* --- Admin portal --- */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminOverviewPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/credit-account" element={<AdminCreditAccountPage />} />
                  <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
                  <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
                  <Route path="/admin/transactions/:id" element={<AdminTransactionDetailPage />} />
                  <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
                </Route>
              </Route>

              {/* --- 404 --- */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AdminAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
