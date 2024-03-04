import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Appointment = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());

  const handleQuoteRequest = () => {
    console.log("Quote request handled");
    // Add your logic here
  };

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
              <form>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <input type="text" className="form-control border-0" placeholder="Your Name" style={{ height: '55px' }} />
                  </div>
                  <div className="col-12 col-sm-6">
                    <input type="email" className="form-control border-0" placeholder="Your Email" style={{ height: '55px' }} />
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
                    <textarea className="form-control border-0" rows="5" placeholder="Message"></textarea>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary py-3 px-5" type="button" onClick={handleQuoteRequest}>Schedule an inspection</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appointment;
