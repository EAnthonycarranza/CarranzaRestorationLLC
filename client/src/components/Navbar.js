import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import carranzaLogo from '../img/0juOOO01.svg';

// Custom Link Component for scrolling to top
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

    // Check if navbar is expanded
    const navbarToggler = document.querySelector('.navbar-toggler');
    const isNavbarExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
    if (isNavbarExpanded) {
      navbarToggler.click(); // Programmatically click the toggler to collapse the navbar
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
  const navbarRef = useRef(null); // Ref for the navbar

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

  // Handle click outside navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navbarRef]);

  return (
    <div className="container-fluid sticky-top bg-dark bg-light-radial shadow-sm " ref={navbarRef}>
      <nav className="navbar navbar-expand-lg bg-dark bg-light-radial navbar-dark ">
      <ScrollToTopLink to="/" className="navbar-brand-1">
  <h1 className="brand-title">
  <span className="brand-logo">
  <img src={carranzaLogo} alt="Carranza Restoration LLC Logo" />
   </span>
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
                {/*<ScrollToTopLink to="/team" className="dropdown-item" closeDropdown={closeDropdown}>The Team</ScrollToTopLink> */}
                <ScrollToTopLink to="/testimonial" className="dropdown-item" closeDropdown={closeDropdown}>Testimonial</ScrollToTopLink>
                {/*<ScrollToTopLink to="/pay" className="dropdown-item" closeDropdown={closeDropdown}>Payment</ScrollToTopLink>*/}
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
