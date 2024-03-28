import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import ReactQuill from 'react-quill';
import 'react-day-picker/dist/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs'; // Make sure you've imported dayjs
// Importing necessary components for TimePicker
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

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

  const handleDaySelect = (date) => {
    setSelectedDay(date);
    // Format the selected day for display
    const formattedDate = dayjs(date).format('MMMM D, YYYY');
    setSelectedDateText(`You have selected: ${formattedDate}`);
  };

  const handleTimeChange = (newValue) => {
    // Ensure newValue is a Dayjs object; AdapterDayjs should automatically handle this conversion
    setTimeValue(newValue);
  };

  const combineDateTime = () => {
    if (!selectedDay || !timeValue) {
      return null; // or some default value
    }
  
    // Use dayjs methods to handle Dayjs objects
    const hours = timeValue.hour();
    const minutes = timeValue.minute();
    const combinedDate = dayjs(selectedDay)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toDate(); // convert to JavaScript Date if needed
  
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
      // Use axios.get() to make the request
      const response = await axios.get(url);
      if (response.data && response.data.data) {
        setAddressSuggestions(response.data.data); // Assuming 'data' contains the address suggestions
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };
  
  const handlePhoneNumberChange = e => {
    const input = e.target.value;
    const numbersOnly = input.replace(/\D/g, ''); // Remove non-digit characters
  
    if (input !== numbersOnly) {
      // Set an error message in state
      setPhoneNumberError('Please enter numbers only.');
    } else {
      // Clear error message and update state
      setPhoneNumberError('');
      setPhoneNumber(numbersOnly);
    }
  };

// Add a method to handle selection of an address
// This function should be called when a user selects an address from the suggestions
const selectAddress = (suggestion) => {
  // Set the full address from the suggestion
  setAddress(suggestion.label); // Ensure this is the full address string

  // Here you could also split the address and set the individual parts to state if needed
  // const parts = suggestion.label.split(', ');
  // if (parts.length >= 3) {
  //   setCity(parts[1].trim());
  //   setState(parts[2].trim());
  //   // Further processing might be needed to extract the country from the parts[2] if it contains both state and country
  // }

  setIsAddressSelected(true);
  setAddressSuggestions([]); // Clear the suggestions list
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
      event.preventDefault(); // This line should only be here once.
      setFeedbackMessage('');
    
      // Ensure an address has been selected from the dropdown before submitting
      if (!isAddressSelected) {
        setFeedbackMessage('Please select an address from the dropdown.');
        return;
      }
    
      const formData = {
        name,
        email,
        date: selectedDay.toISOString(),
        time: combineDateTime().toISOString(),
        message,
        address, // This is the street address part
        city,    // New field
        state,   // New field
        country, // New field
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
    // Replace the timeValue check with a Date object validation
    const timeIsValid = timeValue && timeValue.isValid && timeValue.isValid();

  
    // Check if insurance claim has been selected
    const insuranceClaimSelected = insuranceClaim !== '';
  
    return (
      name &&
      email &&
      address &&
      phoneNumber &&
      projectType &&
      isAddressSelected && // Make sure an address has been selected from the suggestions
      (insuranceClaim !== 'yes' || (insuranceClaim === 'yes' && insuranceCompany && claimNumber)) &&
      selectedDay && // Make sure a date has been selected
      timeIsValid && // Check that the time is valid
      insuranceClaimSelected // Ensure an insurance claim option has been selected
    );
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
                <div className="col-12 col-sm-6"style={{ display: "contents"}}>
                <DayPicker
  mode="single"
  selected={selectedDay}
  onSelect={handleDaySelect}
  fromMonth={currentMonth} // Earliest month that can be navigated to
  toMonth={twoMonthsFromNow} // Latest month that can be navigated to
  disabled={{ before: new Date() }} // Disable days before today
  className="mx-auto"
  styles={{
    caption: { color: '#FD5D14' }
  }}
/>

    </div>
    {selectedDay && <p>{selectedDateText}</p>}

      {/* Replace the address input with a new implementation */}
      <div className="col-12 col-sm-6">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={timeValue}
          onChange={handleTimeChange}
          renderInput={(params) => <input className="form-control border-0" {...params} style={{ height: '55px' }} />}
        />
      </LocalizationProvider>
      </div>

      <div className="col-12">
        <input
          type="text"
          className="form-control border-0"
          placeholder="Property Address"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          style={{ height: '55px' }}
        />
        {addressSuggestions.length > 0 && (
          <ul className="address-suggestions">
  {addressSuggestions.map((suggestion, index) => (
    <li key={index} onClick={() => selectAddress(suggestion)}>
      {suggestion.label} {/* Render the address or label from the suggestion here */}
    </li>
  ))}
</ul>

        )}
      </div>
                <div className="col-12">
                <div className="form-group">
                <input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  className="form-control border-0"
  placeholder="Phone Number"
  value={phoneNumber}
  onChange={handlePhoneNumberChange}
  style={{ height: '55px' }}
/>
    {phoneNumberError && <div className="error-message" style={{ color: 'red' }}>{phoneNumberError}</div>}
  </div>

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
                <button type="submit" className="btn btn-primary py-3 px-5" disabled={!isFormValid()}>
      Schedule NOW
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
    </div>
  );
};

export default Appointment;