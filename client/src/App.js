import React, { useRef, useEffect } from 'react'; // Import useEffect here as well
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import './components/Dashboard';
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
import PaymentFormComponent from './components/PaymentPage';
import Portfolio2 from './components/Portfolio-2';
import FormPage from './components/FormPage';
import Blog from './components/BlogPage';
import Detail from './components/Detail';
import AdminDashboard from './components/AdminDashboard';
import TypingEffect from './components/TypingEffect';
//import TeamPage from './components/TeamPage'; // Import ProjectPage
import TestimonialPage from './components/TestimonialPage'; // Import ProjectPage
import ContactPage from './components/ContactPage'; // Import ProjectPage
import BlogCreatorPage from './components/BlogCreatorPage';
import AdminEditBlog from './components/AdminEditBlog';
import Login from './components/LoginPage';
import Register from './components/Register';
import AuthSuccess from './components/AuthSuccess'; // Adjust the path as necessary
import Dashboard from './components/DashboardPage';

const ScrollToTop = ({ children }) => {
  const location = useLocation(); // Now useLocation is defined

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

function App() {
  const appointmentRef = useRef(null);

  const scrollToAppointment = () => {
    if (appointmentRef.current) {
      appointmentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <GoogleOAuthProvider clientId="30495169830-n8gedt6t0sl5b7v6ur0t9hkrn4j2uako.apps.googleusercontent.com">
        <div className="App">
          <Topbar />
          <Navbar />
          <Review />
          <ScrollToTop>
            <Routes>
            <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/AdminEditPage/:id" element={<AdminEditBlog />} />
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<Detail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicePage />} />
              <Route path="/project" element={<ProjectPage />} />
              <Route path="/form" element={<FormPage />} />
              <Route path="/createblog" element={<BlogCreatorPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/testimonial" element={<TestimonialPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth-success" element={<AuthSuccess />} />
              <Route path="/" element={
                <>
                  <Carousel scrollToAppointment={scrollToAppointment} />
                  <About />
                  <Portfolio2 />
                  <Services />
                  <div ref={appointmentRef}><Appointment /></div>
                  <Portfolio />
                  <Testimonial />
                </>
              } />
            </Routes>
          </ScrollToTop>
          <Footer />
          <BackToTopButton />
        </div>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;
