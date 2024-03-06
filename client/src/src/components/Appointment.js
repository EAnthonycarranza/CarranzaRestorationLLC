import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Appointment = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [insuranceClaim, setInsuranceClaim] = useState('no');
  const [projectType, setProjectType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [claimNumber, setClaimNumber] = useState("I don't know");


  const handleQuoteRequest = async (event) => {
    event.preventDefault();
    setFeedbackMessage('');

    const formData = {
      name,
      email,
      date: startDate.toISOString(),
      time: startTime.toISOString(),
      message: event.target.elements.message.value,
      address,
      phoneNumber,
      projectType,
      insuranceClaim,
      insuranceCompany: insuranceClaim === 'yes' ? insuranceCompany : '',
      claimNumber: insuranceClaim === 'yes' ? claimNumber : ''
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

  const isFormValid = () => {
    return name && email && address && phoneNumber && projectType && (insuranceClaim !== 'yes' || (insuranceClaim === 'yes' && insuranceCompany && claimNumber));
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
                <InputField placeholder="Your Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                <InputField placeholder="Your Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="col-12">
    <p>Please provide your preferred inspection schedule date:</p>
  </div>
  <DatePickerField label="Call Back Date" date={startDate} setDate={setStartDate} />
                <DatePickerField label="Call Back Time" date={startTime} setDate={setStartTime} showTimeSelectOnly={true} />
                <InputField placeholder="Property Address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <InputField placeholder="Callback Phone Number" name="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <SelectField label="Project Type" name="projectType" options={['Water', 'Fire', 'Other']} value={projectType} onChange={(e) => setProjectType(e.target.value)} />
                <SelectField label="Is this an insurance claim?" name="insuranceClaim" options={['Yes', 'No (OOP)', 'I do not know']} value={insuranceClaim} onChange={(e) => setInsuranceClaim(e.target.value)} />
                {insuranceClaim === 'yes' && (
  <>
    <InputField placeholder="Insurance Company" name="insuranceCompany" value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} />
    <SelectField 
      label="Is there a claim number?" 
      name="claimNumber" 
      options={['Yes', 'No', "I don't know"]} 
      value={claimNumber} 
      onChange={(e) => setClaimNumber(e.target.value)} 
    />
  </>
)}

                <MessageField />
                <div className="col-12">
                  <button type="submit" className="btn btn-primary py-3 px-5" disabled={!isFormValid()}>Schedule NOW</button>
                </div>
              </div>
            </form>
            {feedbackMessage && <FeedbackMessage message={feedbackMessage} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ placeholder, name, type, value, onChange }) => (
  <div className="col-12 col-sm-6">
    <input type={type} className="form-control border-0" placeholder={placeholder} name={name} value={value} onChange={onChange} style={{ height: '55px' }} />
  </div>
);

const DatePickerField = ({ label, date, setDate, showTimeSelectOnly }) => (
  <div className="col-12 col-sm-6">
    <DatePicker
      selected={date}
      onChange={setDate}
      className="form-control border-0"
      placeholderText={label}
      showTimeSelect={showTimeSelectOnly}
      showTimeSelectOnly={showTimeSelectOnly}
      timeIntervals={15}
      timeCaption="Time"
      dateFormat={showTimeSelectOnly ? "h:mm aa" : "MMMM d, yyyy"}
      style={{ height: '55px' }}
    />
  </div>
);

const SelectField = ({ label, name, options, onChange, value }) => (
  <div className="col-12 col-sm-6">
    <select name={name} value={value} className="form-control border-0" style={{ height: '55px' }} onChange={onChange}>
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option.toLowerCase()}>{option}</option>
      ))}
    </select>
  </div>
);

const MessageField = () => (
  <div className="col-12">
    <textarea name="message" className="form-control border-0" rows="5" placeholder="Additional Notes..."></textarea>
  </div>
);

const FeedbackMessage = ({ message }) => (
  <div className="feedback-message">
    <p>{message}</p>
  </div>
);

export default Appointment;
