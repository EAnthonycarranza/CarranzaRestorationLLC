import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Services from './components/Services';
import Appointment from './components/Appointment';
import Portfolio from './components/Portfolio';
import Team from './components/Team';
import Testimonial from './components/Testimonial';

import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ServicePage from './components/ServicePage'; // Import the ServicePage component
import BackToTopButton from './components/BackToTopButton';
import ProjectPage from './components/ProjectPage'; // Import ProjectPage
import TeamPage from './components/TeamPage'; // Import ProjectPage
import TestimonialPage from './components/TestimonialPage'; // Import ProjectPage
import ContactPage from './components/ContactPage'; // Import ProjectPage

function App() {
  return (
    <Router>
      <div className="App">
        <Topbar />
        <Navbar />
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/testimonial" element={<TestimonialPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/" element={
            <>
              <Carousel />
              <Services />
              <Appointment />
              <Portfolio />
              <Team />
              <Testimonial />
              {/*<Blog /> */}
            </>
          } />
        </Routes>
        <Footer />
        <BackToTopButton />
      </div>
    </Router>
  );
}

export default App;
