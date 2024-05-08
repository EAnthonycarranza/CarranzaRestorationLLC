import React from 'react';
// Removed unused imports Topbar and Navbar
import PageHeader from './PageHeader';
import Register from './Register';

function RegisterPage() {
  return (
    <div>
      <PageHeader title="Register" header="Register Page"/>
      <Register />
      {/* <Team /> */}
    </div>
  );
}

export default RegisterPage;
