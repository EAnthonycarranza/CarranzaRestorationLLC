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
            <h1 className="display-5 text-uppercase mb-4">We Provide <span className="text-primary">The Best</span> Home Improvement Services</h1>
        </div>
        <div className="row g-5">
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service1} alt="Service 1" />
                    <div className="service-icon bg-white">
                        <i className="fa fa-3x fa-calculator text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Estimates</h4>
                        <p>With our services, get detailed estimates with industry-standard pricing, ensuring confidence in every home improvement project.</p>
                        {/* <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button> */}
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
                        <h4 className="text-uppercase mb-3">Home Renovation</h4>
                        <p>Transform your living space with professional renovation services renowned for our exceptional quality and craftsmanship.</p>
                        {/* <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button> */}
                    </div>
                    
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service3} alt="Service 3" />
                    <div className="service-icon bg-white">
                    <i className="fa-solid fa-truck-moving fa-3x text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Moving Services</h4>
                        <p>Count on our fast-moving services that never compromise on the safety and protection of your belongings.</p>
                        {/* <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button> */}
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service4} alt="Service 4" />
                    <div className="service-icon bg-white">
                        <i className="fa fa-3x fa-spray-can-sparkles text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Construction Cleaning Service</h4>
                        <p>We understand the importance of a clean and safe environment during renovations. Our professional cleaning service goes above and beyond, ensuring your space remains pristine throughout the entire improvement process and beyond.</p>
                        {/* <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button> */}
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
                        <h4 className="text-uppercase mb-3">Customer Support</h4>
                        <p>Customer satisfaction is at the heart of everything we do. Our commitment to professional service means clear communication and flexible solutions designed to exceed your expectations. Trust us to improve your home with clarity and flexibility in mind.</p>
                        {/* <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button> */}
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
                <img className="img-fluid" src={service6} alt="Service 6" />
                    <div className="service-icon bg-white">
                        <i className="fa fa-3x fa-solid fa-hammer text-primary"></i>
                    </div>
                    <div className="px-4 pb-4">
                        <h4 className="text-uppercase mb-3">Roof Restoration Services</h4>
                        <p>Specializing in repairing damages from hail, storms, and water, our roofing services meticulously restore roofs to their original durability, ensuring your property remains protected. Count on us to deliver tailored roofing solutions, safeguarding your home or business with expertise and reliability.</p>
                        {/* <button className="btn text-primary" onClick={handleReadMore}>Read More <i className="bi bi-arrow-right"></i></button>  */}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default Services;
