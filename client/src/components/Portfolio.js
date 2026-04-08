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
import portfolio25 from '../img/portfolio-26.jpg';
import portfolio26 from '../img/portfolio-25.jpg';

const Portfolio = () => {
  const images = [
    { original: portfolio1, thumbnail: portfolio1, description: 'Roofing and Gutter Replacements' },
    { original: portfolio2, thumbnail: portfolio2, description: 'Carpet and Pad Renovations' },
    { original: portfolio3, thumbnail: portfolio3, description: 'Bathroom Mirror Replacement' },
    { original: portfolio4, thumbnail: portfolio4, description: 'Tile Flooring Renovations' },
    { original: portfolio5, thumbnail: portfolio5, description: 'Carpet and Pad Renovations' },
    { original: portfolio6, thumbnail: portfolio6, description: 'Carpet and Pad Renovations' },
    { original: portfolio7, thumbnail: portfolio7, description: 'Wood Flooring Renovations' },
    { original: portfolio8, thumbnail: portfolio8, description: 'Shower Waterproofing & Tile' },
    { original: portfolio9, thumbnail: portfolio9, description: 'Kitchen Cabinets & Granite' },
    { original: portfolio10, thumbnail: portfolio10, description: 'Fireplace Hearth Renovations' },
    { original: portfolio11, thumbnail: portfolio11, description: 'Laminate & Tile Backsplash' },
    { original: portfolio12, thumbnail: portfolio12, description: 'Emergency Tarp-up Services' },
    { original: portfolio13, thumbnail: portfolio13, description: 'Custom Tile Shower Work' },
    { original: portfolio14, thumbnail: portfolio14, description: 'Full Exterior Restoration' },
    { original: portfolio15, thumbnail: portfolio15, description: 'Roof System Replacement' },
    { original: portfolio16, thumbnail: portfolio16, description: 'Custom Tile Flooring' },
    { original: portfolio17, thumbnail: portfolio17, description: 'Luxury Shower Renovation' },
    { original: portfolio18, thumbnail: portfolio18, description: 'Free Roof Inspections' },
    { original: portfolio19, thumbnail: portfolio19, description: 'Premium Roof Systems' },
    { original: portfolio20, thumbnail: portfolio20, description: 'Large Scale Tile Projects' },
    { original: portfolio21, thumbnail: portfolio21, description: 'Interior Flooring Experts' },
    { original: portfolio22, thumbnail: portfolio22, description: 'Modern Kitchen Remodel' },
    { original: portfolio23, thumbnail: portfolio23, description: 'Professional Tile Install' },
    { original: portfolio24, thumbnail: portfolio24, description: 'Custom Patio Additions' },
    { original: portfolio26, thumbnail: portfolio26, description: 'Durable Roofing Solutions' },
    { original: portfolio25, thumbnail: portfolio25, description: 'Outdoor Living Spaces' }
  ];

  return (
    <div className="portfolio-gallery-container animate-fadeInUp">
      <ImageGallery 
        items={images} 
        showThumbnails={true} 
        infinite={true} 
        autoPlay={true}
        slideInterval={4000}
        showPlayButton={true} 
        showFullscreenButton={true} 
        thumbnailPosition="bottom" 
        useBrowserFullScreen={true}
      />
    </div>
  );
};

export default Portfolio;
