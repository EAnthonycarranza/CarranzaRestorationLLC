import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogout } from '@react-oauth/google';

const LogoutButton = () => {
  const navigate = useNavigate();

  // Function to handle the logout process
  const handleLogout = async () => {
    // Clear the JWT token from local storage
    localStorage.removeItem('jwtToken');

    // Navigate to the login page or home page
    navigate('/login');

    // You can also inform the backend about the logout if needed
    // Make sure to handle any server-side cleanup as well
  };

  // This will log the user out of the Google session as well
  const { signOut } = useGoogleLogout({
    onLogoutSuccess: handleLogout,
    onFailure: () => console.log('Google logout failed'),
  });

  return (
    <button onClick={signOut} className="btn btn-danger">
      Logout
    </button>
  );
};

export default LogoutButton;
