import React from 'react';
import PageHeader from './PageHeader.js'; // Adjust the path as necessary
import Services from './Services.js';     // Adjust the path as necessary
import Appointment from './Appointment.js'; // Adjust the path as necessary
import Testimonial from './Testimonial.js'; // Adjust the path as necessary

function ServicePage() {
  return (
    <div>
      <PageHeader title="Services" header="Service"/>

      <section className="section-padding">
        <div className="container">
          <div className="section-title-wrapper text-center mb-5">
            <h1 className="display-4 text-uppercase">Our Professional <span className="text-primary">Services</span></h1>
            <div className="section-divider mx-auto"></div>
            <p className="lead mt-3">We offer a wide range of restoration and renovation services tailored to your needs.</p>
          </div>
          <Services />
        </div>
      </section>

      <section id="appointment-section" className="section-padding">
        <div className="container">
          <div className="section-title-wrapper text-center text-white mb-5">
            <h1 className="display-4 text-uppercase text-white">Request a <span className="text-primary">Free Quote</span></h1>
            <div className="section-divider mx-auto"></div>
            <p className="lead mt-3">Ready to start your project? Schedule an appointment with our experts today.</p>
          </div>
          <Appointment />
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-title-wrapper text-center mb-5">
            <h1 className="display-4 text-uppercase">Client <span className="text-primary">Testimonials</span></h1>
            <div className="section-divider mx-auto"></div>
            <p className="lead mt-3">What our valued customers say about our work.</p>
          </div>
          <Testimonial />
        </div>
      </section>
    </div>
  );
}

export default ServicePage;
