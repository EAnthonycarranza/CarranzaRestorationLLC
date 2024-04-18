import React, { useEffect } from 'react';

export default function Portfolio2() {
  useEffect(() => {
    const logos = document.querySelector('.logos');
    const originalSlide = document.querySelector('.logos-slide');
    const copy = originalSlide.cloneNode(true);
    logos.appendChild(copy);
  }, []);

  const imageBaseURL = 'https://storage.googleapis.com/carpublic';
  const links = [
    'https://iicrc.org/iicrccertifiedfirm/',
    'https://www.contractorconnection.com/about/',
    'https://www.nrca.net/',
    'https://www.homeadvisor.com/rated.CarranzaRestoration.71226245.html',
    '', // No link for image 5
    'https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/229456',
    'https://www.bbb.org/all/bbb-accreditation-standards',
    'https://www.angi.com/companylist/us/tx/schertz/carranza-restoration-llc-reviews-9611706.htm'
  ];
  const descriptions = [
    'IICRC® Certified Firm',
    'Contractor Connection®',
    'National Roofing Contractors Association®',
    'Home Advisor® Elite Service',
    'FRW® General Contactors',
    'Owens Corning® - Contractor',
    'BBB® Accreditation Business',
    'Angi® - 2019 Super Service Award'
  ];

  return (
    <div className="logos">
      <div className="logos-slide">
        {links.map((link, index) => (
          <a href={link || '#'} key={index} target="_blank" rel="noopener noreferrer">
            <img src={`${imageBaseURL}/${index + 1}.png`} alt={`Logo ${index + 1}`} />
            <div>{descriptions[index]}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
