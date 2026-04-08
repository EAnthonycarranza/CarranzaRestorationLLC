import React from 'react';
import { useNavigate } from 'react-router-dom';
import carousel1Image from '../img/carousel-1.jpg';
import carousel2Image from '../img/carousel-2.jpg';
import carousel3Image from '../img/carousel-3.jpg';

const Carousel = ({ scrollToAppointment }) => { 
  const navigate = useNavigate();

  return (
    <div className="container-fluid p-0">
      <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="w-100" src={carousel1Image} alt="Expert Home Restoration" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3 text-center" style={{ maxWidth: '1000px' }}>
                <i className="fa fa-home fa-4x text-primary mb-4 d-none d-md-inline-block"></i>
                <h1 className="display-1 text-uppercase text-white mb-4">Restoring Homes, Rebuilding Hope</h1>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button className="btn btn-primary py-3 px-5 fw-bold" onClick={() => navigate('/contact')}>
                    Contact Us
                  </button>
                  <button className="btn btn-outline-light-modern" onClick={() => navigate('/about')}>
                    Our Story
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="carousel-item">
            <img className="w-100" src={carousel2Image} alt="Trusted Construction Services" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3 text-center" style={{ maxWidth: '1000px' }}>
                <i className="fa fa-tools fa-4x text-primary mb-4 d-none d-md-inline-block"></i>
                <h1 className="display-1 text-uppercase text-white mb-4">Trusted Excellence In Every Project</h1>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button className="btn btn-primary py-3 px-5 fw-bold" onClick={() => navigate('/services')}>
                    Our Services
                  </button>
                  <button className="btn btn-outline-light-modern" onClick={() => navigate('/project')}>
                    View Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <img className="w-100" src={carousel3Image} alt="Professional Estimates" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3 text-center" style={{ maxWidth: '1000px' }}>
                <i className="fa fa-calculator fa-4x text-primary mb-4 d-none d-md-inline-block"></i>
                <h1 className="display-1 text-uppercase text-white mb-4">Precision Estimates That Empower</h1>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button className="btn btn-primary py-3 px-5 fw-bold" onClick={scrollToAppointment}>
                    Schedule Inspection
                  </button>
                  <button className="btn btn-outline-light-modern" onClick={() => navigate('/testimonial')}>
                    Success Stories
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
          <div className="carousel-control-custom-icon">
            <i className="fa fa-chevron-left"></i>
          </div>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
          <div className="carousel-control-custom-icon">
            <i className="fa fa-chevron-right"></i>
          </div>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Carousel;
