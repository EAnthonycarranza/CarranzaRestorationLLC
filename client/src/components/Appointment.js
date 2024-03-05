import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Appointment = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [insuranceClaim, setInsuranceClaim] = useState('no'); // Declare insuranceClaim state

  const SelectField = ({ label, name, options, onChange }) => (
    <div className="col-12 col-sm-6">
      <select name={name} className="form-control border-0" style={{ height: '55px' }} onChange={onChange}>
        <option value="">{label}</option>
        {options.map(option => (
          <option key={option} value={option.toLowerCase()}>{option}</option>
        ))}
      </select>
    </div>
  );

  const handleQuoteRequest = async (event) => {
    event.preventDefault();
    setFeedbackMessage('');

    const formData = {
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      date: startDate.toISOString(),
      time: startTime.toISOString(),
      message: event.target.elements.message.value,
      address: event.target.elements.address.value,
      phoneNumber: event.target.elements.phoneNumber.value,
      projectType: event.target.elements.projectType.value,
      insuranceClaim: insuranceClaim,
      insuranceCompany: insuranceClaim === 'yes' ? event.target.elements.insuranceCompany.value : '',
      claimNumber: insuranceClaim === 'yes' ? event.target.elements.claimNumber.value : ''
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
          <h1 className="display-5 text-uppercase mb-4">Request An <span className="text-primary">estimate and inspection</span></h1>
          <p className="mb-5">Benefit from the precision, accuracy, and speed of our estimation and inspection process, ensuring reliable solutions for your home renovation project. Fill out our form to get started!</p>
        </div>
        <div className="col-lg-8">
          <div className="bg-light text-center p-5">
            <form onSubmit={handleQuoteRequest}>
              <div className="row g-3">
                <InputField placeholder="Your Name" name="name" />
                <InputField placeholder="Your Email" name="email" type="email" />
                <DatePickerField label="Call Back Date" date={startDate} setDate={setStartDate} />
                <DatePickerField label="Call Back Time" date={startTime} setDate={setStartTime} showTimeSelectOnly={true} />
                <InputField placeholder="Property Address" name="address" />
        <InputField placeholder="Callback Phone Number" name="phoneNumber" type="tel" />
        <SelectField label="Project Type" name="projectType" options={['Water Damage', 'Fire Damage', 'Other']} />
        <SelectField label="Is this an insurance claim?" name="insuranceClaim" options={['Yes', 'No (OOP)', 'I do not know']} onChange={(e) => setInsuranceClaim(e.target.value)} />
        {insuranceClaim === 'yes' && (
          <>
            <InputField placeholder="Insurance Company" name="insuranceCompany" />
            <SelectField label="Is there a claim number?" name="hasClaimNumber" options={['Yes', 'No', 'I do not know']} />
          </>
        )}
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

const DatePickerField = ({ label, date, setDate, showTimeSelectOnly = false }) => {
  const isTimePicker = showTimeSelectOnly;
  return (
    <div className="col-12 col-sm-6">
      <DatePicker
        selected={date}
        onChange={setDate}
        className="form-control border-0"
        placeholderText={label}
        showTimeSelect={isTimePicker}
        showTimeSelectOnly={isTimePicker}
        timeIntervals={15}
        timeCaption="Time"
        dateFormat={isTimePicker ? "h:mm aa" : "MMMM d, yyyy"} // Adjust dateFormat based on whether it's a time picker
        style={{ height: '55px' }}
      />
    </div>
  );
};


const MessageField = () => (
  <div className="col-12">
    <textarea name="message" className="form-control border-0" rows="5" placeholder="Message"></textarea>
  </div>
);

const SubmitButton = () => (
  <div className="col-12">
    <button type="submit" className="btn btn-primary py-3 px-5">Schedule NOW</button>
  </div>
);

const FeedbackMessage = ({ message }) => (
  <div className="feedback-message">
    <p>{message}</p>
  </div>
);

export default Appointment;
