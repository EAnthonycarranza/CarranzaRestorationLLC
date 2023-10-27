import React from 'react';

const Topbar = () => {
    return (
      <>
        <div className="container-fluid px-5 d-none d-lg-block">
          <div className="row gx-5">
            <div className="col-lg-4 text-center py-3">
              <div className="d-inline-flex align-items-center">
                <i className="bi bi-geo-alt fs-1 text-primary me-3"></i>
                <div className="text-start">
                  <h6 className="text-uppercase fw-bold">Our Office</h6>
                  <a href="https://maps.google.com?q=100%20Commercial%20Place,%20Schertz,%20TX" target="_blank" rel="noopener noreferrer">
                    <p><i className="fa fa-map-marker-alt me-2"></i>100 Commercial Place, Schertz, TX</p>
                  </a>  
                    </div>
                </div>
            </div>
            <div className="col-lg-4 text-center border-start border-end py-3">
                <div className="d-inline-flex align-items-center">
                    <i className="bi bi-envelope-open fs-1 text-primary me-3"></i>
                    <div className="text-start">
                        <h6 className="text-uppercase fw-bold">Email Us</h6>
                        <a href="mailto:admin@carranzarestoration.com">
  <p><i className="fa fa-envelope me-2"></i>admin@carranzarestoration.com</p>
</a>

                    </div>
                </div>
            </div>
            <div className="col-lg-4 text-center py-3">
                <div className="d-inline-flex align-items-center">
                    <i className="bi bi-phone-vibrate fs-1 text-primary me-3"></i>
                    <div className="text-start">
                        <h6 className="text-uppercase fw-bold">Call Us</h6>
                        <a href="tel:(210) 267-1008">
  <p><i className="fa fa-phone-alt me-2"></i>(210) 267-1008</p>
</a>

                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}

export default Topbar;