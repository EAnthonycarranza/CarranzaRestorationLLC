import React from 'react';
// Removed unused imports Topbar and Navbar
import PageHeader from './PageHeader';
import About from './About';
import Appointment from './Appointment';
import Team from './Team';

function AboutPage() {
  return (
    <div>
      <PageHeader title="About Us" />
      <About />
      <Appointment />
      <Team />
    </div>
  );
}

export default AboutPage;
