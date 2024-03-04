// Appointment.js
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

    // Format the date and time
    const formattedDate = new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit' 
    }).format(startDate);

    const formattedTime = new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    }).format(startTime);

    const formData = {
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      date: formattedDate,
      time: formattedTime,
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

  return (
    <>
      <div className="container-fluid py-6 px-5">
        <div className="row gx-5">
          <div className="col-lg-8">
            <div className="bg-light text-center p-5">
              <form onSubmit={handleQuoteRequest}>
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
                    <button className="btn btn-primary py-3 px-5" type="submit">Schedule an inspection</button>
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
      </div>
    </>
  );
}

export default Appointment;
