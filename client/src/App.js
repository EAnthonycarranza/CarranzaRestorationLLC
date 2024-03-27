import React, { useRef, useEffect } from 'react'; // Import useEffect here as well
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import './App.css';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Services from './components/Services';
import Appointment from './components/Appointment';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Testimonial from './components/Testimonial';
import Review from './components/Review';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ServicePage from './components/ServicePage'; // Import the ServicePage component
import BackToTopButton from './components/BackToTopButton';
import ProjectPage from './components/ProjectPage'; // Import ProjectPage
//import PaymentFormComponent from './components/PaymentPage';
//import TypingEffect from './components/TypingEffect';
import Portfolio2 from './components/Portfolio-2';
import FormPage from './components/FormPage';
//import TeamPage from './components/TeamPage'; // Import ProjectPage
import TestimonialPage from './components/TestimonialPage'; // Import ProjectPage
import ContactPage from './components/ContactPage'; // Import ProjectPage

const ScrollToTop = ({ children }) => {
  const location = useLocation(); // Now useLocation is defined

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

function App() {
  const appointmentRef = useRef(null); // Moved inside App component

  const scrollToAppointment = () => { // Moved inside App component
    if(appointmentRef.current) {
      appointmentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <div className="App">
        <Topbar />
        <Navbar />
        <Review /> 
        <ScrollToTop>

        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/form" element={<FormPage />}/>
          {/*<Route path="/team" element={<TeamPage />} /> */}
          <Route path="/testimonial" element={<TestimonialPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/*<Route path="/pay" element={<PaymentFormComponent />} />*/}
          <Route path="/" element={
            <>
              <Carousel scrollToAppointment={scrollToAppointment} />
              <About />
              <Portfolio2 />
              <Services />
              <div ref={appointmentRef}><Appointment /></div>
              <Portfolio />
              {/*<Team /> */}
              <Testimonial />
              {/*<Blog /> */}
            </>
          } />
        </Routes>
        </ScrollToTop>
        <Footer />
        <BackToTopButton />
      </div>
    </Router>
  );
}

export default App;
