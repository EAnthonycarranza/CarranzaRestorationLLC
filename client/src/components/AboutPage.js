import React from 'react';
// Removed unused imports Topbar and Navbar
import PageHeader from './PageHeader';
import About from './About';
import Appointment from './Appointment';
import Team from './Team';

function AboutPage() {
  return (
    <div>
      <PageHeader title="About" header="About Us"/>
      
      <section className="section-padding">
        <div className="container">
          <About />
        </div>
      </section>

      <section id="appointment-section" className="section-padding">
        <div className="container">
          <div className="section-title-wrapper text-center text-white mb-5">
            <h1 className="display-4 text-uppercase">Request a <span className="text-primary">Free Quote</span></h1>
            <div className="section-divider mx-auto"></div>
            <p className="lead mt-3">Ready to start your project? Schedule an appointment with our experts today.</p>
          </div>
          <Appointment />
        </div>
      </section>
      
      {/* <Team /> */}
    </div>
  );
}

export default AboutPage;
