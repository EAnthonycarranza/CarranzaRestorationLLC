import React, { useState } from 'react';

const Contact = () => {
  
    const [feedbackMessage, setFeedbackMessage] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedbackMessage(''); // Reset feedback message on new submission
    const formData = {
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      subject: event.target.elements.subject.value,
      message: event.target.elements.message.value,
    };
  
    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        // Check the content type of the response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            setFeedbackMessage('Email sent successfully. Thank you for contacting us!');
          } else {
            setFeedbackMessage(`Error: ${data.message}`);
          }
        } else {
          // Handle non-JSON response here
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
            title="Map of Our Office" // Add a descriptive title here
          ></iframe>
        </div>
        <div className="col-lg-6">
        <form onSubmit={handleSubmit} className="contact-form bg-light p-5">
  <div className="row g-3">
    <div className="col-12 col-sm-6">
      <input
        type="text"
        className="form-control border-0"
        placeholder="Your Name"
        name="name" // Add this line
        style={{ height: '55px' }}
      />
    </div>
    <div className="col-12 col-sm-6">
      <input
        type="email"
        className="form-control border-0"
        placeholder="Your Email"
        name="email" // Add this line
        style={{ height: '55px' }}
      />
    </div>
    <div className="col-12">
      <input
        type="text"
        className="form-control border-0"
        placeholder="Subject"
        name="subject" // Add this line
        style={{ height: '55px' }}
      />
    </div>
    <div className="col-12">
      <textarea
        className="form-control border-0"
        rows="4"
        placeholder="Message"
        name="message" // Add this line
      ></textarea>
    </div>
    <div className="col-12">
      <button className="btn btn-primary w-100 py-3" type="submit">
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
