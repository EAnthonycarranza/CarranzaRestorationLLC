import React from 'react';
import carousel1Image from '../img/carousel-1.jpg';
import carousel2Image from '../img/carousel-2.jpg';

const Carousel = () => {
  // Define the handleGetQuote function
  const handleGetQuote = () => {
    // Implement the logic for handling a quote request
    console.log("Get Quote button clicked"); // Placeholder action
  };

  // Define the handleContactUs function
  const handleContactUs = () => {
    // Implement the logic for handling contact us action
    console.log("Contact Us button clicked"); // Placeholder action
  };
  
  return (
    <>
      <div className="container-fluid p-0">
        <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src={carousel1Image} alt="Carousel 1" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: '900px' }}>
                  <i className="fa fa-home fa-4x text-primary mb-4 d-none d-sm-block"></i>
                  <h1 className="display-2 text-uppercase text-white mb-md-4">Restore Your Dream House With Us</h1>
                  <button className="btn btn-primary py-md-3 px-md-5 mt-2" onClick={handleGetQuote}>Get A Quote</button>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src={carousel2Image} alt="Carousel 2" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: '900px' }}>
                  <i className="fa fa-tools fa-4x text-primary mb-4 d-none d-sm-block"></i>
                  <h1 className="display-2 text-uppercase text-white mb-md-4">We Are Trusted For Your Project</h1>
                  <button className="btn btn-primary py-md-3 px-md-5 mt-2" onClick={handleContactUs}>Contact Us</button>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel"
            data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel"
            data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Carousel;
