import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Search, RefreshCw, Trash2 } from 'lucide-react';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Access Restricted: ADMIN role permissions required.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}" (ID: ${id})?`)) {
      return;
    }

    try {
      const response = await API.delete(`/admin/users/${id}`);
      if (response.data.success) {
        setActionMessage(`User "${username}" was removed successfully.`);
        fetchUsers();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">
            Admin Portal — Manage registered users and role authorizations
          </p>
        </div>
        <button onClick={fetchUsers} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {actionMessage && (
        <div className="alert-banner alert-success">
          <span>{actionMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert-banner alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="input-with-icon" style={{ maxWidth: '300px', width: '100%' }}>
            <Search size={14} className="input-icon" />
            <input
              type="text"
              className="form-input has-icon"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.825rem' }}
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total Registered: <strong>{users.length}</strong>
          </div>
        </div>

        {loading ? (
          <p className="page-subtitle">Loading user database...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="page-subtitle" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            No registered users found matching your search.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>
                      <strong>{u.username}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-pill ${u.role === 'ADMIN' ? 'pill-admin' : 'pill-user'}`}>
                        <span className="status-dot"></span> {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill pill-active">
                        <span className="status-dot"></span> Active
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
