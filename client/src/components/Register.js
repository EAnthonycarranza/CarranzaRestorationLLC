import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { TailSpin } from 'react-loader-spinner';
import './Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState([]);
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = {
      length: /.{8,}/,
      upper: /[A-Z]/,
      lower: /[a-z]/,
      number: /[0-9]/,
      special: /[^A-Za-z0-9]/
    };

    const errors = [];
    if (!regex.length.test(password)) errors.push("At least 8 characters long");
    if (!regex.upper.test(password)) errors.push("Include an uppercase letter");
    if (!regex.lower.test(password)) errors.push("Include a lowercase letter");
    if (!regex.number.test(password)) errors.push("Include a number");
    if (!regex.special.test(password)) errors.push("Include a special character");

    return errors;
  };

  const handleGoogleRegister = async (response) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('jwtToken', data.token);
        navigate('/dashboard');
      } else {
        setError('Google registration failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      setError('An error occurred during Google registration.');
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const errors = validatePassword(password);
    setPasswordError(errors);
    setShowPasswordErrors(true);

    if (errors.length > 0) {
      setError('Please correct the password requirements.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      const data = await response.json();

      if (response.status === 201) {
        setLoading(false);
        navigate('/login');
      } else {
        setError(data.message || 'Failed to register');
        setLoading(false);
      }
    } catch (error) {
      setError('An error occurred during registration.');
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '' && username.trim() !== '';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <div className="text-center my-5">
            <TailSpin color="var(--nav-accent)" height={80} width={80} />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  className="form-control auth-input" 
                  placeholder="johndoe"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email address</label>
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
                {showPasswordErrors && passwordError.length > 0 && (
                  <ul className="password-error-list">
                    {passwordError.map((err, index) => (
                      <li key={index} className="password-error-item">{err}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100 auth-btn" 
                disabled={!isFormValid()}
              >
                Register
              </button>
            </form>

            <div className="auth-divider">Or join with</div>

            <div className="google-btn-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => setError('Google Registration Failed')}
                theme="outline"
                size="large"
                width="100%"
              />
            </div>

            <p className="auth-footer-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
