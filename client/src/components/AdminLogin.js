import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      // Replace this URL with your API endpoint
      const response = await axios.post('/api/admin/login', {
        email,
        password,
      });

      // Assuming your server responds with a token upon successful authentication
      const token = response.data.token;
      localStorage.setItem('token', token); // Store the token in localStorage

      onLoginSuccess(); // Notify the parent component about the successful login
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="container my-5">
      <h2>Admin Login</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email address</label>
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
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;