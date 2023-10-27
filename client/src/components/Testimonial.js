import React, { useEffect } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';

// Importing images
import testimonialBg from '../img/testimonial.jpg';
import testimonial1 from '../img/testimonial-1.jpg';
import testimonial2 from '../img/testimonial-2.jpg';

const Testimonial = () => {

  useEffect(() => {
    // Initialize the carousel
    $(".testimonial-carousel").owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      items: 1,
      dots: false,
      loop: true,
    });
  }, []);

  return (
    <>
      <div className="container-fluid bg-light py-6 px-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 text-uppercase mb-4">What Our <span className="text-primary">Happy Clients</span> Say!!!</h1>
        </div>
        <div className="row gx-0 align-items-center">
            <div className="col-xl-4 col-lg-5 d-none d-lg-block">
                <img className="img-fluid w-100 h-100" src={testimonialBg} alt="Testimonial Background" />
            </div>
            <div className="col-xl-8 col-lg-7 col-md-12">
                <div className="testimonial bg-light">
                    <div className="owl-carousel testimonial-carousel">
                        {/* First testimonial */}
                        <div className="row gx-4 align-items-center">
                            <div className="col-xl-4 col-lg-5 col-md-5">
                                <img className="img-fluid w-100 h-100 bg-light p-lg-3 mb-4 mb-md-0" src={testimonial1} alt="Testimonial 1" />
                            </div>
                            <div className="col-xl-8 col-lg-7 col-md-7">
                                <h4 className="text-uppercase mb-0">Client Name</h4>
                                <p>Profession</p>
                                <p className="fs-5 mb-0"><i className="fa fa-2x fa-quote-left text-primary me-2"></i> Testimonial text here.</p>
                            </div>
                        </div>
                        {/* Second testimonial */}
                        <div className="row gx-4 align-items-center">
                            <div className="col-xl-4 col-lg-5 col-md-5">
                                <img className="img-fluid w-100 h-100 bg-light p-lg-3 mb-4 mb-md-0" src={testimonial2} alt="Testimonial 2" />
                            </div>
                            <div className="col-xl-8 col-lg-7 col-md-7">
                                <h4 className="text-uppercase mb-0">Client Name</h4>
                                <p>Profession</p>
                                <p className="fs-5 mb-0"><i className="fa fa-2x fa-quote-left text-primary me-2"></i> Testimonial text here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default Testimonial;
