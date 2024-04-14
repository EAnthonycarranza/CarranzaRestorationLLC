import React from 'react';

const AdminLogout = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the stored token
    onLogout(); // Call the onLogout callback to update the parent component's state
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
  );
};

export default AdminLogout;
