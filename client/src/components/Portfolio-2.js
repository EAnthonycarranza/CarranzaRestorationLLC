import React, { useEffect } from 'react';
import NRCA from '../img/NRCA.png';
import EliteServiceimg from '../img/EliteServiceimg.png';
import FWRimg from '../img/FWRimg.png';
import OwensCorningimg from '../img/OwensCorningimg.png';
import BBBimg from '../img/BBBimg.png';
import AngieListimg from '../img/AngieListimg.png';

export default function Portfolio2() {
  useEffect(() => {
    const logos = document.querySelector('.logos');
    const originalSlide = document.querySelector('.logos-slide');
    const copy = originalSlide.cloneNode(true);
    logos.appendChild(copy);
  }, []);

  const items = [
    { img: NRCA, link: 'https://www.nrca.net/', description: 'National Roofing Contractors Association®' },
    { img: EliteServiceimg, link: 'https://www.homeadvisor.com/rated.CarranzaRestoration.71226245.html', description: 'Home Advisor® Elite Service' },
    { img: FWRimg, link: '', description: 'FRW® General Contractors' },
    { img: OwensCorningimg, link: 'https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/229456', description: 'Owens Corning® - Contractor' },
    { img: BBBimg, link: 'https://www.bbb.org/all/bbb-accreditation-standards', description: 'BBB® Accreditation Business' },
    { img: AngieListimg, link: 'https://www.angi.com/companylist/us/tx/schertz/carranza-restoration-llc-reviews-9611706.htm', description: 'Angi® - 2019 Super Service Award' },
  ];

  return (
    <div className="logos">
      <div className="logos-slide">
        {items.map((item, index) => (
          <a href={item.link || '#'} key={index} target="_blank" rel="noopener noreferrer">
            <img src={item.img} alt={item.description} />
            <div>{item.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
