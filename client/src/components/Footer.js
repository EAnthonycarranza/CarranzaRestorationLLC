import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../img/0juOOO01.svg';
import AngleImage from '../img/AngieListimg.png';
import EliteImage from '../img/EliteServiceimg.png';
import FWRImage from '../img/FWRimg.png';
import OwenImage from '../img/OwensCorningimg.png';
import BImage from '../img/BBBimg.png';
import NRCA from '../img/NRCA.png';

const Footer = () => {
  const [popularLinks, setPopularLinks] = useState([]);

  useEffect(() => {
    fetchPopularLinks();
  }, []);

  const fetchPopularLinks = async () => {
    try {
      const response = await fetch('/api/get-popular-links');
      if (response.ok) {
        const data = await response.json();
        setPopularLinks(data);
      }
    } catch (error) {
      console.error('Error fetching popular links:', error);
    }
  };

  const trackClick = async (url) => {
    try {
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
    } catch (error) {
      console.error('Error sending track data:', error);
    }
  };

  const handleLinkClick = (url) => {
    trackClick(url);
    fetchPopularLinks();
  };

  const linkNames = {
    '/': 'Home',
    '/about': 'About Us',
    '/services': 'Our Services',
    '/contact': 'Contact Us',
    '/testimonial': 'Testimonials',
    '/dashboard': 'Dashboard',
    '/blog': 'Blog',
    '/project': 'Projects'
  };

  const visibleLinks = popularLinks.filter(link => link.clicks >= 4).sort((a, b) => b.clicks - a.clicks).slice(0, 4);

  return (
    <footer className="footer pt-5">
      <div className="container-modern">
        <div className="row g-5">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-inline-block mb-4" onClick={() => handleLinkClick('/')}>
              <img src={logoSvg} alt="Carranza Logo" height="60" />
            </Link>
            <h2 className="footer-brand-title">Carranza Restoration LLC</h2>
            <p className="footer-text">
              Your trusted partner in home improvement. We transform your vision into reality with expert craftsmanship and unwavering integrity.
            </p>
            <div className="d-flex gap-3">
              <a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="footer-social-btn">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="footer-social-btn">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-lg-2 col-md-6">
            <h4 className="text-white text-uppercase mb-4 fw-bold">Explore</h4>
            <div className="d-flex flex-column">
              {['/', '/about', '/services', '/project'].map(path => (
                <Link key={path} to={path} className="footer-link" onClick={() => handleLinkClick(path)}>
                  <i className="fa fa-chevron-right me-2 small" style={{ fontSize: '0.7rem' }}></i>
                  {linkNames[path]}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Links Column */}
          <div className="col-lg-2 col-md-6">
            <h4 className="text-white text-uppercase mb-4 fw-bold">Trending</h4>
            <div className="d-flex flex-column">
              {visibleLinks.length > 0 ? visibleLinks.map(link => (
                <Link key={link.url} to={link.url} className="footer-link" onClick={() => handleLinkClick(link.url)}>
                  <i className="fa fa-chevron-right me-2 small" style={{ fontSize: '0.7rem' }}></i>
                  {linkNames[link.url] || link.url}
                </Link>
              )) : ['/blog', '/testimonial', '/contact', '/dashboard'].map(path => (
                <Link key={path} to={path} className="footer-link" onClick={() => handleLinkClick(path)}>
                  <i className="fa fa-chevron-right me-2 small" style={{ fontSize: '0.7rem' }}></i>
                  {linkNames[path]}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div className="col-lg-4 col-md-6">
            <h4 className="text-white text-uppercase mb-4 fw-bold">Contact Us</h4>
            <button className="footer-contact-item" onClick={() => window.open("https://maps.google.com?q=100%20Commercial%20Place,%20Schertz,%20TX", "_blank")}>
              <i className="fa fa-map-marker-alt"></i>
              <span>100 Commercial Place, Schertz, TX 78154</span>
            </button>
            <button className="footer-contact-item" onClick={() => window.location.href = "tel:2102671008"}>
              <i className="fa fa-phone-alt"></i>
              <span>(210) 267-1008</span>
            </button>
            <button className="footer-contact-item" onClick={() => window.location.href = "mailto:admin@carranzarestoration.com"}>
              <i className="fa fa-envelope"></i>
              <span>admin@carranzarestoration.com</span>
            </button>
          </div>
        </div>

        {/* Partners Section */}
        <div className="footer-images">
          <img src={AngleImage} alt="Angie's List" className="footer-image" />
          <img src={EliteImage} alt="Elite Service" className="footer-image" />
          <img src={FWRImage} alt="FWR" className="footer-image" />
          <img src={OwenImage} alt="Owens Corning" className="footer-image" />
          <img src={BImage} alt="BBB" className="footer-image" />
          <img src={NRCA} alt="NRCA" className="footer-image" />
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="copyright-bar">
        <div className="container-modern">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-white-50">
                &copy; {new Date().getFullYear()} <span className="text-white fw-bold">Carranza Restoration LLC</span>. All Rights Reserved. | Created by <a href="https://codingcarranza.com/" target="_blank" rel="noopener noreferrer" className="text-white fw-bold text-decoration-none">Coding Carranza</a>
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
              <div className="d-flex justify-content-center justify-content-md-end gap-4">
                <Link to="/" className="text-white-50 small text-decoration-none">Privacy Policy</Link>
                <Link to="/" className="text-white-50 small text-decoration-none">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
