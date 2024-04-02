import React, { useState } from 'react';
import logoSvg from '../img/0juOOO01.svg';
import AngleImage from '../img/AngieListimg.png';
import EliteImage from '../img/EliteServiceimg.png';
import FWRImage from '../img/FWRimg.png';
import OwenImage from '../img/OwensCorningimg.png';
import BImage from '../img/BBBimg.png';
import NRCA from '../img/NRCA.png'
import { Link } from 'react-router-dom';


const Footer = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); // State to hold the message

    const handleSubscribe = async (event) => {
        event.preventDefault();
        setMessage(''); // Clear previous messages
        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message); // Display the message from the server
                setEmail(''); // Clear the email field after successful subscription
            } else {
                setMessage('Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setMessage('An error occurred. Please try again.');
        }
    };    

  return (
    <>
      <div className="footer container-fluid position-relative bg-dark bg-light-radial text-white-50 py-6 px-5">
        <div className="row g-5">
          <div className="col-lg-6 pe-lg-5 d-flex flex-column align-items-center text-center">
          <button 
  className="navbar-brand top-page-btn" 
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoSvg} alt="Carranza Logo" className="mb-2 logo-img" style={{ height: '2em' }}/>
              {window.innerWidth <= 1100 ? (
                <h1 className="m-0 text-3xl text-uppercase text-white">
                  Carranza <br />
                  Restoration LLC
                </h1>
              ) : (
                <h1 className="m-0 text-3xl text-uppercase text-white">
                  Carranza Restoration LLC
                </h1>
              )}
            </button>
            <p>Welcome to Carranza Restoration LLC, your trusted partner in home improvement. Our comprehensive services include expert estimates, meticulous home renovations, construction cleaning, content manipulation, and interior design solutions. With a commitment to excellence and personalized customer service, we're here to transform your vision into reality. Trust Carranza Restoration LLC for all your home improvement needs.</p>
            <button className="btn btn-link" onClick={() => window.open("https://maps.google.com?q=100%20Commercial%20Place,%20Schertz,%20TX", "_blank")}>
              <p><i className="fa fa-map-marker-alt me-2"></i>100 Commercial Place, Schertz, TX</p>
            </button>
            <button className="btn btn-link" onClick={() => window.location.href = "tel:(210) 267-1008"}>
              <p><i className="fa fa-phone-alt me-2"></i>(210) 267-1008</p>
            </button>
            <button className="btn btn-link" onClick={() => window.location.href = "mailto:admin@carranzarestoration.com"}>
              <p><i className="fa fa-envelope me-2"></i>admin@carranzarestoration.com</p>
            </button>

            <div className="d-flex justify-content-start mt-4">
  <a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank" rel="noopener noreferrer">
    <button className="btn btn-lg btn-primary btn-lg-square rounded-0 me-2">
      <i className="fab fa-google"></i>
    </button>
  </a>
</div>

          </div>
          <div className="col-lg-6 ps-lg-5">
            <div className="row g-5">
              <div className="col-sm-6">
              <h4 className="text-white text-uppercase mb-4 text-center">Quick Links</h4>
              <div className="d-flex flex-column justify-content-start">
                <div className="d-flex flex-column justify-content-start">
  <Link to="/" className="btn btn-link text-white-50 mb-2">
    <i className="fa fa-angle-right me-2"></i>Home
  </Link>
  <Link to="/about" className="btn btn-link text-white-50 mb-2">
    <i className="fa fa-angle-right me-2"></i>About Us
  </Link>
  <Link to="/services" className="btn btn-link text-white-50 mb-2">
    <i className="fa fa-angle-right me-2"></i>Our Services
  </Link>
  {/* <Link to="/team" className="btn btn-link text-white-50 mb-2"> */}
  {/* <i className="fa fa-angle-right me-2"></i>Meet The Team */}
  {/* </Link> */}
  <Link to="/contact" className="btn btn-link text-white-50">
    <i className="fa fa-angle-right me-2"></i>Contact Us
  </Link>
</div>
</div>
              </div>
            <div className="col-sm-12">
                {/* <h4 className="text-white text-uppercase mb-4">Newsletter</h4>
                  <form onSubmit={handleSubscribe} className="w-100">
                    <div className="input-group">
                        <input 
                            type="email" 
                            className="form-control border-light" 
                            style={{padding: '20px 30px'}} 
                            placeholder="Your Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary px-4">Sign Up</button>
                    </div>
                </form>
                {message && <p className="text-white mt-2">{message}</p>} */}
            </div>
            </div>
            <div className="flex justify-end"> {/* This div aligns its children to the end (right side) */}
            <h1 className="text-center text-white" style={{ marginTop: '10rem' }}>Our Trusted Partners</h1> {/* Adjust marginTop value as needed */}
            </div>
          </div>
        </div>
        <div className="footer-images">
  <div className="left-images">
    <img src={AngleImage} alt="Angel" className="footer-image angel-image" />
    <img src={EliteImage} alt="Elite" className="footer-image elite-image" />
    <img src={FWRImage} alt="FWR" className="footer-image fwr-image" />
  </div>
  <div className="right-images">
    <img src={OwenImage} alt="Owen" className="footer-image owen-image" />
    <img src={BImage} alt="B" className="footer-image b-image" />
    <img src={NRCA} alt="NRCA" className="footer-image nrca-image" />
  </div>
</div>

      </div>
      <div className="container-fluid bg-dark bg-light-radial text-white border-top border-primary px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between">
          <div className="py-4 px-5 text-center text-md-start">
            <p className="mb-0">&copy; <button className="btn btn-link text-primary">Carranza Restoration LLC</button>. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
