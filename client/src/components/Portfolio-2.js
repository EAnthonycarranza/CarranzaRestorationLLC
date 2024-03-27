// FileName: Portfolio.jsx
import React from 'react';
import { ElfsightWidget } from 'react-elfsight-widget';
const Portfolio2 = () => {
  return (
    <div className="portfolio-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="container-fluid">
        <div className="text-center">
        </div>
        <ElfsightWidget widgetID="2f3d3eac-9a2e-4906-b699-0163e5e24d68" />
      </div>
    </div>
  );
}

export default Portfolio2;
