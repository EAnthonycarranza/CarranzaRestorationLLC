// FileName: Portfolio.js
import React, { useEffect } from 'react';

const Portfolio = () => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.defer = true;
    // Append script to the body
    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty array ensures this effect runs only once

  return (
    <div className="portfolio-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="container-fluid bg-light py-6 px-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
          <h1 className="display-5 text-uppercase mb-4">See Our <span className="text-primary">TOP-PICKED</span> Amazing Projects</h1>
        </div>

        <div className="elfsight-app-8a9461ed-6b26-46b1-81bb-899d191c5ecc" data-elfsight-app-lazy></div>
        <div className="elfsight-app-2f3d3eac-9a2e-4906-b699-0163e5e24d68" data-elfsight-app-lazy></div>
      </div>
    </div>
  );
}

export default Portfolio;

