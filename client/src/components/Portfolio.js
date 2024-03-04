import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';

// Importing images
import portfolio1 from '../img/portfolio-1.jpg';
import portfolio2 from '../img/portfolio-2.jpg';
import portfolio3 from '../img/portfolio-3.jpg';
import portfolio4 from '../img/portfolio-4.jpg';
import portfolio5 from '../img/portfolio-5.jpg';
import portfolio6 from '../img/portfolio-6.jpg';

const Portfolio = () => {
    // Creating refs for each portfolio item
    const portfolio1Ref = useRef(null);
    const portfolio2Ref = useRef(null);
    const portfolio3Ref = useRef(null);
    const portfolio4Ref = useRef(null);
    const portfolio5Ref = useRef(null);
    const portfolio6Ref = useRef(null);

    useEffect(() => {
        const portfolioContainer = document.querySelector('.portfolio-container');
        imagesLoaded(portfolioContainer, function() {
            // Initialize Isotope after all images have loaded
            var portfolioIsotope = new Isotope(portfolioContainer, {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });

            $('#portfolio-flters li').on('click', function () {
                $("#portfolio-flters li").removeClass('active');
                $(this).addClass('active');

                portfolioIsotope.arrange({ filter: $(this).data('filter') });
            });
        });
    }, []);
    
  return (
    <div className="portfolio-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <div className="container-fluid bg-light py-6 px-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 text-uppercase mb-4">See Our <span className="text-primary">TOP-PICKED</span> Amazing Projects</h1>
        </div>

       {/* <div className="row gx-5">
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
                                <h6 className="text-white text-uppercase m-0">Construction Cleaning</h6>
                            </div>
                        </li>
                        <li className="btn btn-outline-primary bg-white p-2 mx-2 mb-4" data-filter=".second">
                            <img src={portfolio3} style={{ width: '150px', height: '100px' }} alt="Portfolio 3" />
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 m-2 d-flex align-items-center justify-content-center" style={{ background: 'rgba(4, 15, 40, .3)' }}>
                                <h6 className="text-white text-uppercase m-0">Moving Service</h6>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
  */}
        <div className="row g-5 portfolio-container">
{/* Portfolio Item 1 */}
<div className="col-xl-4 col-lg-6 col-md-6 portfolio-item first">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio1} alt="Portfolio 1" />

        {/* Hidden Anchor Tag for Lightbox */}
        <a href={portfolio1} data-lightbox="portfolio" style={{ display: 'none' }} ref={portfolio1Ref}></a>

        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Carpet Instaliation</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>San Antonio, TX, USA</span>
        </div>

        {/* Button to Trigger Lightbox */}
        <button className="portfolio-btn" onClick={() => portfolio1Ref.current.click()}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>


{/* Portfolio Item 2 */}
<div className="col-xl-4 col-lg-6 col-md-6 portfolio-item second">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio2} alt="Portfolio 2" />

        {/* Hidden Anchor Tag for Lightbox */}
        <a href={portfolio2} data-lightbox="portfolio" style={{ display: 'none' }} ref={portfolio2Ref}></a>

        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Fire Restoration</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>San Antonio, TX, USA</span>
        </div>

        {/* Button to Trigger Lightbox */}
        <button className="portfolio-btn" onClick={() => portfolio2Ref.current.click()}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>

{/* Portfolio Item 3 */}
<div className="col-xl-4 col-lg-6 col-md-6 portfolio-item first">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio3} alt="Portfolio 3" />

        {/* Hidden Anchor Tag for Lightbox */}
        <a href={portfolio3} data-lightbox="portfolio" style={{ display: 'none' }} ref={portfolio3Ref}></a>

        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Tile Instaliation</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>San Antonio, TX, USA</span>
        </div>

        {/* Button to Trigger Lightbox */}
        <button className="portfolio-btn" onClick={() => portfolio3Ref.current.click()}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>

{/* Portfolio Item 4 */}
<div className="col-xl-4 col-lg-6 col-md-6 portfolio-item second">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio4} alt="Portfolio 4" />

        {/* Hidden Anchor Tag for Lightbox */}
        <a href={portfolio4} data-lightbox="portfolio" style={{ display: 'none' }} ref={portfolio4Ref}></a>

        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Cabinet Instaliation</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>San Antonio, TX, USA</span>
        </div>

        {/* Button to Trigger Lightbox */}
        <button className="portfolio-btn" onClick={() => portfolio4Ref.current.click()}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>

{/* Portfolio Item 5 */}
<div className="col-xl-4 col-lg-6 col-md-6 portfolio-item first">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio5} alt="Portfolio 5" />

        {/* Hidden Anchor Tag for Lightbox */}
        <a href={portfolio5} data-lightbox="portfolio" style={{ display: 'none' }} ref={portfolio5Ref}></a>

        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Painting</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>San Antonio, TX, USA</span>
        </div>

        {/* Button to Trigger Lightbox */}
        <button className="portfolio-btn" onClick={() => portfolio5Ref.current.click()}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>

{/* Portfolio Item 6 */}
<div className="col-xl-4 col-lg-6 col-md-6 portfolio-item second">
    <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={portfolio6} alt="Portfolio 6" />

        {/* Hidden Anchor Tag for Lightbox */}
        <a href={portfolio6} data-lightbox="portfolio" style={{ display: 'none' }} ref={portfolio6Ref}></a>

        <div className="portfolio-title shadow-sm">
            <p className="h4 text-uppercase">Roofing</p>
            <span className="text-body"><i className="fa fa-map-marker-alt text-primary me-2"></i>San Antonio, TX, USA</span>
        </div>

        {/* Button to Trigger Lightbox */}
        <button className="portfolio-btn" onClick={() => portfolio6Ref.current.click()}>
            <i className="bi bi-plus text-white"></i>
        </button>
    </div>
</div>
                  {/* Portfolio Item ends */}
        </div>
    </div>
    </div>
  );
}

export default Portfolio;