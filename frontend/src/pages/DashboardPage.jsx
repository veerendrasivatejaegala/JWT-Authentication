import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { JwtTokenInspector } from '../components/JwtTokenInspector';
import { ShieldCheck, User, ArrowRight, Lock } from 'lucide-react';

export const DashboardPage = () => {
  const { currentUser, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileRes, dashboardRes] = await Promise.all([
          API.get('/user/profile'),
          API.get('/user/dashboard'),
        ]);

        if (profileRes.data.success) {
          setProfileData(profileRes.data.data);
        }
        if (dashboardRes.data.success) {
          setDashboardMetrics(dashboardRes.data.data);
        }
      } catch (err) {
        setError('Failed to load dashboard metrics from backend REST API.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const username = profileData?.username || currentUser?.username || 'User';

  return (
    <div>
      {/* 1. Dashboard Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, <strong>{username}</strong>. Here is an overview of your account and authentication status.
        </p>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* 2. Top 3 Summary Cards (Authentication / Account / Access Level) */}
      <div className="metrics-grid">
        {/* Card 1: Authentication */}
        <div className="metric-card">
          <div className="metric-header">
            <span>Authentication</span>
            <ShieldCheck size={16} color="var(--primary)" />
          </div>
          <div className="metric-value">
            <span className="status-pill pill-active">
              <span className="status-dot"></span> Active
            </span>
          </div>
          <div className="metric-desc">Stateless JWT session active</div>
        </div>

        {/* Card 2: Account */}
        <div className="metric-card">
          <div className="metric-header">
            <span>Account</span>
            <User size={16} color="var(--text-muted)" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.05rem' }}>
            {profileData?.email || currentUser?.email}
          </div>
          <div className="metric-desc">Verified account credentials</div>
        </div>

        {/* Card 3: Access Level */}
        <div className="metric-card">
          <div className="metric-header">
            <span>Access Level</span>
            <Lock size={16} color="var(--text-muted)" />
          </div>
          <div className="metric-value">
            <span className={`status-pill ${currentUser?.role === 'ADMIN' ? 'pill-admin' : 'pill-user'}`}>
              <span className="status-dot"></span> {currentUser?.role}
            </span>
          </div>
          <div className="metric-desc">
            {currentUser?.role === 'ADMIN' ? 'Full administrative permissions' : 'Standard user application access'}
          </div>
        </div>
      </div>

      {/* 3. Security & Session Configuration Card */}
      <div className="card-panel">
        <div className="card-panel-header">
          <h2 className="section-title">Security &amp; Session Configuration</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spring Security 6</span>
        </div>

        {loading ? (
          <p className="page-subtitle">Loading system status...</p>
        ) : (
          <div className="def-list">
            <div className="def-row">
              <div className="def-label">Session Status</div>
              <div className="def-val">
                <span className="status-pill pill-active">
                  <span className="status-dot"></span> Active
                </span>
              </div>
            </div>

            <div className="def-row">
              <div className="def-label">Authentication Method</div>
              <div className="def-val">JSON Web Token (JWT) — Bearer</div>
            </div>

            <div className="def-row">
              <div className="def-label">Authorization Model</div>
              <div className="def-val">Role-based Access Control (RBAC)</div>
            </div>

            <div className="def-row">
              <div className="def-label">Password Protection</div>
              <div className="def-val">BCrypt Password Hashing</div>
            </div>

            <div className="def-row">
              <div className="def-label">Granted Authorities</div>
              <div className="def-val">
                {dashboardMetrics?.grantedAuthorities?.map((auth, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginRight: '6px',
                    }}
                  >
                    {auth.authority}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. NEW -> JWT Token Inspector Section */}
      <JwtTokenInspector token={token} />

      {/* 5. Quick Navigation Actions Card */}
      <div className="card-panel" style={{ marginBottom: 0 }}>
        <h3 className="section-title" style={{ marginBottom: '0.85rem' }}>Quick Navigation Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/profile" className="btn btn-secondary btn-sm">
            View Profile <ArrowRight size={14} />
          </Link>
          <Link to="/security" className="btn btn-secondary btn-sm">
            View Security Config <ArrowRight size={14} />
          </Link>
          {currentUser?.role === 'ADMIN' && (
            <Link to="/admin" className="btn btn-primary btn-sm">
              User Management Portal <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
