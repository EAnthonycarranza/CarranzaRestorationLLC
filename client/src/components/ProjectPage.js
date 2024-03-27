// ProjectPage.js
import React from 'react';
import PageHeader from './PageHeader';
import Portfolio from './Portfolio';
import Portfolio2 from './Portfolio-2';
function ProjectPage() {
  return (
    <div>
      <PageHeader title="Our Projects" header="Projects"/>
      <Portfolio />
      <Portfolio2 />
    </div>
  );
}

export default ProjectPage;
