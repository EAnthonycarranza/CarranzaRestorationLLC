import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Appointment = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleQuoteRequest = async (event) => {
    event.preventDefault();
    setFeedbackMessage('');

    const formData = {
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      date: startDate.toISOString(),
      time: startTime.toISOString(),
      message: event.target.elements.message.value,
    };

    try {
      const response = await fetch('/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setFeedbackMessage(data.success ? 'Message sent successfully. Thank you! We will get back to you as soon as possible!' : `Error: ${data.message}`);
      } else {
        setFeedbackMessage('Error sending quote request. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedbackMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container-fluid py-6 px-5">
      <div className="row gx-5">
        <div className="col-lg-4 mb-5 mb-lg-0">
          <h1 className="display-5 text-uppercase mb-4">Request A <span className="text-primary">Call Back</span></h1>
          <p className="mb-5">Our experts are ready to listen to your needs and offer tailored solutions. Reach out now and let's discuss your home renovation project.</p>
        </div>
        <div className="col-lg-8">
          <div className="bg-light text-center p-5">
            <form onSubmit={handleQuoteRequest}>
              <div className="row g-3">
                <InputField placeholder="Your Name" name="name" />
                <InputField placeholder="Your Email" name="email" type="email" />
                <DatePickerField label="Call Back Date" date={startDate} setDate={setStartDate} />
                <DatePickerField label="Call Back Time" date={startTime} setDate={setStartTime} showTimeSelectOnly={true} />
                <MessageField />
                <SubmitButton />
              </div>
            </form>
            {feedbackMessage && <FeedbackMessage message={feedbackMessage} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ placeholder, name, type = 'text' }) => (
  <div className="col-12 col-sm-6">
    <input type={type} className="form-control border-0" placeholder={placeholder} name={name} style={{ height: '55px' }} />
  </div>
);

const DatePickerField = ({ label, date, setDate, showTimeSelectOnly = false }) => (
  <div className="col-12 col-sm-6">
    <DatePicker selected={date} onChange={setDate} className="form-control border-0" placeholderText={label} showTimeSelect={showTimeSelectOnly} showTimeSelectOnly={showTimeSelectOnly} timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" style={{ height: '55px' }} />
  </div>
);

const MessageField = () => (
  <div className="col-12">
    <textarea name="message" className="form-control border-0" rows="5" placeholder="Message"></textarea>
  </div>
);

const SubmitButton = () => (
  <div className="col-12">
    <button type="submit" className="btn btn-primary py-3 px-5">Schedule an inspection</button>
  </div>
);

const FeedbackMessage = ({ message }) => (
  <div className="feedback-message">
    <p>{message}</p>
  </div>
);

export default Appointment;
