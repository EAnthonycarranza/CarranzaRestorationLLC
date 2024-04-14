// authUtils.js

export const setAuthToken = (token) => {
    localStorage.setItem('jwtToken', token);
  };
  
  export const getAuthToken = () => {
    return localStorage.getItem('jwtToken');
  };
  
  export const removeAuthToken = () => {
    localStorage.removeItem('jwtToken');
  };
  