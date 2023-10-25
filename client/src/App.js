import React from 'react';
import './App.css';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import About from './components/About';
import Services from './components/Services';
import Appointment from './components/Appointment';
import Portfolio from './components/Portfolio';
import Team from './components/Team';
import Testimonial from './components/Testimonial';
import Blog from './components/Blog';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Topbar />
      <Navbar />
      <Carousel />
      <About />
      <Services />
      <Appointment />
      <Portfolio />
      <Team />
      <Testimonial />
      <Blog />
      <Footer />
    </div>
  );
}

export default App;
