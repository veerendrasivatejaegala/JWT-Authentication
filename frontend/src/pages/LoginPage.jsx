import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Shield, Mail, Lock, Eye, EyeOff, ShieldCheck, Key, Check } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      setError('Your session has expired. Please sign in again.');
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.success) {
        login(response.data.data);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Unable to sign in.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password. Please check your credentials.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'USER') {
      setEmail('user@example.com');
      setPassword('User@123');
    } else if (role === 'ADMIN') {
      setEmail('admin@example.com');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="split-auth-wrapper">
      {/* Left Brand Panel */}
      <div className="split-auth-brand">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem' }}>
            <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
              <Shield size={18} />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>SecureAuth</span>
          </div>

          <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem', lineHeight: 1.25 }}>
            Authentication &amp; Access Control Platform
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            Enterprise-grade identity management built with Spring Boot 3, Spring Security 6, and React.js.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Check size={16} color="#38bdf8" /> JWT-Based Stateless Authentication
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Check size={16} color="#38bdf8" /> Role-Based Access Control (RBAC)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Check size={16} color="#38bdf8" /> BCrypt One-Way Password Hashing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Check size={16} color="#38bdf8" /> Parameterized JPA &amp; MySQL Security
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          SecureAuth Architecture &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Form Content Panel */}
      <div className="split-auth-content">
        <div className="auth-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>Welcome back</h2>
            <p className="page-subtitle">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="alert-banner alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-input has-icon"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-icon has-right-btn"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-right-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Autofill Helper for Interview Demo */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.15rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Demo Account Autofill (Interview Helper):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setDemoCredentials('USER')}
                className="btn btn-secondary btn-sm"
              >
                Fill User
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('ADMIN')}
                className="btn btn-secondary btn-sm"
              >
                Fill Admin
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
