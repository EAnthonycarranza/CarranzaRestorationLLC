import React from 'react';
import logoSvg from '../img/Logo2.svg';

const Footer = () => {
  return (
    <>
      <div className="footer container-fluid position-relative bg-dark bg-light-radial text-white-50 py-6 px-5">
        <div className="row g-5">
          <div className="col-lg-6 pe-lg-5 d-flex flex-column align-items-center text-center">
            <button className="navbar-brand">
              <img src={logoSvg} alt="Carranza Logo" className="mb-2" style={{ height: '2em' }}/>
              {window.innerWidth <= 1100 ? (
                <h1 className="m-0 text-3xl text-uppercase text-white">
                  Carranza <br />
                  Restoration LLC
                </h1>
              ) : (
                <h1 className="m-0 text-3xl text-uppercase text-white">
                  Carranza Restoration LLC
                </h1>
              )}
            </button>
            <p>Aliquyam sed elitr elitr erat sed diam ipsum eirmod eos lorem nonumy. Tempor sea ipsum diam  sed clita dolore eos dolores magna erat dolore sed stet justo et dolor.</p>
            <button className="btn btn-link" onClick={() => window.open("https://maps.google.com?q=100%20Commercial%20Place,%20Schertz,%20TX", "_blank")}>
              <p><i className="fa fa-map-marker-alt me-2"></i>100 Commercial Place, Schertz, TX</p>
            </button>
            <button className="btn btn-link" onClick={() => window.location.href = "tel:(210) 267-1008"}>
              <p><i className="fa fa-phone-alt me-2"></i>(210) 267-1008</p>
            </button>
            <button className="btn btn-link" onClick={() => window.location.href = "mailto:admin@carranzarestoration.com"}>
              <p><i className="fa fa-envelope me-2"></i>admin@carranzarestoration.com</p>
            </button>

            <div className="d-flex justify-content-start mt-4">
              <button className="btn btn-lg btn-primary btn-lg-square rounded-0 me-2"><i className="fab fa-twitter"></i></button>
              <button className="btn btn-lg btn-primary btn-lg-square rounded-0 me-2"><i className="fab fa-facebook-f"></i></button>
              <button className="btn btn-lg btn-primary btn-lg-square rounded-0 me-2"><i className="fab fa-linkedin-in"></i></button>
              <button className="btn btn-lg btn-primary btn-lg-square rounded-0"><i className="fab fa-instagram"></i></button>
            </div>
          </div>
          <div className="col-lg-6 ps-lg-5">
            <div className="row g-5">
              <div className="col-sm-6">
                <h4 className="text-white text-uppercase mb-4">Quick Links</h4>
                <div className="d-flex flex-column justify-content-start">
                  <button className="btn btn-link text-white-50 mb-2"><i className="fa fa-angle-right me-2"></i>Home</button>
                  <button className="btn btn-link text-white-50 mb-2"><i className="fa fa-angle-right me-2"></i>About Us</button>
                  <button className="btn btn-link text-white-50 mb-2"><i className="fa fa-angle-right me-2"></i>Our Services</button>
                  <button className="btn btn-link text-white-50 mb-2"><i className="fa fa-angle-right me-2"></i>Meet The Team</button>
                  <button className="btn btn-link text-white-50"><i className="fa fa-angle-right me-2"></i>Contact Us</button>
                </div>
              </div>
              <div className="col-sm-6">
                <h4 className="text-white text-uppercase mb-4">Popular Links</h4>
                <div className="d-flex flex-column justify-content-start">
                  <button className="btn btn-link text-white-50 mb-2"><i className="fa fa-angle-right me-2"></i>Home</button>
                  <button className="btn btn-link text-white-50 mb-2"><i className="fa fa-angle-right me-2"></i>About Us</button>
                  <button className="btn btn-link text-white-50 mb-2"><i className="fa fa-angle-right me-2"></i>Our Services</button>
                  <button className="btn btn-link text-white-50 mb-2"><i className="fa fa-angle-right me-2"></i>Meet The Team</button>
                  <button className="btn btn-link text-white-50"><i className="fa fa-angle-right me-2"></i>Contact Us</button>
                </div>
              </div>
              <div className="col-sm-12">
                <h4 className="text-white text-uppercase mb-4">Newsletter</h4>
                <div className="w-100">
                  <div className="input-group">
                    <input type="text" className="form-control border-light" style={{padding: '20px 30px'}} placeholder="Your Email Address"/>
                    <button className="btn btn-primary px-4">Sign Up</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid bg-dark bg-light-radial text-white border-top border-primary px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between">
          <div className="py-4 px-5 text-center text-md-start">
            <p className="mb-0">&copy; <button className="btn btn-link text-primary">Carranza Restoration LLC</button>. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
