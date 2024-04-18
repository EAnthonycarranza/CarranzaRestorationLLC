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
          } else {
              throw new Error(`Failed to fetch popular links: ${response.status}`);
          }
      } catch (error) {
          console.error('Error fetching popular links:', error);
      }
  };

  const trackClick = async (url) => {
      try {
          await fetch('/api/track-click', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url })
          });
      } catch (error) {
          console.error('Error sending track data:', error);
      }
  };

  const handleLinkClick = (url) => {
      trackClick(url);
      fetchPopularLinks();  // Refetch the popular links to update the list immediately
  };

  const linkNames = {
      '/': 'Home',
      '/about': 'About Us',
      '/services': 'Our Services',
      '/contact': 'Contact Us',
      '/testimonial': 'Our Testimonials',
      '/dashboard': 'User Dashboard',
      '/blog': 'Blogs',
      '/project': 'Our Projects'
  };

  // Sorting and filtering links based on clicks
  const visibleLinks = popularLinks.filter(link => link.clicks >= 4).sort((a, b) => b.clicks - a.clicks).slice(0, 4);

    return (
      <>
          <div className="footer container-fluid position-relative bg-dark bg-light-radial text-white-50 py-6 px-5">
              <div className="row g-5">
                  <div className="col-lg-6 pe-lg-5 d-flex flex-column align-items-center text-center">
                      <button className="navbar-brand top-page-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                          <img src={logoSvg} alt="Carranza Logo" className="mb-2 logo-img" style={{ height: '2em' }}/>
                          <h1 className="m-0 text-3xl text-uppercase text-white">Carranza Restoration LLC</h1>
                      </button>
                      <p>Welcome to Carranza Restoration LLC, your trusted partner in home improvement. Our comprehensive services include expert estimates, meticulous home renovations, construction cleaning, content manipulation, and interior design solutions. Trust us to transform your vision into reality.</p>
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
                          <a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank" rel="noopener noreferrer">
                              <button className="btn btn-lg btn-primary btn-lg-square rounded-0 me-2">
                                  <i className="fab fa-google"></i>
                              </button>
                          </a>
                      </div>
                  </div>
                  <div className="col-lg-6 ps-lg-5">
                      <div className="row g-5">
                          <div className="col-sm-6">
                              <h4 className="text-white text-uppercase mb-4 text-center">Quick Links</h4>
                              <div className="d-flex flex-column justify-content-start">
                              {Array.isArray(['/', '/about', '/services', '/contact']) && ['/', '/about', '/services', '/contact'].map(path => (
                                      <Link key={path} to={path} className="btn btn-link text-white-50 mb-2" onClick={() => handleLinkClick(path)}>
                                          <i className="fa fa-angle-right me-2"></i>{linkNames[path]}
                                      </Link>
                                  ))}
                              </div>
                          </div>
                          <div className="col-sm-6">
                              <h4 className="text-white text-uppercase mb-4 text-center">Popular Links</h4>
                              <div className="d-flex flex-column justify-content-start">
                              {Array.isArray(visibleLinks) && visibleLinks.map(link => (
                                      <Link key={link.url} to={link.url} className="btn btn-link text-white-50 mb-2" onClick={() => handleLinkClick(link.url)}>
                                          <i className="fa fa-angle-right me-2"></i>{linkNames[link.url] || link.url}
                                      </Link>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="footer-images">
                  <div className="left-images">
                      <img src={AngleImage} alt="Angel" className="footer-image angel-image" />
                      <img src={EliteImage} alt="Elite" className="footer-image elite-image" />
                      <img src={FWRImage} alt="FWR" className="footer-image fwr-image" />
                  </div>
                  <div className="right-images">
                      <img src={OwenImage} alt="Owen" className="footer-image owen-image" />
                      <img src={BImage} alt="B" className="footer-image b-image" />
                      <img src={NRCA} alt="NRCA" className="footer-image nrca-image" />
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
