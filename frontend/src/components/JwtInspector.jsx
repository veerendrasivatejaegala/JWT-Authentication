import React, { useState } from 'react';

export const JwtInspector = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!token) return null;

  const decodeBase64Url = (str) => {
    try {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return JSON.parse(atob(base64));
    } catch (e) {
      return { error: 'Invalid Base64 string' };
    }
  };

  const parts = token.split('.');
  const rawHeader = parts[0] ? decodeBase64Url(parts[0]) : null;
  const rawPayload = parts[1] ? decodeBase64Url(parts[1]) : null;

  const expDate = rawPayload?.exp ? new Date(rawPayload.exp * 1000).toLocaleString() : 'N/A';
  const iatDate = rawPayload?.iat ? new Date(rawPayload.iat * 1000).toLocaleString() : 'N/A';

  return (
    <div style={{ marginTop: '2rem' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary btn-sm"
        style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
      >
        {isOpen ? 'Hide Token Details' : 'Inspect JWT Claims (Interview Helper)'}
      </button>

      {isOpen && (
        <div className="panel" style={{ marginTop: '0.75rem', background: '#fafafa' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            JWT Token Claims & Cryptographic Header
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Header</div>
              <pre style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.65rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                {JSON.stringify(rawHeader, null, 2)}
              </pre>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Payload Claims</div>
              <pre style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.65rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                {JSON.stringify(rawPayload, null, 2)}
              </pre>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem' }}>
            <div><strong>Issued At:</strong> {iatDate}</div>
            <div><strong>Expires At:</strong> {expDate}</div>
            <div><strong>Algorithm:</strong> HMAC SHA-256 (HS256)</div>
          </div>
        </div>
      )}
    </div>
  );
};
