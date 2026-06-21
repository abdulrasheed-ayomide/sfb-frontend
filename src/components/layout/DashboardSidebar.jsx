import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';

const navItems = [
  {
    to: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    to: '/dashboard/transfer',
    label: 'Transfer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 10l5-5 5 5" />
        <path d="M12 5v14" />
        <path d="M17 14l-5 5-5-5" />
      </svg>
    ),
  },
  {
    to: '/dashboard/transactions',
    label: 'Transactions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h4l3 8 4-16 3 8h4" />
      </svg>
    ),
  },
  {
    to: '/dashboard/notifications',
    label: 'Notifications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    to: '/dashboard/profile',
    label: 'Profile & Security',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
];

const DashboardSidebar = ({ open, onClose }) => (
  <>
    {open && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
    <aside className={`dashboard-sidebar ${open ? 'is-open' : ''}`}>
      <div className="dashboard-sidebar-header">
        <Logo size="sm" />
      </div>
      <nav className="dashboard-nav" aria-label="Dashboard navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'is-active' : ''}`}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="dashboard-sidebar-footer">
        <p className="text-xs text-muted">
          Spring Financial Bank
          <br />
          Secure · Trusted · Digital
        </p>
      </div>
    </aside>
  </>
);

export default DashboardSidebar;
