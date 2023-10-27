import React, { useEffect } from 'react';
import $ from 'jquery';
import Isotope from 'isotope-layout';

// Importing images
import portfolio1 from '../img/portfolio-1.jpg';
import portfolio2 from '../img/portfolio-2.jpg';
import portfolio3 from '../img/portfolio-3.jpg';
import portfolio4 from '../img/portfolio-4.jpg';
import portfolio5 from '../img/portfolio-5.jpg';
import portfolio6 from '../img/portfolio-6.jpg';



const Portfolio = () => {

    useEffect(() => {
        // Portfolio isotope and filter
        var portfolioIsotope = new Isotope('.portfolio-container', {
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });
    
        $('#portfolio-flters li').on('click', function () {
            $("#portfolio-flters li").removeClass('active');
            $(this).addClass('active');
            
            // Use arrange method instead of isotope
            portfolioIsotope.arrange({ filter: $(this).data('filter') });
        });
        }, []);
    
  return (
    <div className="container-fluid bg-light py-6 px-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 text-uppercase mb-4">Some Of Our <span className="text-primary">Popular</span> Dream Projects</h1>
        </div>
        <div className="row gx-5">
            <div className="col-12 text-center">
                <div className="d-inline-block bg-dark-radial text-center pt-4 px-5 mb-5">
                    <ul className="list-inline mb-0" id="portfolio-flters">
                        <li className="btn btn-outline-primary bg-white p-2 active mx-2 mb-4" data-filter="*">
                            <img src={portfolio1} style={{ width: '150px', height: '100px' }} alt="Portfolio 1" />
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 m-2 d-flex align-items-center justify-content-center" style={{ background: 'rgba(4, 15, 40, .3)' }}>
                                <h6 className="text-white text-uppercase m-0">All</h6>
                            </div>
                        </li>
                        <li className="btn btn-outline-primary bg-white p-2 mx-2 mb-4" data-filter=".first">
                            <img src={portfolio2} style={{ width: '150px', height: '100px' }} alt="Portfolio 2" />
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 m-2 d-flex align-items-center justify-content-center" style={{ background: 'rgba(4, 15, 40, .3)' }}>
                                <h6 className="text-white text-uppercase m-0">Construction</h6>
                            </div>
                        </li>
                        <li className="btn btn-outline-primary bg-white p-2 mx-2 mb-4" data-filter=".second">
                            <img src={portfolio3} style={{ width: '150px', height: '100px' }} alt="Portfolio 3" />
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 m-2 d-flex align-items-center justify-content-center" style={{ background: 'rgba(4, 15, 40, .3)' }}>
                                <h6 className="text-white text-uppercase m-0">Renovation</h6>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="row g-5 portfolio-container">
                  {/* Portfolio Item 1 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 portfolio-item first">
                    <div className="position-relative portfolio-box">
                        <img className="img-fluid w-100" src={portfolio1} alt="Portfolio 1" />
                        <button className="portfolio-title shadow-sm">
                            <p className="h4 text-uppercase">Project Name</p>
                            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>123 Street, New York, USA</span>
                        </button>
                        <button className="portfolio-btn">
                            <i className="bi bi-plus text-white"></i>
                        </button>
                    </div>
            </div>
                  {/* Portfolio Item 2 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 portfolio-item second">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio2} alt="Portfolio 2" />
        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Project Name</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>123 Street, New York, USA</span>
        </div>
        <button className="portfolio-btn" onClick={() => {/* handle click event */}}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>
                  {/* Portfolio Item 3 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 portfolio-item first">
                    <div className="position-relative portfolio-box">
                        <img className="img-fluid w-100" src={portfolio3} alt="Portfolio 3" />
                        <button className="portfolio-title shadow-sm">
                            <p className="h4 text-uppercase">Project Name</p>
                            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>123 Street, New York, USA</span>
                        </button>
                        <button className="portfolio-btn">
                            <i className="bi bi-plus text-white"></i>
                        </button>
                    </div>
            </div>
                  {/* Portfolio Item 4 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 portfolio-item second">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio4} alt="Portfolio 4" />
        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Project Name</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>123 Street, New York, USA</span>
        </div>
        <button className="portfolio-btn" onClick={() => {/* handle click event */}}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>
                  {/* Portfolio Item 5 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 portfolio-item first">
                    <div className="position-relative portfolio-box">
                        <img className="img-fluid w-100" src={portfolio5} alt="Portfolio 5" />
                        <button className="portfolio-title shadow-sm">
                            <p className="h4 text-uppercase">Project Name</p>
                            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>123 Street, New York, USA</span>
                        </button>
                        <button className="portfolio-btn">
                            <i className="bi bi-plus text-white"></i>
                        </button>
                    </div>
            </div>
                  {/* Portfolio Item 6 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 portfolio-item second">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio6} alt="Portfolio 6" />
        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Project Name</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>123 Street, New York, USA</span>
        </div>
        <button className="portfolio-btn" onClick={() => {/* handle click event */}}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>
                  {/* Portfolio Item ends */}
        </div>
    </div>
  );
}

export default Portfolio;
