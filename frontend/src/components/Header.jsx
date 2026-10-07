import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, User, ShieldCheck, LogOut } from 'lucide-react';

export const Header = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/profile':
        return 'Account Profile';
      case '/security':
        return 'Security Configuration';
      case '/admin':
        return 'User Management';
      default:
        return 'Application Workspace';
    }
  };

  const firstLetter = currentUser?.username?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="app-header">
      <div className="header-title-bar">
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getPageTitle()}</span>
      </div>

      <div className="header-user-menu" ref={menuRef}>
        <span className={`status-pill ${isAdmin ? 'pill-admin' : 'pill-user'}`}>
          <span className="status-dot"></span>
          {currentUser?.role || 'USER'}
        </span>

        <button
          className="user-avatar-pill"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="user-avatar-circle">{firstLetter}</div>
          <span>{currentUser?.username || 'User'}</span>
          <ChevronDown size={14} color="var(--text-muted)" />
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser?.username}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{currentUser?.email}</div>
            </div>

            <Link
              to="/profile"
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <User size={14} /> Profile
            </Link>

            <Link
              to="/security"
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <ShieldCheck size={14} /> Security
            </Link>

            <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }}></div>

            <button className="dropdown-item" style={{ color: 'var(--danger)' }} onClick={handleLogout}>
              <LogOut size={14} /> Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
