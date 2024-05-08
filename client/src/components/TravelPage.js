import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PageHeader from './PageHeader.js'; // Adjust the path as necessary
import Travel from './Travel';             // Adjust the path as necessary

function TeamPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {/* PageHeader component with a title */}
        <PageHeader title="Travel" header="Travel"/>

        {/* Travel component */}
        <Travel />
      </div>
    </DndProvider>
  );
}

export default TeamPage;
