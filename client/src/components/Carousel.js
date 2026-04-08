import React from 'react';
import { useNavigate } from 'react-router-dom';
import carousel1Image from '../img/carousel-1.jpg';
import carousel2Image from '../img/carousel-2.jpg';
import carousel3Image from '../img/carousel-3.jpg';

const slides = [
  {
    image: carousel1Image,
    alt: 'Expert Home Restoration',
    icon: 'fa-home',
    heading: 'Restoring Homes, Rebuilding Hope',
    buttons: [
      { label: 'Contact Us', path: '/contact', style: 'primary' },
      { label: 'Our Story', path: '/about', style: 'outline' },
    ],
  },
  {
    image: carousel2Image,
    alt: 'Trusted Construction Services',
    icon: 'fa-tools',
    heading: 'Trusted Excellence In Every Project',
    buttons: [
      { label: 'Our Services', path: '/services', style: 'primary' },
      { label: 'View Portfolio', path: '/project', style: 'outline' },
    ],
  },
  {
    image: carousel3Image,
    alt: 'Professional Estimates',
    icon: 'fa-calculator',
    heading: 'Precision Estimates That Empower',
    buttons: [
      { label: 'Schedule Inspection', action: 'scroll', style: 'primary' },
      { label: 'Success Stories', path: '/testimonial', style: 'outline' },
    ],
  },
];

const Carousel = ({ scrollToAppointment }) => {
  const navigate = useNavigate();

  const handleClick = (btn) => {
    if (btn.action === 'scroll') {
      scrollToAppointment();
    } else {
      navigate(btn.path);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div
        id="header-carousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        <div className="carousel-inner">
          {slides.map((slide, idx) => (
            <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
              <img className="w-100" src={slide.image} alt={slide.alt} />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3 text-center" style={{ maxWidth: '1000px' }}>
                  <div className="carousel-icon-wrapper">
                    <i className={`fa ${slide.icon} carousel-slide-icon`}></i>
                  </div>
                  <h1 className="display-1 text-uppercase text-white mb-4">
                    {slide.heading}
                  </h1>
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                    {slide.buttons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        className={
                          btn.style === 'primary'
                            ? 'btn btn-primary py-3 px-5 fw-bold'
                            : 'btn btn-outline-light-modern'
                        }
                        onClick={() => handleClick(btn)}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#header-carousel"
          data-bs-slide="prev"
        >
          <div className="carousel-control-custom-icon">
            <i className="fa fa-chevron-left"></i>
          </div>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#header-carousel"
          data-bs-slide="next"
        >
          <div className="carousel-control-custom-icon">
            <i className="fa fa-chevron-right"></i>
          </div>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
