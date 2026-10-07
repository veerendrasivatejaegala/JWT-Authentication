import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="panel" style={{ maxWidth: '440px', margin: '4rem auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>404</h1>
      <h2>Page Not Found</h2>
      <p className="subtitle" style={{ margin: '0.5rem 0 1.5rem' }}>
        The requested page does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
};
