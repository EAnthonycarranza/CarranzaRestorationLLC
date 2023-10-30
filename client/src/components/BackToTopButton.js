import React from 'react';

function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button onClick={scrollToTop} className="btn btn-lg btn-primary btn-lg-square back-to-top">
      <i className="bi bi-arrow-up"></i>
    </button>
  );
}

export default BackToTopButton;
