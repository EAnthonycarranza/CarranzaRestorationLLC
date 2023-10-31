import React from 'react';
import service1 from '../img/service-1.jpg';
import service2 from '../img/service-2.jpg';
import service3 from '../img/service-3.jpg';
import service4 from '../img/service-4.jpg';
import service5 from '../img/service-5.jpg';
import service6 from '../img/service-6.jpg';

const Services = () => {
    // Function to handle button click (you can customize this)
    const handleReadMore = () => {
      // Implement the action to be taken when the button is clicked
    };
    
  return (
    <>
      <div className="container-fluid bg-light py-6 px-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 text-uppercase mb-4">We Provide <span className="text-primary">The Best</span> Construction Services</h1>
        </div>
        <div className="row g-5">
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service1} alt="Service 1" />
                    <div className="service-icon bg-white">
                        <i className="fa fa-3x fa-building text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Estimates</h4>
                        <p>Duo dolore et diam sed ipsum stet amet duo diam. Rebum amet ut amet sed erat sed sed amet magna elitr amet kasd diam duo</p>
                        <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service2} alt="Service 2" />
                    <div className="service-icon bg-white">
                        <i className="fa fa-3x fa-home text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">House Renovation</h4>
                        <p>Duo dolore et diam sed ipsum stet amet duo diam. Rebum amet ut amet sed erat sed sed amet magna elitr amet kasd diam duo</p>
                        <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service3} alt="Service 3" />
                    <div className="service-icon bg-white">
                    <i className="fa-solid fa-house-flood-water fa-3x text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Water Mitigation</h4>
                        <p>Duo dolore et diam sed ipsum stet amet duo diam. Rebum amet ut amet sed erat sed sed amet magna elitr amet kasd diam duo</p>
                        <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service4} alt="Service 4" />
                    <div className="service-icon bg-white">
                        <i className="fa fa-3x fa-palette text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Interior Design</h4>
                        <p>Duo dolore et diam sed ipsum stet amet duo diam. Rebum amet ut amet sed erat sed sed amet magna elitr amet kasd diam duo</p>
                        <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service5} alt="Service 5" />
                    <div className="service-icon bg-white">
                        <i className="fa fa-3x fa-tools text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Fixing & Support</h4>
                        <p>Duo dolore et diam sed ipsum stet amet duo diam. Rebum amet ut amet sed erat sed sed amet magna elitr amet kasd diam duo</p>
                        <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service6} alt="Service 6" />
                    <div className="service-icon bg-white">
                        <i className="fa fa-3x fa-paint-brush text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Painting</h4>
                        <p>Duo dolore et diam sed ipsum stet amet duo diam. Rebum amet ut amet sed erat sed sed amet magna elitr amet kasd diam duo</p>
                        <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default Services;
