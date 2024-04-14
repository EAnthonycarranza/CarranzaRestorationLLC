import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { TailSpin } from 'react-loader-spinner';

const clientId = "30495169830-n8gedt6t0sl5b7v6ur0t9hkrn4j2uako.apps.googleusercontent.com"; // Replace with your actual Google Client ID

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
    setLoading(true); // Start loading
  
    setTimeout(async () => {
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
          setLoading(false); // Stop loading on error
        }
      } catch (error) {
        setError('An error occurred during Google login. Please try again.');
        setLoading(false); // Stop loading on catch
      }
    }, 1250); // Ensures the loading spinner shows for at least 10 seconds
  };
  
  

  const handleLogoutSuccess = () => {
    googleLogout();
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading
  
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('jwtToken', data.token);
        navigate('/dashboard');  // You might navigate them to a different dashboard if needed
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false); // Stop loading regardless of the outcome
    }
  };
  

  return   (
    <div className="container my-5">
      <h2 className="mb-4">User Login</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading ? (
        <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '20vh',  // Adjust the height to place the spinner near the top
          marginTop: '20px'  // Provide some top margin to line up with "User Login"
        }}>
          <TailSpin color="rgb(253, 93, 20)" height={100} width={100} />
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">
                  
                  <i className="fa fa-solid fa-envelope me-2 text-primary"></i>Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">
                  <i className="fa fa-solid fa-lock me-2 text-primary"></i>Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">Login</button>
            </form>
            {/* Divider */}
            <div className="text-center mb-3">
              <hr />
              Or continue with Google
            </div>
            <GoogleLogin
              clientId={clientId}
              buttonText="Register with Google"
              onSuccess={handleGoogleLogin}
              onError={() => setError('Google Login Failed')}
              className="btn btn-outline-danger btn-lg w-100 mb-3"
            />
            {/* Sign Up Link */}
            <div className="text-center mt-3">
              <Link to="/register" className="link-primary">Create an account</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Login;
