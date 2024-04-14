import React from 'react';
// Removed unused imports Topbar and Navbar
import PageHeader from './PageHeader';
import Dashboard from './Dashboard';

function DashboardPage() {
  return (
    <div>
      <PageHeader title="User Dashboard" header="Dashboard"/>
      <Dashboard />
      {/* <Team /> */}
    </div>
  );
}

export default DashboardPage;
