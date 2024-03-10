import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import ReactQuill from 'react-quill';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css'; // Ensure ReactQuill styles are loaded

const Appointment = () => {
  // Initial state setup
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [message, setMessage] = useState('');
  const [insuranceClaim, setInsuranceClaim] = useState('');
  const [projectType, setProjectType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [claimNumber, setClaimNumber] = useState('');


    const modules = {
      toolbar: [
        [{ 'font': [] }], // Font family
        [{ 'size': ['small', false, 'large'] }], // Font size
        [{ 'align': [] }], // Text align
        ['bold', 'italic', 'underline'], // Bold, italic, underline, strike
        [{ 'header': '1' }, { 'header': '2' }, { 'header': [] }], // Heading
        [{ 'indent': '+1' }], // Indent
        ['clean'] // Remove formatting button
      ]
    };
    
    const formats = [
      'font', 'size',
      'bold', 'italic', 'underline', 'strike',
      'color', 'background',
      'script', 'header', 'list', 'indent', 'direction', 'align',
      'link', 'image', 'video', 'blockquote', 'code-block'
    ];

  const handleQuoteRequest = async (event) => {
    event.preventDefault();
    setFeedbackMessage('');

    const formData = {
      name,
      email,
      date: startDate.toISOString(),
      time: startTime.toISOString(),
      message,
      address,
      phoneNumber,
      projectType,
      insuranceClaim: insuranceClaim === 'yes' ? 'Yes' : (insuranceClaim === 'no-oop' ? 'No (OOP)' : 'I do not know'),
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
                <div className="col-12 col-sm-6">
                  <input type="text" className="form-control border-0" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} style={{ height: '55px' }} />
                </div>
                <div className="col-12 col-sm-6">
                  <input type="email" className="form-control border-0" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} style={{ height: '55px' }} />
                </div>
                <div className="col-12 col-sm-6">
                  <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="form-control border-0" placeholderText="Select Date" />
                </div>
                <div className="col-12 col-sm-6">
                  <DatePicker selected={startTime} onChange={time => setStartTime(time)} className="form-control border-0" placeholderText="Select Time" showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" />
                </div>
                <div className="col-12">
                  <input type="text" className="form-control border-0" placeholder="Property Address" value={address} onChange={e => setAddress(e.target.value)} style={{ height: '55px' }} />
                </div>
                <div className="col-12">
                  <input type="tel" className="form-control border-0" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} style={{ height: '55px' }} />
                </div>
                <div className="col-12">
                  <select className="form-control border-0" value={projectType} onChange={e => setProjectType(e.target.value)} style={{ height: '55px' }}>
                    <option value="">Project Type</option>
                    <option value="water">Water</option>
                    <option value="fire">Fire</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-12">
                <select className="form-control border-0" value={insuranceClaim} onChange={e => setInsuranceClaim(e.target.value)} style={{ height: '55px' }}>
                    <option value="">Is there an insurance claim</option> {/* Improved for clarity */}
                    <option value="yes">Yes</option>
                    <option value="no">No (OOP)</option>
                    <option value="idk">I don't know</option>
                  </select>
                </div>
                {insuranceClaim === 'yes' && (
                  <>
                    <div className="col-12">
                      <input type="text" className="form-control border-0" placeholder="Insurance Company" value={insuranceCompany} onChange={e => setInsuranceCompany(e.target.value)} style={{ height: '55px' }} />
                    </div>
                    <div className="col-12">
                      <select className="form-control border-0" value={claimNumber} onChange={e => setClaimNumber(e.target.value)} style={{ height: '55px' }}>
                        <option value="">Do you have the claim number?</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="idk">I don't know</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="col-12">
                  <label htmlFor="additionalNotes">Additional Notes:</label>
                  <ReactQuill theme="snow" value={message} onChange={setMessage} modules={modules} formats={formats} />
                 </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary py-3 px-5" disabled={!isFormValid()}>Schedule NOW</button>
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
  );
};

export default Appointment;
