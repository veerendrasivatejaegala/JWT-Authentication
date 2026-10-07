import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, ShieldCheck, Users, Shield } from 'lucide-react';

export const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="brand-icon-box">
          <Shield size={16} />
        </div>
        <div className="brand-title">SecureAuth</div>
      </div>

      <nav className="sidebar-nav">
        <div>
          <div className="nav-section-label">Overview</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <User size={16} />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/security"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <ShieldCheck size={16} />
            <span>Security</span>
          </NavLink>
        </div>

        {isAdmin && (
          <div>
            <div className="nav-section-label">Administration</div>
            <NavLink
              to="/admin"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Users size={16} />
              <span>User Management</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
          Spring Security 6 + JWT
        </div>
      </div>
    </aside>
  );
};
