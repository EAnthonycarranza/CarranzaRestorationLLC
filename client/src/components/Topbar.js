import React from 'react';

const Topbar = () => {
  return (
    <div className="topbar-modern d-none d-lg-block">
      <div className="container-modern">
        <div className="row align-items-center">
          <div className="col-lg-4">
            <a href="https://maps.google.com?q=100%20Commercial%20Place,%20Schertz,%20TX" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="topbar-item">
              <div className="topbar-icon-circle">
                <i className="fa fa-map-marker-alt"></i>
              </div>
              <div>
                <span className="topbar-label">Our Office</span>
                <span className="topbar-text">100 Commercial Place, Schertz, TX</span>
              </div>
            </a>
          </div>
          <div className="col-lg-4">
            <a href="mailto:admin@carranzarestoration.com" className="topbar-item">
              <div className="topbar-icon-circle">
                <i className="fa fa-envelope"></i>
              </div>
              <div>
                <span className="topbar-label">Email Us</span>
                <span className="topbar-text">admin@carranzarestoration.com</span>
              </div>
            </a>
          </div>
          <div className="col-lg-4">
            <a href="tel:2102671008" className="topbar-item justify-content-lg-end">
              <div className="topbar-icon-circle">
                <i className="fa fa-phone-alt"></i>
              </div>
              <div>
                <span className="topbar-label">Call Us</span>
                <span className="topbar-text">(210) 267-1008</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;