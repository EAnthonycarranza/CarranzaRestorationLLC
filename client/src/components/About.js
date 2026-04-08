import React from 'react';
import { useNavigate } from 'react-router-dom';
import aboutImage from '../img/carousel-1.jpg';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-section">
      <div className="row g-5 align-items-center">
        <div className="col-lg-7">
          <div className="pe-lg-5">
            <h1 className="display-5 text-uppercase mb-4">
              We are <span className="text-primary">EXPERTS</span> in Home Improvement Industry
            </h1>
            <h4 className="text-uppercase mb-3 text-body" style={{ letterSpacing: '1px' }}>
              Experience Excellence in Home Restoration and Renovation Services
            </h4>
            <p className="lead mb-4">
              With over 21 years of experience in reconstruction and restoration, we proudly serve San Antonio, Austin and surrounding areas with unwavering integrity and dedication to fulfilling your project requirements!
            </p>
            <div className="row gx-5 py-3">
              <div className="col-sm-6 mb-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="btn-sm-square bg-primary rounded-circle me-3">
                    <i className="fa fa-check text-white"></i>
                  </div>
                  <span className="fw-bold text-dark">Expert Estimates</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="btn-sm-square bg-primary rounded-circle me-3">
                    <i className="fa fa-check text-white"></i>
                  </div>
                  <span className="fw-bold text-dark">Meticulous Renovations</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="btn-sm-square bg-primary rounded-circle me-3">
                    <i className="fa fa-check text-white"></i>
                  </div>
                  <span className="fw-bold text-dark">Thorough Cleaning</span>
                </div>
              </div>
              <div className="col-sm-6 mb-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="btn-sm-square bg-primary rounded-circle me-3">
                    <i className="fa fa-check text-white"></i>
                  </div>
                  <span className="fw-bold text-dark">Dedicated Service</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="btn-sm-square bg-primary rounded-circle me-3">
                    <i className="fa fa-check text-white"></i>
                  </div>
                  <span className="fw-bold text-dark">Timely Management</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="btn-sm-square bg-primary rounded-circle me-3">
                    <i className="fa fa-check text-white"></i>
                  </div>
                  <span className="fw-bold text-dark">Reliable Roofing</span>
                </div>
              </div>
            </div>
            <p className="mb-4">
              Our team excels at delivering meticulous craftsmanship and personalized service, ensuring your project is completed to the highest standards. Trust Carranza Restoration LLC to bring your vision to life with professionalism and care.
            </p>
            <button className="btn btn-primary py-3 px-5 mt-2" onClick={() => navigate('/services')}>
              View Our Services
            </button>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="position-relative h-100 overflow-hidden rounded shadow-lg animate-fadeInUp">
            <img 
              className="img-fluid w-100" 
              src={aboutImage} 
              alt="About Carranza Restoration" 
              style={{ objectFit: 'cover', minHeight: '450px', transition: 'transform 0.5s ease' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div className="position-absolute bottom-0 end-0 bg-primary text-white p-4 rounded-start">
              <h2 className="display-4 mb-0">21+</h2>
              <p className="mb-0 fw-bold text-uppercase">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
