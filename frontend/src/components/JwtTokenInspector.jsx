import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Lock, ShieldCheck, Code, AlertTriangle } from 'lucide-react';

export const JwtTokenInspector = ({ token }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewJsonPayload, setViewJsonPayload] = useState(false);

  if (!token) {
    return (
      <div className="card-panel">
        <div className="card-panel-header">
          <h2 className="section-title">JWT Token Inspector</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No active JWT token is available for inspection. Please sign in again.
        </p>
      </div>
    );
  }

  // Safe client-side Base64Url decoding helper
  const decodeBase64Url = (str) => {
    try {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  };

  const parts = token.split('.');
  const rawHeaderSegment = parts[0] || '';
  const rawPayloadSegment = parts[1] || '';
  const rawSignatureSegment = parts[2] || '';

  const decodedHeader = decodeBase64Url(rawHeaderSegment);
  const decodedPayload = decodeBase64Url(rawPayloadSegment);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format timestamps if present in payload
  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    return new Date(ts * 1000).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  };

  const maskedToken = `${rawHeaderSegment.substring(0, 12)}... . ${rawPayloadSegment.substring(0, 12)}... . ${rawSignatureSegment.substring(0, 12)}...`;

  return (
    <div className="card-panel">
      {/* Section Header */}
      <div className="card-panel-header">
        <div>
          <h2 className="section-title">JWT Token Inspector</h2>
          <p className="page-subtitle" style={{ fontSize: '0.825rem', marginTop: '0.15rem' }}>
            Inspect the structure of the JWT used for your current authenticated session.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className="btn btn-secondary btn-sm"
          >
            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
            {isRevealed ? 'Hide Raw Token' : 'Reveal Token'}
          </button>

          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-sm"
          >
            {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Token'}
          </button>
        </div>
      </div>

      {/* Raw Encoded JWT Display Box */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Raw JWT Token Segment (Authorization: Bearer &lt;token&gt;)
        </div>
        <div
          style={{
            background: 'var(--bg-sidebar)',
            color: '#e2e8f0',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            border: '1px solid var(--border-color)',
          }}
        >
          {isRevealed ? (
            <>
              <span style={{ color: '#38bdf8' }}>{rawHeaderSegment}</span>
              <span style={{ color: '#94a3b8', margin: '0 2px', fontWeight: 700 }}>.</span>
              <span style={{ color: '#c084fc' }}>{rawPayloadSegment}</span>
              <span style={{ color: '#94a3b8', margin: '0 2px', fontWeight: 700 }}>.</span>
              <span style={{ color: '#fbbf24' }}>{rawSignatureSegment}</span>
            </>
          ) : (
            <span style={{ color: '#94a3b8', letterSpacing: '0.05em' }}>{maskedToken}</span>
          )}
        </div>
      </div>

      {/* Three-Part Visualization Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Panel 01: Header */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderTop: '3px solid #0284c7',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              01 &nbsp; HEADER
            </span>
            <Code size={14} color="#0284c7" />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Token metadata and signing algorithm.
          </p>
          <pre
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              overflowX: 'auto',
            }}
          >
            {decodedHeader ? JSON.stringify(decodedHeader, null, 2) : 'Unable to decode header'}
          </pre>
        </div>

        {/* Panel 02: Payload */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderTop: '3px solid #7c3aed',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              02 &nbsp; PAYLOAD
            </span>
            <button
              onClick={() => setViewJsonPayload(!viewJsonPayload)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}
            >
              {viewJsonPayload ? 'View Claims' : 'View JSON'}
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Claims containing user identity &amp; token validity.
          </p>

          {viewJsonPayload ? (
            <pre
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
                overflowX: 'auto',
              }}
            >
              {decodedPayload ? JSON.stringify(decodedPayload, null, 2) : 'Unable to decode payload'}
            </pre>
          ) : (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.65rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subject (sub)</span>
                <strong>{decodedPayload?.sub || 'N/A'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role (role)</span>
                <strong>{decodedPayload?.role || 'USER'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Issued At (iat)</span>
                <span>{formatTimestamp(decodedPayload?.iat)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Expires At (exp)</span>
                <span>{formatTimestamp(decodedPayload?.exp)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Panel 03: Signature */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderTop: '3px solid #d97706',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              03 &nbsp; SIGNATURE
            </span>
            <Lock size={14} color="#d97706" />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Used to verify token integrity and detect tampering.
          </p>
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-primary)',
              wordBreak: 'break-all',
            }}
          >
            {rawSignatureSegment || 'N/A'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Calculated as: <code>HMACSHA256(Header + "." + Payload, secret)</code>
          </div>
        </div>
      </div>

      {/* Security Note Banner & Structure Footer */}
      <div
        style={{
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <AlertTriangle size={14} color="var(--warning)" />
          <span>
            <strong>Security note:</strong> JWTs contain Base64URL encoded claims, not encrypted data. The signing secret is stored securely on the backend and is never sent to the frontend.
          </span>
        </div>

        <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
          JWT = Header + Payload + Signature
        </div>
      </div>
    </div>
  );
};
