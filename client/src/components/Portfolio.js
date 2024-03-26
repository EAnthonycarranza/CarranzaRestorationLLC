// FileName: Portfolio.jsx
import React from 'react';
import { ElfsightWidget } from 'react-elfsight-widget';
const Portfolio = () => {
  return (
    <div className="portfolio-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="container-fluid bg-light py-6 px-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
          <h1 className="display-5 text-uppercase mb-4">See Our <span className="text-primary">TOP-PICKED</span> Amazing Projects</h1>
        </div>
        <ElfsightWidget widgetID="8a9461ed-6b26-46b1-81bb-899d191c5ecc" />
        <ElfsightWidget widgetID="2f3d3eac-9a2e-4906-b699-0163e5e24d68" />
      </div>
    </div>
  );
}

export default Portfolio;


