import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Custom Link Component for scrolling to top
const ScrollToTopLink = ({ to, className, children, closeDropdown }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
    if (closeDropdown) {
      closeDropdown(); // Close dropdown when link is clicked
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

// Navbar Component
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const isDropdownActive = () => {
    const paths = ['/project', '/team', '/testimonial'];
    return paths.includes(location.pathname);
  };

  return (
    <div className="container-fluid sticky-top bg-dark bg-light-radial shadow-sm px-5 pe-lg-0">
      <nav className="navbar navbar-expand-lg bg-dark bg-light-radial navbar-dark py-3 py-lg-0">
      <ScrollToTopLink to="/" className="navbar-brand">
  <h1 className="brand-title">
    <i className="bi bi-building text-primary me-2"></i>
    <span className="brand-name">Carranza</span>
    <span className="brand-description">Restoration LLC</span>
  </h1>
</ScrollToTopLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto py-0">
            <ScrollToTopLink to="/" className={`nav-item nav-link ${isActive('/') ? 'active' : ''}`}>Home</ScrollToTopLink>
            <ScrollToTopLink to="/about" className={`nav-item nav-link ${isActive('/about') ? 'active' : ''}`}>About</ScrollToTopLink>
            <ScrollToTopLink to="/services" className={`nav-item nav-link ${isActive('/services') ? 'active' : ''}`}>Service</ScrollToTopLink>
            <div className="nav-item dropdown">
              <button className={`nav-link dropdown-toggle ${isDropdownActive() ? 'active' : ''}`} onClick={toggleDropdown}>Pages</button>
              <div className={`dropdown-menu m-0 ${isDropdownOpen ? 'show' : ''}`}>
                <ScrollToTopLink to="/project" className="dropdown-item" closeDropdown={closeDropdown}>Our Project</ScrollToTopLink>
                <ScrollToTopLink to="/team" className="dropdown-item" closeDropdown={closeDropdown}>The Team</ScrollToTopLink>
                <ScrollToTopLink to="/testimonial" className="dropdown-item" closeDropdown={closeDropdown}>Testimonial</ScrollToTopLink>
              </div>
            </div>
            <ScrollToTopLink to="/contact" className={`nav-item nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</ScrollToTopLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
