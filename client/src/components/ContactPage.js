import React from 'react';
import PageHeader from './PageHeader.js'; // Adjust the path as necessary
import Contact from './Contact';     // Adjust the path as necessary

function TeamPage() {
  return (
    <div>
      {/* PageHeader component with a title */}
      <PageHeader title="Contact Us" header="Contact"/>

      {/* Testimonial component */}
      <Contact />
    </div>
  );
}

export default TeamPage;
