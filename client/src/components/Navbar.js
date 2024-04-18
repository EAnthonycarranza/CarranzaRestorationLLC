import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import carranzaLogo from '../img/0juOOO01.svg';

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null); // Ref for the navbar
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleClick = async (path) => {
    await trackClick(path); // Track the click before navigating
    navigate(path);
    window.scrollTo(0, 0);
    closeDropdown(); // Close dropdown when link is clicked
  };

  return (
    <div className="container-fluid sticky-top bg-dark bg-light-radial shadow-sm " ref={navbarRef}>
      <nav className="navbar navbar-expand-lg bg-dark bg-light-radial navbar-dark ">
        <Link to="/" className="navbar-brand-1" onClick={() => handleClick('/')}>
          <h1 className="brand-title">
            <span className="brand-logo">
              <img src={carranzaLogo} alt="Carranza Restoration LLC Logo" />
            </span>
            <span className="brand-name">Carranza</span>
            <span className="brand-description">Restoration LLC</span>
          </h1>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto py-0">
            <Link to="/" className={`nav-item nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => handleClick('/')}>Home</Link>
            <Link to="/about" className={`nav-item nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => handleClick('/about')}>About</Link>
            <Link to="/services" className={`nav-item nav-link ${isActive('/services') ? 'active' : ''}`} onClick={() => handleClick('/services')}>Service</Link>
            <div className="nav-item dropdown">
              <button className={`nav-link dropdown-toggle ${isDropdownActive() ? 'active' : ''}`} onClick={toggleDropdown}>Pages</button>
              <div className={`dropdown-menu m-0 ${isDropdownOpen ? 'show' : ''}`}>
                <Link to="/project" className="dropdown-item" onClick={() => handleClick('/project')}>Our Project</Link>
                <Link to="/testimonial" className="dropdown-item" onClick={() => handleClick('/testimonial')}>Testimonial</Link>
                <Link to="/blog" className="dropdown-item" onClick={() => handleClick('/blog')}>Blog</Link>
              </div>
            </div>
            <Link to="/contact" className={`nav-item nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => handleClick('/contact')}>Contact</Link>
            <Link to="/dashboard" className={`nav-item nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => handleClick('/dashboard')}>Dashboard</Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
