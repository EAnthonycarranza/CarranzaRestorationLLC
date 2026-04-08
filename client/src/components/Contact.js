import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Contact = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const isFormValid = () => {
    return name.trim() && email.trim() && subject.trim() && message.trim();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      setFeedbackType('error');
      setFeedbackMessage('Please fill in all fields before submitting.');
      return;
    }
    if (!recaptchaToken) {
      setFeedbackType('error');
      setFeedbackMessage('Please complete the reCAPTCHA verification.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, recaptchaToken }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setFeedbackType('success');
      setFeedbackMessage(data.message || 'Email sent successfully. Thank you for contacting us!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setFeedbackType('error');
      setFeedbackMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    }
  };

  return (
    <section className="contact-section">
      {/* Contact Info Cards */}
      <div className="contact-info-strip">
        <div className="contact-info-container">
          <a href="tel:2102671008" className="contact-info-card">
            <div className="contact-info-icon">
              <i className="fa fa-phone-alt"></i>
            </div>
            <div className="contact-info-content">
              <h4>Call Us</h4>
              <p>(210) 267-1008</p>
            </div>
          </a>
          <a href="mailto:admin@carranzarestoration.com" className="contact-info-card">
            <div className="contact-info-icon">
              <i className="fa fa-envelope"></i>
            </div>
            <div className="contact-info-content">
              <h4>Email Us</h4>
              <p>admin@carranzarestoration.com</p>
            </div>
          </a>
          <a href="https://maps.google.com?q=100%20Commercial%20Place,%20Schertz,%20TX" target="_blank" rel="noopener noreferrer" className="contact-info-card">
            <div className="contact-info-icon">
              <i className="fa fa-map-marker-alt"></i>
            </div>
            <div className="contact-info-content">
              <h4>Visit Us</h4>
              <p>100 Commercial Pl, Schertz, TX</p>
            </div>
          </a>
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <i className="fa fa-clock"></i>
            </div>
            <div className="contact-info-content">
              <h4>Business Hours</h4>
              <p>Mon – Fri: 8AM – 6PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Form + Map */}
      <div className="contact-main">
        <div className="contact-main-container">
          {/* Form Side */}
          <div className="contact-form-wrapper">
            <div className="contact-form-header">
              <span className="contact-form-badge">Get In Touch</span>
              <h2>Send Us a Message</h2>
              <p>Have a question or want to schedule an inspection? Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>
            <form onSubmit={handleSubmit} className="contact-form-modern">
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="contact-name">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="contact-form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="How can we help you?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="contact-form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows="6"
                  placeholder="Tell us about your project or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LfJxqksAAAAAHB2daOfU2kVupNcopppGqEGbF3B"
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </div>
              <button className="contact-submit-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i> Sending...
                  </>
                ) : (
                  <>
                    Send Message <i className="fa fa-paper-plane"></i>
                  </>
                )}
              </button>
              {feedbackMessage && (
                <div className={`contact-feedback ${feedbackType}`}>
                  <i className={`fa ${feedbackType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                  {feedbackMessage}
                </div>
              )}
            </form>
          </div>

          {/* Map Side */}
          <div className="contact-map-wrapper">
            <iframe
              className="contact-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3474.625251593319!2d-98.26973368491834!3d29.55217398207307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865cf59af4e1a6f1%3A0x8d3b2171fe7b2a0f!2s100%20Commercial%20Pl%2C%20Schertz%2C%20TX%2078175%2C%20USA!5e0!3m2!1sen!2sbd!4v1666798592923!5m2!1sen!2sbd"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Map of Our Office"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
