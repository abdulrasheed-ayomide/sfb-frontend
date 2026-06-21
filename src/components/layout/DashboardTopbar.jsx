import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/bankingService';
import { getInitials } from '../../utils/format';

const DashboardTopbar = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await notificationService.getNotifications({ page: 1, limit: 1 });
        setUnreadCount(data.data.unreadCount || 0);
      } catch {
        /* ignore */
      }
    };
    fetchUnread();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="dashboard-topbar">
      <div className="flex items-center gap-3">
        <button className="dashboard-menu-toggle btn-icon" onClick={onMenuClick} aria-label="Toggle navigation">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <h1 className="dashboard-topbar-title">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title="Toggle theme"
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          )}
        </button>

        <button
          className="btn-icon"
          style={{ position: 'relative' }}
          onClick={() => navigate('/dashboard/notifications')}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && <span className="notification-dot" aria-hidden="true" />}
        </button>

        <div className="user-menu" ref={menuRef}>
          <button className="user-menu-trigger" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
            <span className="avatar">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="" />
              ) : (
                getInitials(user?.fullName)
              )}
            </span>
            <span className="user-menu-name">{user?.fullName?.split(' ')[0]}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {menuOpen && (
            <div className="user-menu-dropdown">
              <div className="user-menu-info">
                <strong>{user?.fullName}</strong>
                <span className="text-xs text-muted">{user?.email}</span>
              </div>
              <hr className="divider" style={{ margin: 'var(--space-2) 0' }} />
              <button onClick={() => navigate('/dashboard/profile')}>Profile &amp; Security</button>
              <button onClick={handleLogout} className="user-menu-logout">Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
