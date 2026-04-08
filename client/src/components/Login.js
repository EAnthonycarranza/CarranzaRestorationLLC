import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { TailSpin } from 'react-loader-spinner';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleGoogleLogin = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('jwtToken', data.token);
        navigate('/dashboard');
      } else {
        setError('Google login failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      setError('An error occurred during Google login. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('jwtToken', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        
        {loading ? (
          <div className="text-center my-5">
            <TailSpin color="var(--nav-accent)" height={80} width={80} />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="mb-4">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="name@example.com"
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
              <button type="submit" className="btn btn-primary w-100 auth-btn">Login</button>
            </form>

            <div className="auth-divider">Or continue with</div>

            <div className="google-btn-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google Login Failed')}
                useOneTap
                theme="outline"
                size="large"
                width="100%"
              />
            </div>

            <p className="auth-footer-text">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>

            <div className="admin-link-wrapper">
              <Link to="/admindashboard" className="admin-link">Admin Dashboard</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
