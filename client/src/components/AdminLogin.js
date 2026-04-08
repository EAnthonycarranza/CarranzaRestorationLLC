import React, { useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import './Auth.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/login', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);
      setError('Admin login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Admin Access</h2>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        
        {loading ? (
          <div className="text-center my-5">
            <TailSpin color="var(--nav-accent)" height={80} width={80} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="mb-4">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-control auth-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 auth-btn">Secure Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;