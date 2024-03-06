import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Include styles

const Contact = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    return name.trim() && email.trim() && subject.trim() && message.trim();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setFeedbackMessage('Please fill in all fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage('');

    const formData = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };

    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            setFeedbackMessage('Email sent successfully. Thank you for contacting us!');
          } else {
            setFeedbackMessage(`Error: ${data.message}`);
          }
        } else {
          const text = await response.text();
          setFeedbackMessage(text);
        }
      } else {
        setFeedbackMessage('Error sending email. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedbackMessage('An error occurred. Please try again later.');
    }

    setIsSubmitting(false); // Re-enable the form after submission
  };

  return (
    <div className="container-fluid py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
        <h1 className="display-5 text-uppercase mb-4">
          Please <span className="text-primary">Feel Free</span> To Contact Us
        </h1>
      </div>
      <div className="row gx-0 align-items-center">
        <div className="col-lg-6 mb-5 mb-lg-0" style={{ height: '600px' }}>
          <iframe
            className="w-100 h-100"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3474.625251593319!2d-98.26973368491834!3d29.55217398207307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865cf59af4e1a6f1%3A0x8d3b2171fe7b2a0f!2s100%20Commercial%20Pl%2C%20Schertz%2C%20TX%2078175%2C%20USA!5e0!3m2!1sen!2sbd!4v1666798592923!5m2!1sen!2sbd"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            title="Map of Our Office"
          ></iframe>
        </div>
        
        <div className="col-lg-6">
          <form onSubmit={handleSubmit} className="contact-form bg-light p-5">
            <div className="contact-details mt-5" style={{ textAlign: "center" }}>
              <h3>Contact Information</h3>
              <p>Email: <a href="mailto:admin@carranzarestoration.com">admin@carranzarestoration.com</a></p>
              <p>Phone: <a href="tel:2102671008">(210) 267-1008</a></p>
              <h3>Contact Us</h3>
              <p>Enter your information here and we will get back to you shortly.</p>
            </div>
            <div className="row g-3">
              <div className="col-12 col-sm-6">
              <input
  type="text"
  className="form-control border-0"
  placeholder="Your Name"
  name="name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
  style={{ height: '55px' }}
/>
              </div>
              <div className="col-12 col-sm-6">

              <input
  type="email"
  className="form-control border-0"
  placeholder="Your Email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  style={{ height: '55px' }}
/>
              </div>
              <div className="col-12">
              <input
  type="text"
  className="form-control border-0"
  placeholder="Subject"
  name="subject"
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  required
  style={{ height: '55px' }}
/>
              </div>
              <ReactQuill
  value={message}
  onChange={content => setMessage(content)}/>
              <div className="col-12">
        <button className="btn btn-primary w-100 py-3" type="submit" disabled={!isFormValid() || isSubmitting}>
          Send Message
        </button>
        </div>
            </div>
          </form>
          {feedbackMessage && (
            <div className="mt-3">
              <p>{feedbackMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
