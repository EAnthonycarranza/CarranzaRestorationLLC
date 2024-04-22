import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import ReactQuill from 'react-quill';
import 'react-day-picker/dist/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import { TailSpin } from 'react-loader-spinner';
import dayjs from 'dayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

const Appointment = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [message, setMessage] = useState('');
  const [insuranceClaim, setInsuranceClaim] = useState('');
  const [projectType, setProjectType] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeValue, setTimeValue] = useState(dayjs().hour(8).minute(0));
  const [selectedDateText, setSelectedDateText] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNameChange = (e) => {
    const input = e.target.value;
    const spaceCount = input.split(' ').length - 1; 
    if (spaceCount <= 1) {
      setName(input);
    }
  };

  const handleDaySelect = (date) => {
    setSelectedDay(date);
    const formattedDate = dayjs(date).format('MMMM D, YYYY');
    setSelectedDateText(`You have selected: ${formattedDate}`);
  };

  const handleTimeChange = (newValue) => {
    setTimeValue(newValue);
  };

  const combineDateTime = () => {
    if (!selectedDay || !timeValue) {
      return null;
    }
    const combinedDate = dayjs(selectedDay).hour(timeValue.hour()).minute(timeValue.minute()).second(0).millisecond(0).toDate();
    return combinedDate;
  };

  const currentMonth = new Date();
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

  const handleAddressChange = async (inputValue) => {
    setAddress(inputValue);
    setIsAddressSelected(false);
    if (inputValue.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    const api_key = '29a20688eb5ad490b5477ecf3679e616';
    const url = `https://api.positionstack.com/v1/forward?access_key=${api_key}&query=${encodeURIComponent(inputValue)}`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.data) {
        setAddressSuggestions(response.data.data.map(suggestion => ({
          label: suggestion.label,
          postalCode: suggestion.postal_code // Ensure to get the postal_code from the API response
        })));
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
};

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    const numbersOnly = input.replace(/\D/g, '');
    if (input !== numbersOnly) {
      setPhoneNumberError('Please enter numbers only.');
    } else {
      setPhoneNumberError('');
      setPhoneNumber(numbersOnly);
    }
  };

  const selectAddress = (suggestion) => {
    // Append the postal code to the address
    const fullAddress = `${suggestion.label}, ${suggestion.postalCode}`;
    setAddress(fullAddress);
    setPostalCode(suggestion.postalCode); // Set the postal code
    setIsAddressSelected(true);
    setAddressSuggestions([]);
};

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
    setIsSubmitted(true);
    setLoading(true);
    if (!isAddressSelected) {
      setFeedbackMessage('Please select an address from the dropdown.');
      setTimeout(() => setLoading(false), 1000); 
      return;
    }
    const formData = {
      name,
      email,
      date: selectedDay.toISOString(),
      time: combineDateTime().toISOString(),
      message,
      address,
      city,
      state,
      country,
      phoneNumber,
      postalCode, // Include postal code
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
    setTimeout(() => setLoading(false), 1000); 
  };

  const isFormValid = () => {
    const timeIsValid = timeValue && timeValue.isValid && timeValue.isValid();
    const insuranceClaimSelected = insuranceClaim !== '';
    return name && email && address && phoneNumber && projectType && isAddressSelected && (insuranceClaim !== 'yes' || (insuranceClaim === 'yes' && insuranceCompany && claimNumber)) && selectedDay && timeIsValid && insuranceClaimSelected;
    setIsSubmitted(true); // Indicate that the form has been submitted
    return /* all required fields are valid */;
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
                
                {/* Name Field */}
                <div className="col-12 col-sm-6">
                  {!name && <div className="error-message">* Name is required</div>}
                  <input type="text" className="form-control border-0" placeholder="Your Name *" value={name} onChange={handleNameChange} style={{ height: '55px' }} />
                </div>
  
                {/* Email Field */}
                <div className="col-12 col-sm-6">
                  {!email && <div className="error-message">* Email is required</div>}
                  <input type="email" className="form-control border-0" placeholder="Your Email *" value={email} onChange={e => setEmail(e.target.value)} style={{ height: '55px' }} />
                </div>
  
  {/* Error message for date picker */}
  {!selectedDay && (
  <div className="error-message" style={{ marginTop: '70px' }}>* Date is required</div>
)}
  
                                    {/* Display selected date text above the Date Picker */}
                                    {selectedDay && (
    <p className="selected-date-display" style={{ marginTop: '55px' }}>
      {selectedDateText}
    </p>
  )}

  {/* Date Picker */}
  <div className="col-12 col-sm-6" style={{ display: "contents" }}>
    <DayPicker
      mode="single"
      selected={selectedDay}
      onSelect={handleDaySelect}
      fromMonth={currentMonth}
      toMonth={twoMonthsFromNow}
      disabled={{ before: new Date() }}
      className="mx-auto"
      styles={{ caption: { color: '#FD5D14' } }}
    />
  </div>
  
                {/* Time Picker */}
                <div className="col-12 col-sm-6" style={{ marginBottom: '50px' }}>
                  {(!timeValue || !timeValue.isValid()) && <div className="error-message">* Time is required</div>}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      value={timeValue}
                      onChange={handleTimeChange}
                      renderInput={(params) => <input className="form-control border-0" {...params} style={{ height: '55px' }} />}
                    />
                  </LocalizationProvider>
                </div>

  
                {/* Address Field */}
                <div className="col-12">
                  {!address && <div className="error-message">* Address is required</div>}
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Property Address *"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    style={{ height: '55px' }}
                  />
                  {addressSuggestions.length > 0 && (
                    <ul className="address-suggestions">
                      {addressSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => selectAddress(suggestion)}>
                          {`${suggestion.label}, ${suggestion.postalCode}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
  
                {/* Phone Number Field */}
                <div className="col-12">
                  {(!phoneNumber || phoneNumberError) && <div className="error-message">* Phone number is required</div>}
                  <div className="form-group">
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="form-control border-0"
                      placeholder="Phone Number *"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      style={{ height: '55px' }}
                    />
                  </div>
                </div>
  
                {/* Project Type Selector */}
                <div className="col-12">
                  {!projectType && <div className="error-message">* Project type is required</div>}
                  <select className="form-control border-0" value={projectType} onChange={e => setProjectType(e.target.value)} style={{ height: '55px' }}>
                    <option value="">Project Type *</option>
                    <option value="water">Water</option>
                    <option value="fire">Fire</option>
                    <option value="roofing">Roofing</option> 
                    <option value="other">Other</option>
                  </select>
                </div>
  
                {/* Insurance Claim Selector */}
                <div className="col-12">
                  {!insuranceClaim && <div className="error-message">* Insurance claim status is required</div>}
                  <select className="form-control border-0" value={insuranceClaim} onChange={e => setInsuranceClaim(e.target.value)} style={{ height: '55px' }}>
                    <option value="">Is there an insurance claim *</option>
                    <option value="yes">Yes</option>
                    <option value="no">No (OOP)</option>
                    <option value="idk">I don't know</option>
                  </select>
                </div>
  
                {/* Conditional Insurance Company and Claim Number Fields */}
                {insuranceClaim === 'yes' && (
                  <>
                    <div className="col-12">
                      {!insuranceCompany && <div className="error-message">* Insurance company is required</div>}
                      <input type="text" className="form-control border-0" placeholder="Insurance Company *" value={insuranceCompany} onChange={e => setInsuranceCompany(e.target.value)} style={{ height: '55px' }} />
                    </div>
                    <div className="col-12">
                      {!claimNumber && <div className="error-message">* This field is required</div>}
                      <select className="form-control border-0" value={claimNumber} onChange={e => setClaimNumber(e.target.value)} style={{ height: '55px' }}>
                        <option value="">Do you have the claim number? *</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="idk">I don't know</option>
                      </select>
                    </div>
                  </>
                )}
  
                {/* Additional Notes Field */}
                <div className="col-12">
                  <label htmlFor="additionalNotes">Additional Notes:</label>
                  <ReactQuill theme="snow" value={message} onChange={setMessage} modules={modules} formats={formats} />
                </div>
  
                {/* Submission Button */}
                <div className="col-12">
                  <button type="submit" className="btn btn-primary py-3 px-5">
                    Schedule NOW
                  </button>
                  {loading && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '20vh',
                      marginTop: '20px'
                    }}>
                      <TailSpin color="rgb(253, 93, 20)" height={100} width={100} />
                    </div>
                  )}
                </div>
                
              </div>
            </form>
            {!loading && feedbackMessage && (
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





