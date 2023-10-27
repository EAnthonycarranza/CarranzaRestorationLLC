import React from 'react';
import PageHeader from './PageHeader.js'; // Adjust the path as necessary
import Services from './Services.js';     // Adjust the path as necessary
import Appointment from './Appointment.js'; // Adjust the path as necessary
import Testimonial from './Testimonial.js'; // Adjust the path as necessary

function ServicePage() {
  return (
    <div>
      {/* PageHeader component with a title */}
      <PageHeader title="Service" />

      {/* Services component */}
      <Services />

      {/* Appointment component */}
      <Appointment />

      {/* Testimonial component */}
      <Testimonial />
    </div>
  );
}

export default ServicePage;
