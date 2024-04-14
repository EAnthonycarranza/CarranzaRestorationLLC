import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate instead of useHistory

const AuthSuccess = () => {
  const navigate = useNavigate(); // Use useNavigate hook
  const location = useLocation();

  useEffect(() => {
    const { search } = location;
    const params = new URLSearchParams(search);
    const token = params.get('token');

    if (token) {
      // Store the token locally
      localStorage.setItem('jwtToken', token);
      // Use navigate to redirect, replace 'history.push' with 'navigate'
      navigate('/'); // Adjust as needed
    } else {
      // Handle error or token missing case
      console.error('Token not found.');
      navigate('/login'); // Adjust as needed
    }
  }, [navigate, location]); // Update dependency array

  return null; // Adjust as needed, based on your UI requirements
};

export default AuthSuccess;
