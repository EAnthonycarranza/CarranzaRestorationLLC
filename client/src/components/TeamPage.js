import React from 'react';
import PageHeader from './PageHeader.js'; // Adjust the path as necessary
import Team from './Team.js';     // Adjust the path as necessary

function TeamPage() {
  return (
    <div>
      {/* PageHeader component with a title */}
      <PageHeader title="The Team" header="Team"/>

      {/* Testimonial component */}
      <Team />
    </div>
  );
}

export default TeamPage;
