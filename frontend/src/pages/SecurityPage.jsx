import React from 'react';
import { useAuth } from '../context/AuthContext';
import { JwtInspector } from '../components/JwtInspector';
import { ShieldCheck, Lock, Key, Cpu, Server } from 'lucide-react';

export const SecurityPage = () => {
  const { token, currentUser } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Security Configuration</h1>
        <p className="page-subtitle">
          Overview of active security mechanisms, authentication policies, and cryptographic algorithms.
        </p>
      </div>

      <div className="card-panel">
        <div className="card-panel-header">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--primary)" /> System Security Architecture
          </h2>
          <span className="status-pill pill-active">
            <span className="status-dot"></span> Active Protection
          </span>
        </div>

        <div className="def-list">
          <div className="def-row">
            <div className="def-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={14} color="var(--text-muted)" /> Authentication Protocol
            </div>
            <div className="def-val">
              JSON Web Token (JWT) — HMAC SHA-256 Signed
            </div>
          </div>

          <div className="def-row">
            <div className="def-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} color="var(--text-muted)" /> Password Hashing Algorithm
            </div>
            <div className="def-val">
              BCrypt (Spring Security <code>BCryptPasswordEncoder</code> strength 10)
            </div>
          </div>

          <div className="def-row">
            <div className="def-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={14} color="var(--text-muted)" /> Authorization Model
            </div>
            <div className="def-val">
              Role-Based Access Control (RBAC) — Current: <code>{currentUser?.role || 'USER'}</code>
            </div>
          </div>

          <div className="def-row">
            <div className="def-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={14} color="var(--text-muted)" /> Session Creation Policy
            </div>
            <div className="def-val">
              STATELESS (No server-side HTTP session storage)
            </div>
          </div>

          <div className="def-row">
            <div className="def-label">Cross-Origin Resource Sharing</div>
            <div className="def-val">
              Configured via <code>SecurityConfig.corsConfigurationSource()</code>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Developer JWT Inspector Panel */}
      <JwtInspector token={token} />
    </div>
  );
};
