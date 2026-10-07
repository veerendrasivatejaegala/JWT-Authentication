import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Shield, Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await API.post('/auth/register', {
        username,
        email,
        password,
        role,
      });

      if (response.data.success) {
        setSuccess('Account created successfully. Signing in...');
        login(response.data.data);
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Registration failed. Please check your inputs.';
      setError(errorMsg);
    } finally {
      setLoading(false);
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
            Join SecureAuth Platform
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            Create an account to test real-time JWT token issuance, BCrypt password hashing, and role-based permissions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Check size={16} color="#38bdf8" /> Instant JWT Token Generation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Check size={16} color="#38bdf8" /> Selectable USER / ADMIN Role Assignment
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Check size={16} color="#38bdf8" /> Salted BCrypt Hash Database Storage
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
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create your account</h2>
            <p className="page-subtitle">Set up your SecureAuth user credentials</p>
          </div>

          {error && (
            <div className="alert-banner alert-error">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert-banner alert-success">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input has-icon"
                  placeholder="e.g. johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  required
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
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

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">USER (Standard Access)</option>
                <option value="ADMIN">ADMIN (Administrative Access)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
