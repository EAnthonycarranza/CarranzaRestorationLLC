import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Appointment = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleQuoteRequest = async (event) => {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    setFeedbackMessage(''); // Reset feedback message on new submission

    // Send the raw startDate and startTime directly without formatting
    const formData = {
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      date: startDate.toISOString(), // Send as ISO string for easy parsing on the server
      time: startTime.toISOString(), // Send as ISO string for easy parsing on the server
      message: event.target.elements.message.value,
    };

    try {
      const response = await fetch('/send-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {

    try {
      const response = await fetch('/send-quote', {
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
            setFeedbackMessage('Message sent successfully. Thank you! We will get back to you as soon as possible! Thank you!');
          } else {
            setFeedbackMessage(`Error: ${data.message}`);
          }
        } else {
          // Handle non-JSON response here
          const text = await response.text();
          setFeedbackMessage(text);
        }
      } else {
        setFeedbackMessage('Error sending quote request. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedbackMessage('An error occurred. Please try again later.');
    }
  };
  }

  return (
    <>
      <div className="container-fluid py-6 px-5">
        <div className="row gx-5">
          <div className="col-lg-4 mb-5 mb-lg-0">
            <div className="mb-4">
              <h1 className="display-5 text-uppercase mb-4">Request A <span className="text-primary">Call Back</span></h1>
            </div>
            <p className="mb-5">Our experts are ready to listen to your needs and offer tailored solutions. Reach out now and let's discuss your home renovation project.</p>
            <button className="btn btn-primary py-3 px-5" onClick={handleQuoteRequest}>Schedule and inspection</button>
          </div>
          <div className="col-lg-8">
<div className="bg-light text-center p-5">
  <form onSubmit={handleQuoteRequest}> {/* Use onSubmit here */}
    <div className="row g-3">
      <div className="col-12 col-sm-6">
        <input type="text" name="name" className="form-control border-0" placeholder="Your Name" style={{ height: '55px' }} />
      </div>
      <div className="col-12 col-sm-6">
        <input type="email" name="email" className="form-control border-0" placeholder="Your Email" style={{ height: '55px' }} />
      </div>
      <div className="col-12 col-sm-6">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="form-control border-0"
          placeholderText="Call Back Date"
          style={{ height: '55px' }}
        />
      </div>
      <div className="col-12 col-sm-6">
        <DatePicker
          selected={startTime}
          onChange={(time) => setStartTime(time)}
          className="form-control border-0"
          placeholderText="Call Back Time"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          style={{ height: '55px' }}
        />
      </div>
      <div className="col-12">
        <textarea name="message" className="form-control border-0" rows="5" placeholder="Message"></textarea>
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-primary py-3 px-5">Schedule an inspection</button> {/* Ensure type="submit" */}
      </div>
    </div>
  </form>
              {/* Feedback message display */}
              {feedbackMessage && (
              <div className="feedback-message">
                <p>{feedbackMessage}</p>
              </div>
            )}
</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appointment;
