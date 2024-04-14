import React from 'react';

const GoogleLogoutButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="google-logout-button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 11-5.656 5.656M5.172 5.172a4 4 0 115.656-5.656"
        />
      </svg>
      Logout
    </button>
  );
};

export default GoogleLogoutButton;
