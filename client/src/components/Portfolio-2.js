import React, { useEffect } from 'react';
import AngleImage from '../img/AngieListimg.png';
import EliteImage from '../img/EliteServiceimg.png';
import FWRImage from '../img/FWRimg.png';
import OwenImage from '../img/OwensCorningimg.png';
import BImage from '../img/BBBimg.png';
import NRCA from '../img/NRCA.png';

export default function Portfolio2() {
  useEffect(() => {
    const logos = document.querySelector('.logos');
    const originalSlide = document.querySelector('.logos-slide');
    if (logos && originalSlide) {
      const copy = originalSlide.cloneNode(true);
      logos.appendChild(copy);
    }
  }, []);

  const logosData = [
    {
      img: NRCA,
      link: 'https://www.nrca.net/',
      description: 'National Roofing Contractors Association®'
    },
    {
      img: EliteImage,
      link: 'https://www.homeadvisor.com/rated.CarranzaRestoration.71226245.html',
      description: 'Home Advisor® Elite Service'
    },
    {
      img: FWRImage,
      link: '',
      description: 'FRW® General Contactors'
    },
    {
      img: OwenImage,
      link: 'https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/229456',
      description: 'Owens Corning® - Contractor'
    },
    {
      img: BImage,
      link: 'https://www.bbb.org/all/bbb-accreditation-standards',
      description: 'BBB® Accreditation Business'
    },
    {
      img: AngleImage,
      link: 'https://www.angi.com/companylist/us/tx/schertz/carranza-restoration-llc-reviews-9611706.htm',
      description: 'Angi® - 2019 Super Service Award'
    }
  ];

  return (
    <div className="logos">
      <div className="logos-slide">
        {logosData.map((logo, index) => (
          <a href={logo.link || '#'} key={index} target="_blank" rel="noopener noreferrer">
            <img src={logo.img} alt={logo.description} />
            <div>{logo.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
