import React from 'react';
// Removed unused imports Topbar and Navbar
import PageHeader from './PageHeader';
import Login from './Login';

function LoginPage() {
  return (
    <div>
      <PageHeader title="Login" header="Login Page"/>
      <Login />
      {/* <Team /> */}
    </div>
  );
}

export default LoginPage;
