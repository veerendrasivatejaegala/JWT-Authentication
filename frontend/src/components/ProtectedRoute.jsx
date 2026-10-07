import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return (
      <div className="panel" style={{ maxWidth: '520px', margin: '3rem auto' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>403 Access Denied</h1>
        <p className="subtitle" style={{ marginBottom: '1.25rem' }}>
          You do not have administrative permission to view this resource.
        </p>

        <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <div><strong>Required Role:</strong> {requiredRole}</div>
          <div><strong>Your Current Role:</strong> {currentUser?.role}</div>
        </div>

        <Link to="/dashboard" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return children;
};
