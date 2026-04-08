import React from 'react';
import { Link } from 'react-router-dom';
import service1 from '../img/service-1.jpg';
import service2 from '../img/service-2.jpg';
import service3 from '../img/service-3.jpg';
import service4 from '../img/service-4.jpg';
import service5 from '../img/service-5.jpg';
import service6 from '../img/service-6.jpg';

const Services = () => {
  const serviceData = [
    {
      title: "Estimates",
      img: service1,
      icon: "fa-calculator",
      desc: "Get detailed, precise estimates with industry-standard pricing, ensuring total confidence in your project budget."
    },
    {
      title: "Home Renovation",
      img: service2,
      icon: "fa-home",
      desc: "Transform your living space with master craftsmanship and meticulous attention to detail in every renovation."
    },
    {
      title: "Moving Services",
      img: service3,
      icon: "fa-truck-moving",
      desc: "Fast, secure, and reliable moving services that prioritize the safety and protection of your valued belongings."
    },
    {
      title: "Construction Cleaning",
      img: service4,
      icon: "fa-spray-can-sparkles",
      desc: "Thorough post-construction cleaning to ensure your newly renovated space is pristine, safe, and ready to enjoy."
    },
    {
      title: "Customer Support",
      img: service5,
      icon: "fa-headset",
      desc: "Dedicated support with clear communication and flexible solutions tailored to exceed your expectations."
    },
    {
      title: "Roof Restoration",
      img: service6,
      icon: "fa-hammer",
      desc: "Expert repair for storm and water damage, restoring your roof's durability and protecting your property."
    }
  ];

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {serviceData.map((service, index) => (
          <div className="col-lg-4 col-md-6" key={index}>
            <div className="service-card-modern">
              <div className="service-img-wrapper">
                <img src={service.img} alt={service.title} />
              </div>
              <div className="service-icon-box">
                <i className={`fa ${service.icon} fa-2x text-primary`}></i>
              </div>
              <div className="service-content-modern">
                <h4 className="service-title-modern">{service.title}</h4>
                <p className="service-text-modern">{service.desc}</p>
                <Link to="/services" className="service-link-modern">
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
