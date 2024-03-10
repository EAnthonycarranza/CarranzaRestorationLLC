import React from 'react';
// Removed unused imports Topbar and Navbar
import PageHeader from './PageHeader';
import PaymentFormComponent from './PaymentFormComponent';

function PaymentPage() {
  return (
    <div>
      <PageHeader title="Payment" header="Payment"/>
      <PaymentFormComponent />
    </div>
  );
}

export default PaymentPage;
