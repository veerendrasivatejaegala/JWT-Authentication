import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get('/user/profile');
        if (response.data.success) {
          setProfileData(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch user profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const initialLetter = (profileData?.username || currentUser?.username || 'U').charAt(0).toUpperCase();

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">User Profile</h1>
        <p className="page-subtitle">Personal account details and system credentials</p>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="card-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            {initialLetter}
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '0.15rem' }}>
              {profileData?.username || currentUser?.username}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {profileData?.email || currentUser?.email}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="page-subtitle">Loading account data...</p>
        ) : (
          <div className="def-list">
            <div className="def-row">
              <div className="def-label">Account ID</div>
              <div className="def-val">#{profileData?.id || '1'}</div>
            </div>

            <div className="def-row">
              <div className="def-label">Username</div>
              <div className="def-val">{profileData?.username}</div>
            </div>

            <div className="def-row">
              <div className="def-label">Email Address</div>
              <div className="def-val">{profileData?.email}</div>
            </div>

            <div className="def-row">
              <div className="def-label">Assigned Role</div>
              <div className="def-val">
                <span className={`status-pill ${currentUser?.role === 'ADMIN' ? 'pill-admin' : 'pill-user'}`}>
                  <span className="status-dot"></span> {profileData?.role}
                </span>
              </div>
            </div>

            <div className="def-row">
              <div className="def-label">Registration Date</div>
              <div className="def-val">
                {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </div>
            </div>

            <div className="def-row">
              <div className="def-label">Account Status</div>
              <div className="def-val">
                <span className="status-pill pill-active">
                  <span className="status-dot"></span> Active &amp; Verified
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
