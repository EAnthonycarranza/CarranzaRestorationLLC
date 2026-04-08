import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import carranzaLogo from '../img/Carranza Restoration.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleNavigation = async (path) => {
    await trackClick(path);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const pagesLinks = [
    { name: 'Our Projects', path: '/project' },
    { name: 'Testimonials', path: '/testimonial' },
    { name: 'Blog', path: '/blog' }
  ];

  const isPagesActive = pagesLinks.some(link => isActive(link.path));

  return (
    <header className={`modern-navbar-wrapper ${scrolled ? 'scrolled' : ''}`} ref={navbarRef}>
      <nav className="modern-navbar container-modern">
        {/* Brand */}
        <Link to="/" className="navbar-brand-modern" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}>
          <div className="brand-content">
            <img src={carranzaLogo} alt="Carranza Restoration" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-name">Carranza</span>
              <span className="brand-desc">Restoration LLC</span>
            </div>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />}

        {/* Nav Links */}
        <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className={`nav-link-modern ${isActive('/') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={`nav-link-modern ${isActive('/about') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('/about'); }}>About</Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className={`nav-link-modern ${isActive('/services') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('/services'); }}>Services</Link>
            </li>

            <li className={`nav-item dropdown-modern ${isDropdownOpen ? 'open' : ''}`}>
              <button 
                className={`nav-link-modern dropdown-toggle-modern ${isPagesActive ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Pages <i className={`fa fa-chevron-down ms-1 icon-sm transition ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>
              <ul className={`dropdown-menu-modern ${isDropdownOpen ? 'show' : ''}`}>
                {pagesLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className={`dropdown-item-modern ${isActive(link.path) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation(link.path); }}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/contact" className={`nav-link-modern ${isActive('/contact') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('/contact'); }}>Contact</Link>
            </li>

            <li className="nav-item dashboard-item">
              <Link to="/dashboard" className={`nav-link-modern dashboard-btn ${isActive('/dashboard') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('/dashboard'); }}>Dashboard</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
