import React from 'react';
import signatureImage from '../img/signature.jpg';
import aboutImage from '../img/about.jpg';
import BackToTopButton from './BackToTopButton';

const About = () => {
  return (
    <>
      <div className="container-fluid py-6 px-5">
        <div className="row g-5">
          <div className="col-lg-7">
            <h1 className="display-5 text-uppercase mb-4">We are <span className="text-primary">EXPERTS</span> in Home Improvement Industry</h1>
            <h4 className="text-uppercase mb-3 text-body">Experience Excellence in Home Restoration and Renovation Services</h4>
            <p>With over 21 years of experience in reconstruction and restoration, we proudly serve San Antonio, Austin and surrounding areas with unwavering integrity and dedication to fulfilling your project requirements!</p>
            <div className="row gx-5 py-2">
              <div className="col-sm-6 mb-2">
                <p className="fw-bold mb-2"><i className="fa fa-check text-primary me-3"></i>Expert Estimates</p>
                <p className="fw-bold mb-2"><i className="fa fa-check text-primary me-3"></i>Meticulous Renovations</p>
                <p className="fw-bold mb-2"><i className="fa fa-check text-primary me-3"></i>Thorough Construction Cleaning</p>
              </div>
              <div className="col-sm-6 mb-2">
                <p className="fw-bold mb-2"><i className="fa fa-check text-primary me-3"></i>Dedicated Customer Service</p>
                <p className="fw-bold mb-2"><i className="fa fa-check text-primary me-3"></i>Timely Project Management</p>
                <p className="fw-bold mb-2"><i className="fa fa-check text-primary me-3"></i>Reliable Roofing Replacements</p>
              </div>
            </div>
            <p className="mb-4">Our team excels at delivering meticulous craftsmanship and personalized service, ensuring your project is completed to the highest standards. Trust Carranza Restoration LLC to bring your vision to life with professionalism and care.</p>
          </div>
          <div className="col-lg-5 pb-5" style={{ minHeight: '400px' }}>
          <div className="position-relative bg-dark-radial h-100 ms-5">
</div>

          </div>
        </div>
        <BackToTopButton />
      </div>
    </>
  );
}

export default About;
