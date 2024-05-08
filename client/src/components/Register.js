// Register.jsx

import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
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
    if (!regex.length.test(password)) errors.push("Must be at least 8 characters long.");
    if (!regex.upper.test(password)) errors.push("Must include an uppercase letter.");
    if (!regex.lower.test(password)) errors.push("Must include a lowercase letter.");
    if (!regex.number.test(password)) errors.push("Must include a number.");
    if (!regex.special.test(password)) errors.push("Must include a special character.");

    return errors;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: "30495169830-n8gedt6t0sl5b7v6ur0t9hkrn4j2uako.apps.googleusercontent.com",
      callback: handleGoogleRegister,
    });
    window.google?.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { theme: "outline", size: "large" }
    );
  }, []);
  
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
      setLoading(false);
  
      if (res.ok) {
        localStorage.setItem('jwtToken', data.token);
        navigate('/dashboard');
      } else {
        setError('Google login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during Google login. Please try again.');
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePassword(password);
    setPasswordError(errors);
    setShowPasswordErrors(true);

    if (errors.length > 0) {
      setError('Please correct the errors below.');
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username })
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log('Registration success:', data);
        setRegistered(true);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register');
    }
  };

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '' && username.trim() !== '';
  };

  const handleGoogleSuccess = async (googleData) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleData.tokenId }),
      });

      const data = await res.json();
      if (res.status === 200) {
        console.log('Google auth success:', data);
        setRegistered(true);
      } else {
        setError(data.message || 'Failed to authenticate with Google');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      setError('Failed to authenticate with Google');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Login Failure:', error);
    setError('Google Login Failed. Please try again.');
  };
  

  return (
    <div className="container my-5">
      <div className="card">
          <div className="card-body1">
      <h2>User Registration</h2>
      {registered && <div className="alert alert-success">Registered Successfully!</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">Username</label>
          <input type="text" className="form-control" id="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email address</label>
          <input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', marginbotton: '5px' }}>
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input type="password" className="form-control" id="passwordInput" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {showPasswordErrors && passwordError.map((err, index) => (
            <div key={index} className="text-danger">{err}</div>
          ))}
                  <button type="submit" className="btn btn-primary" style={{margintop: '10px !important'}} disabled={!isFormValid()}>Register</button>
        </div>
      </form>
      <div id="googleSignInButton"></div>
      <div className="mt-3">
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
