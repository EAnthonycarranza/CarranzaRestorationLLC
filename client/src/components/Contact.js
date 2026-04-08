import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import ReCAPTCHA from 'react-google-recaptcha';
import 'react-quill/dist/quill.snow.css';
import './Contact.css';

const Contact = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef();

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  const formats = ['bold', 'italic', 'underline', 'list', 'bullet'];

  const isFormValid = () => {
    return name.trim() && email.trim() && subject.trim() && message.trim() && captchaToken;
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      setFeedbackMessage('Please fill in all fields and complete the reCAPTCHA before submitting.');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, captchaToken }),
      });
      const data = await response.json();
      if (response.ok) {
        setFeedbackMessage(data.message || 'Email sent successfully. Thank you for contacting us!');
        // Reset form
        setName(''); setEmail(''); setSubject(''); setMessage(''); setCaptchaToken(null);
        recaptchaRef.current.reset();
      } else {
        setFeedbackMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedbackMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="container-modern">
        <div className="contact-wrapper">
          <div className="row g-0">
            {/* Left Panel: Contact Info */}
            <div className="col-lg-5">
              <div className="contact-info-panel">
                <h2 className="display-6 fw-bold mb-4 text-white">Get In Touch</h2>
                <p className="mb-5 opacity-75">
                  We're here to help with your restoration needs. Reach out to us through any of these channels or fill out the form.
                </p>

                <div className="contact-info-item">
                  <div className="contact-icon-box">
                    <i className="fa fa-envelope"></i>
                  </div>
                  <div className="contact-info-content">
                    <h4>Email Us</h4>
                    <a href="mailto:admin@carranzarestoration.com">admin@carranzarestoration.com</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-box">
                    <i className="fa fa-phone"></i>
                  </div>
                  <div className="contact-info-content">
                    <h4>Call Us</h4>
                    <a href="tel:2102671008">(210) 267-1008</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-box">
                    <i className="fa fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-info-content">
                    <h4>Visit Office</h4>
                    <p>100 Commercial Pl, Schertz, TX 78175</p>
                  </div>
                </div>

                <div className="map-container">
                  <iframe
                    className="w-100 h-100"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3474.625251593319!2d-98.26973368491834!3d29.55217398207307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865cf59af4e1a6f1%3A0x8d3b2171fe7b2a0f!2s100%20Commercial%20Pl%2C%20Schertz%2C%20TX%2078175%2C%20USA!5e0!3m2!1sen!2sbd!4v1666798592923!5m2!1sen!2sbd"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    title="Office Location"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right Panel: Form */}
            <div className="col-lg-7">
              <div className="contact-form-panel">
                <h2 className="contact-title">Send a Message</h2>
                <p className="contact-subtitle">Fill out the form below and our team will get back to you shortly.</p>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control contact-input"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control contact-input"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control contact-input"
                        placeholder="How can we help?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <div className="quill-contact">
                        <ReactQuill
                          theme="snow"
                          value={message}
                          onChange={setMessage}
                          modules={modules}
                          formats={formats}
                          placeholder="Your message details..."
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex flex-column align-items-center mb-4">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                          onChange={onCaptchaChange}
                        />
                      </div>
                      
                      {feedbackMessage && (
                        <div className={`alert ${feedbackMessage.includes('Error') || feedbackMessage.includes('Please') ? 'alert-danger' : 'alert-success'} mb-4`}>
                          {feedbackMessage}
                        </div>
                      )}
                      <button 
                        className="btn btn-primary w-100 auth-btn" 
                        type="submit" 
                        disabled={isSubmitting || !captchaToken}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;