import React from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Link Component for scrolling to top
const ScrollToTopLink = ({ to, className, children }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
    collapseNavbar(); // Collapse navbar when link is clicked
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

// Function to collapse the navbar
const collapseNavbar = () => {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  if (navbarCollapse.classList.contains('show')) {
    navbarToggler.click();
  }
};

// Navbar Component
const Navbar = () => {
  return (
    <>
      <div className="container-fluid sticky-top bg-dark bg-light-radial shadow-sm px-5 pe-lg-0">
        <nav className="navbar navbar-expand-lg bg-dark bg-light-radial navbar-dark py-3 py-lg-0">
          <ScrollToTopLink to="/" className="navbar-brand">
            <h1 className="m-0 text-3xl text-uppercase text-white">
              <i className="bi bi-building text-primary me-2"></i>
              Carranza Restoration LLC
            </h1>
          </ScrollToTopLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <ScrollToTopLink to="/" className="nav-item nav-link active">Home</ScrollToTopLink>
              <ScrollToTopLink to="/about" className="nav-item nav-link">About</ScrollToTopLink>
              <ScrollToTopLink to="/services" className="nav-item nav-link">Service</ScrollToTopLink>
              <div className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</button>
                <div className="dropdown-menu m-0">
                  <ScrollToTopLink to="/project" className="dropdown-item" onClick={collapseNavbar}>Our Project</ScrollToTopLink>
                  <ScrollToTopLink to="/team" className="dropdown-item" onClick={collapseNavbar}>The Team</ScrollToTopLink>
                  <ScrollToTopLink to="/testimonials" className="dropdown-item" onClick={collapseNavbar}>Testimonial</ScrollToTopLink>
                  {/*<ScrollToTopLink to="/blog" className="dropdown-item" onClick={collapseNavbar}>Blog Grid</ScrollToTopLink>
                  <ScrollToTopLink to="/detail" className="dropdown-item" onClick={collapseNavbar}>Blog Detail</ScrollToTopLink> */}
                </div>
              </div>
              <ScrollToTopLink to="/contact" className="nav-item nav-link">Contact</ScrollToTopLink>
              <button className="nav-item nav-link bg-primary text-white px-5 ms-3 d-none d-lg-block">Get A Quote <i className="bi bi-arrow-right"></i></button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
