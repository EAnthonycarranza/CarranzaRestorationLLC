import React from 'react';
// Removed unused imports Topbar and Navbar
import PageHeader from './PageHeader';
import Appointment from './Appointment';

function FormPage() {
  return (
    <div>
      <PageHeader title="Form" header="FormPage"/>
      <Appointment />
      {/* <Team /> */}
    </div>
  );
}

export default FormPage;
