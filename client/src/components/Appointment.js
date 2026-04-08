import React, { useState, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import ReactQuill from 'react-quill';
import ReCAPTCHA from 'react-google-recaptcha';
import 'react-day-picker/dist/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import { TailSpin } from 'react-loader-spinner';
import dayjs from 'dayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const Appointment = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [message, setMessage] = useState('');
  const [insuranceClaim, setInsuranceClaim] = useState('');
  const [projectType, setProjectType] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeValue, setTimeValue] = useState(dayjs().hour(8).minute(0));
  const [selectedDateText, setSelectedDateText] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const recaptchaRef = useRef();
  
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

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
    setSelectedDateText(`Selected Date: ${formattedDate}`);
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

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setAddress(place.formatted_address);
        
        // Extract postal code if available
        const postCodeObj = place.address_components.find(comp => comp.types.includes('postal_code'));
        if (postCodeObj) {
          setPostalCode(postCodeObj.long_name);
        }
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    const numbersOnly = input.replace(/\D/g, '');
    if (input !== numbersOnly) {
      setPhoneNumberError('Numbers only, please.');
    } else {
      setPhoneNumberError('');
      setPhoneNumber(numbersOnly);
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };
  
  const formats = ['bold', 'italic', 'underline', 'list', 'bullet'];

  const handleQuoteRequest = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    
    if (!name || !email || !address || !phoneNumber || !projectType || !selectedDay || !timeValue) {
      setFeedbackMessage("Please fill in all required fields marked with *");
      return;
    }

    setLoading(true);

    try {
      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();

      const formData = {
        name, email, address, phoneNumber, projectType, postalCode,
        date: selectedDay.toISOString(),
        time: combineDateTime().toISOString(),
        message,
        insuranceClaim: insuranceClaim === 'yes' ? 'Yes' : (insuranceClaim === 'no' ? 'No' : 'Unknown'),
        insuranceCompany, claimNumber,
        captchaToken
      };

      const response = await fetch('/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setFeedbackMessage('Request sent successfully! We will contact you soon.');
      } else {
        setFeedbackMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setFeedbackMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-card animate-fadeInUp">
      <form onSubmit={handleQuoteRequest}>
        <div className="row g-4">
          
          {/* Section 1: Contact Info */}
          <div className="col-12">
            <h3 className="appointment-section-title">
              <i className="fa fa-user"></i> Contact Information
            </h3>
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Full Name *</label>
            <input type="text" className="form-control appointment-input" placeholder="e.g. John Doe" value={name} onChange={handleNameChange} />
            {isSubmitted && !name && <div className="error-msg-small">Name is required</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Email Address *</label>
            <input type="email" className="form-control appointment-input" placeholder="e.g. john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            {isSubmitted && !email && <div className="error-msg-small">Valid email is required</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Phone Number *</label>
            <input type="tel" className="form-control appointment-input" placeholder="e.g. 2101234567" value={phoneNumber} onChange={handlePhoneNumberChange} />
            {phoneNumberError && <div className="error-msg-small">{phoneNumberError}</div>}
            {isSubmitted && !phoneNumber && <div className="error-msg-small">Phone number is required</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Property Address *</label>
            <div className="position-relative">
              {isLoaded ? (
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <input 
                    type="text" 
                    className="form-control appointment-input" 
                    placeholder="Search address with Google..." 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                  />
                </Autocomplete>
              ) : (
                <input 
                  type="text" 
                  className="form-control appointment-input" 
                  placeholder="Loading Maps..." 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
              )}
            </div>
            {isSubmitted && !address && <div className="error-msg-small">Address is required</div>}
          </div>

          {/* Section 2: Project Details */}
          <div className="col-12 mt-5">
            <h3 className="appointment-section-title">
              <i className="fa fa-home"></i> Project Details
            </h3>
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Project Type *</label>
            <select className="form-select appointment-input" value={projectType} onChange={e => setProjectType(e.target.value)}>
              <option value="">Select Service...</option>
              <option value="water">Water Damage</option>
              <option value="fire">Fire Damage</option>
              <option value="roofing">Roofing Restoration</option> 
              <option value="remodel">Interior Remodeling</option>
              <option value="other">Other</option>
            </select>
            {isSubmitted && !projectType && <div className="error-msg-small">Please select a project type</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Insurance Related? *</label>
            <select className="form-select appointment-input" value={insuranceClaim} onChange={e => setInsuranceClaim(e.target.value)}>
              <option value="">Select Option...</option>
              <option value="yes">Yes, insurance claim</option>
              <option value="no">No, out of pocket</option>
              <option value="idk">Not sure yet</option>
            </select>
          </div>

          {insuranceClaim === 'yes' && (
            <>
              <div className="col-md-6 animate-fadeInUp">
                <label className="form-label-custom">Insurance Carrier</label>
                <input type="text" className="form-control appointment-input" placeholder="Carrier Name" value={insuranceCompany} onChange={e => setInsuranceCompany(e.target.value)} />
              </div>
              <div className="col-md-6 animate-fadeInUp">
                <label className="form-label-custom">Claim Number (if any)</label>
                <input type="text" className="form-control appointment-input" placeholder="Claim #" value={claimNumber} onChange={e => setClaimNumber(e.target.value)} />
              </div>
            </>
          )}

          {/* Section 3: Scheduling */}
          <div className="col-12 mt-5">
            <h3 className="appointment-section-title">
              <i className="fa fa-calendar-alt"></i> Schedule Inspection
            </h3>
            
            <div className="bg-light p-4 rounded-4 border shadow-sm mt-3">
              <div className="row align-items-center">
                {/* Date Side */}
                <div className="col-lg-7 border-end-lg text-center py-2">
                  <label className="form-label-custom mb-3">1. Select Preferred Date *</label>
                  <div className="d-inline-block p-2 bg-white rounded-3 shadow-sm mb-3">
                    <DayPicker
                      mode="single"
                      selected={selectedDay}
                      onSelect={handleDaySelect}
                      disabled={{ before: new Date() }}
                      className="rdp-modern"
                    />
                  </div>
                  {selectedDay && <div className="selected-date-badge d-block mx-auto" style={{ maxWidth: '250px' }}>{selectedDateText}</div>}
                  {isSubmitted && !selectedDay && <div className="error-msg-small">Please select a date</div>}
                </div>

                {/* Time Side */}
                <div className="col-lg-5 text-center py-2 mt-4 mt-lg-0">
                  <label className="form-label-custom mb-3">2. Select Preferred Time *</label>
                  <div className="p-4 h-100 d-flex flex-column justify-content-center align-items-center">
                    <div className="bg-white p-3 rounded-3 shadow-sm w-100 mb-3" style={{ maxWidth: '280px' }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          value={timeValue}
                          onChange={handleTimeChange}
                          renderInput={(params) => <input className="form-control appointment-input text-center" {...params} />}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="alert alert-info py-2 px-3 small mb-0" style={{ fontSize: '0.8rem', borderRadius: '10px' }}>
                      <i className="fa fa-clock me-2"></i>
                      Standard hours: 8:00 AM - 6:00 PM
                    </div>
                    {isSubmitted && !timeValue && <div className="error-msg-small mt-2">Please select a time</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mt-4">
            <label className="form-label-custom">Additional Notes (Optional)</label>
            <div className="quill-appointment shadow-sm">
              <ReactQuill 
                theme="snow" 
                value={message} 
                onChange={setMessage} 
                modules={modules} 
                formats={formats} 
                placeholder="Tell us more about your project..." 
              />
            </div>
          </div>

          {/* Feedback & Submit */}
          <div className="col-12 text-center mt-5">
            {feedbackMessage && (
              <div className={`alert ${feedbackMessage.includes('Error') || feedbackMessage.includes('Please') ? 'alert-danger' : 'alert-success'} mb-4 animate-fadeInUp`}>
                {feedbackMessage}
              </div>
            )}
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            />
            <button type="submit" className="btn btn-primary py-3 px-5 shadow-lg w-100" style={{ maxWidth: '400px', fontSize: '1.1rem', fontWeight: '800' }}>
              {loading ? <TailSpin color="#fff" height={30} width={30} /> : 'CONFIRM APPOINTMENT'}
            </button>
          </div>
          
        </div>
      </form>
    </div>
  );
};

export default Appointment;





