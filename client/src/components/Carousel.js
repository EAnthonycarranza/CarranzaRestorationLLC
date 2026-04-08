import React, { useState, useEffect, useCallback } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync with Bootstrap carousel slide events
  useEffect(() => {
    const el = document.getElementById('header-carousel');
    if (!el) return;
    const handler = (e) => setActiveIndex(e.to);
    el.addEventListener('slid.bs.carousel', handler);
    return () => el.removeEventListener('slid.bs.carousel', handler);
  }, []);

  const handleClick = useCallback((btn) => {
    if (btn.action === 'scroll') {
      scrollToAppointment();
    } else {
      navigate(btn.path);
    }
  }, [navigate, scrollToAppointment]);

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
                <div className="carousel-caption-content text-center">
                  <div className="carousel-icon-wrapper">
                    <i className={`fa ${slide.icon} carousel-slide-icon`}></i>
                  </div>
                  <h1 className="display-1 text-uppercase text-white mb-4">
                    {slide.heading}
                  </h1>
                  <div className="carousel-btn-group d-flex flex-column flex-sm-row justify-content-center gap-3">
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

        {/* Desktop: side arrows (hidden on mobile) */}
        <button
          className="carousel-control-prev carousel-control-desktop"
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
          className="carousel-control-next carousel-control-desktop"
          type="button"
          data-bs-target="#header-carousel"
          data-bs-slide="next"
        >
          <div className="carousel-control-custom-icon">
            <i className="fa fa-chevron-right"></i>
          </div>
          <span className="visually-hidden">Next</span>
        </button>

        {/* Mobile: bottom nav bar with arrows + indicators (hidden on desktop) */}
        <div className="carousel-mobile-nav">
          <button
            className="carousel-mobile-btn"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
            aria-label="Previous slide"
          >
            <i className="fa fa-chevron-left"></i>
          </button>

          <div className="carousel-indicators-custom">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                data-bs-target="#header-carousel"
                data-bs-slide-to={idx}
                className={`carousel-dot ${activeIndex === idx ? 'active' : ''}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            className="carousel-mobile-btn"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
            aria-label="Next slide"
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
