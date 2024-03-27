import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

// Import the images
import portfolio1 from '../img/portfolio-1.jpg';
import portfolio2 from '../img/portfolio-2.jpg';
import portfolio3 from '../img/portfolio-3.jpg';
import portfolio4 from '../img/portfolio-4.jpg';
import portfolio5 from '../img/portfolio-5.jpg';
import portfolio6 from '../img/portfolio-6.jpg';
import portfolio7 from '../img/portfolio-7.jpg';
import portfolio8 from '../img/portfolio-8.jpg';
import portfolio9 from '../img/portfolio-9.jpg';
import portfolio10 from '../img/portfolio-10.jpg';
import portfolio11 from '../img/portfolio-11.jpg';
import portfolio12 from '../img/portfolio-12.jpg';
import portfolio13 from '../img/portfolio-13.jpg';
import portfolio14 from '../img/portfolio-14.jpg';
import portfolio15 from '../img/portfolio-15.jpg';
import portfolio16 from '../img/portfolio-16.jpg';
import portfolio17 from '../img/portfolio-17.jpg';
import portfolio18 from '../img/portfolio-18.jpg';
import portfolio19 from '../img/portfolio-19.jpg';
import portfolio20 from '../img/portfolio-20.jpg';
import portfolio21 from '../img/portfolio-21.jpg';
import portfolio22 from '../img/portfolio-22.jpg';
import portfolio23 from '../img/portfolio-23.jpg';
import portfolio24 from '../img/portfolio-24.jpg';
import portfolio25 from '../img/portfolio-25.jpg';

class Portfolio extends React.Component {
  render() {
    const images = [
      { original: portfolio1, thumbnail: portfolio1 },
      { original: portfolio2, thumbnail: portfolio2 },
      { original: portfolio3, thumbnail: portfolio3 },
      { original: portfolio4, thumbnail: portfolio4 },
      { original: portfolio5, thumbnail: portfolio5 },
      { original: portfolio6, thumbnail: portfolio6 },
      { original: portfolio7, thumbnail: portfolio7 },
      { original: portfolio8, thumbnail: portfolio8 },
      { original: portfolio9, thumbnail: portfolio9 },
      { original: portfolio10, thumbnail: portfolio10 },
      { original: portfolio11, thumbnail: portfolio11 },
      { original: portfolio12, thumbnail: portfolio12 },
      { original: portfolio13, thumbnail: portfolio13 },
      { original: portfolio14, thumbnail: portfolio14 },
      { original: portfolio15, thumbnail: portfolio15 },
      { original: portfolio16, thumbnail: portfolio16 },
      { original: portfolio17, thumbnail: portfolio17 },
      { original: portfolio18, thumbnail: portfolio18 },
      { original: portfolio19, thumbnail: portfolio19 },
      { original: portfolio20, thumbnail: portfolio20 },
      { original: portfolio21, thumbnail: portfolio21 },
      { original: portfolio22, thumbnail: portfolio22 },
      { original: portfolio23, thumbnail: portfolio23 },
      { original: portfolio24, thumbnail: portfolio24 },
      { original: portfolio25, thumbnail: portfolio25 },
    ];

    return (
      <div className="portfolio-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="container-fluid bg-light py-6 px-5">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 text-uppercase mb-4">See Our <span className="text-primary">TOP-PICKED</span> Amazing Projects</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ImageGallery 
  items={images} 
  showThumbnails={true} 
  infinite={true} 
  showPlayButton={false} 
  showFullscreenButton={false} 
  thumbnailPosition="bottom" 
/>

          </div>
        </div>
      </div>
    );
  }
}

export default Portfolio;
