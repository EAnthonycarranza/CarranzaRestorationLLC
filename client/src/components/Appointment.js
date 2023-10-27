import React from 'react';

// If there are any images to be used in this component, import them here:
// import imgName from './path-to-image.jpg';

const Appointment = () => {
  // Define the function to handle the quote request
  const handleQuoteRequest = () => {
    // Implement the logic to handle the quote request (e.g., open a modal, submit a form, etc.)
    console.log("Quote request handled"); // Placeholder action
  };
  return (
    <>
      <div className="container-fluid py-6 px-5">
        <div className="row gx-5">
          <div className="col-lg-4 mb-5 mb-lg-0">
            <div className="mb-4">
              <h1 className="display-5 text-uppercase mb-4">Request A <span className="text-primary">Call Back</span></h1>
            </div>
            <p className="mb-5">Nonumy ipsum amet tempor takimata vero ea elitr...</p>
            <button className="btn btn-primary py-3 px-5" onClick={handleQuoteRequest}>Get A Quote</button>
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
                    <div className="date" id="date" data-target-input="nearest">
                      <input type="text"
                        className="form-control border-0 datetimepicker-input"
                        placeholder="Call Back Date" data-target="#date" data-toggle="datetimepicker" style={{ height: '55px' }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="time" id="time" data-target-input="nearest">
                      <input type="text"
                        className="form-control border-0 datetimepicker-input"
                        placeholder="Call Back Time" data-target="#time" data-toggle="datetimepicker" style={{ height: '55px' }} />
                    </div>
                  </div>
                  <div className="col-12">
                    <textarea className="form-control border-0" rows="5" placeholder="Message"></textarea>
                  </div>
                  <div className="col-12">
                  <button className="btn btn-primary py-3 px-5" type="button" onClick={handleQuoteRequest}>Get A Quote</button>
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
