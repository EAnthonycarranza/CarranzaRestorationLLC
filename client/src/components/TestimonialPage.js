import React from 'react';
import PageHeader from './PageHeader.js'; // Adjust the path as necessary
import Testimonial from './Testimonial';     // Adjust the path as necessary

function TeamPage() {
  return (
    <div>
      {/* PageHeader component with a title */}
      <PageHeader title="Our Testimonials" header="Testominal"/>

      {/* Testimonial component */}
      <Testimonial />
    </div>
  );
}

export default TeamPage;
