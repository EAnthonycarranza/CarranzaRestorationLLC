import React from 'react';
// Importing images
import team1 from '../img/team-1.jpg';
import team2 from '../img/team-2.jpg';
import team3 from '../img/team-3.jpg';
import team4 from '../img/team-4.jpg';

const Team = () => {
  return (
    <div className="container-fluid py-6 px-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 text-uppercase mb-4">We Are <span className="text-primary">Professional & Expert</span> Workers</h1>
        </div>
        <div className="row g-5">
            <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="row g-0">
                    <div className="col-10" style={{ minHeight: '300px' }}>
                        <div className="position-relative h-100">
                            <img className="position-absolute w-100 h-100" src={team1} style={{ objectFit: 'cover' }} alt="Team Member 1" />
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="h-100 d-flex flex-column align-items-center justify-content-between bg-light">
                        <a className="btn" href="#"><i className="fab fa-twitter"></i></a>
                            <a className="btn" href="#"><i className="fab fa-facebook-f"></i></a>
                            <a className="btn" href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a className="btn" href="#"><i className="fab fa-instagram"></i></a>
                            <a className="btn" href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="bg-light p-4">
                            <h4 className="text-uppercase">Adam Phillips</h4>
                            <span>CEO & Founder</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="row g-0">
                    <div className="col-10" style={{ minHeight: '300px' }}>
                        <div className="position-relative h-100">
                            <img className="position-absolute w-100 h-100" src={team2} style={{ objectFit: 'cover' }} alt="Team Member 2" />
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="h-100 d-flex flex-column align-items-center justify-content-between bg-light">
                        <a className="btn" href="#"><i className="fab fa-twitter"></i></a>
                            <a className="btn" href="#"><i className="fab fa-facebook-f"></i></a>
                            <a className="btn" href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a className="btn" href="#"><i className="fab fa-instagram"></i></a>
                            <a className="btn" href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="bg-light p-4">
                            <h4 className="text-uppercase">Dylan Adams</h4>
                            <span>Civil Engineer</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="row g-0">
                    <div className="col-10" style={{ minHeight: '300px' }}>
                        <div className="position-relative h-100">
                            <img className="position-absolute w-100 h-100" src={team3} style={{ objectFit: 'cover' }} alt="Team Member 3" />
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="h-100 d-flex flex-column align-items-center justify-content-between bg-light">
                        <a className="btn" href="#"><i className="fab fa-twitter"></i></a>
                            <a className="btn" href="#"><i className="fab fa-facebook-f"></i></a>
                            <a className="btn" href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a className="btn" href="#"><i className="fab fa-instagram"></i></a>
                            <a className="btn" href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="bg-light p-4">
                            <h4 className="text-uppercase">Jhon Doe</h4>
                            <span>Interior Designer</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="row g-0">
                    <div className="col-10" style={{ minHeight: '300px' }}>
                        <div className="position-relative h-100">
                            <img className="position-absolute w-100 h-100" src={team4} style={{ objectFit: 'cover' }} alt="Team Member 4" />
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="h-100 d-flex flex-column align-items-center justify-content-between bg-light">
                        <a className="btn" href="#"><i className="fab fa-twitter"></i></a>
                            <a className="btn" href="#"><i className="fab fa-facebook-f"></i></a>
                            <a className="btn" href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a className="btn" href="#"><i className="fab fa-instagram"></i></a>
                            <a className="btn" href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="bg-light p-4">
                            <h4 className="text-uppercase">Josh Dunn</h4>
                            <span>Painter</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Team;
