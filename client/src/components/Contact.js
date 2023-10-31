import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageDropzone = ({ onDrop, files, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const dropzoneStyle = {
    // Add your base styles here
    border: '2px dashed #ccc',
    padding: '20px',
    // Change style based on dragging state
    backgroundColor: isDragging ? '#e9e9e9' : 'white',
  };

  return (
    <div {...getRootProps()} className="dropzone" style={dropzoneStyle}>
      <input {...getInputProps()} />
      <p>Drag and drop a photo here, or click to select a photo</p>
      <div className="preview-container">
        {files.map((file, index) => (
          <div key={file.name} className="preview" style={{ textAlign: 'center' }}>
            <img src={file.preview} alt={file.name} className="preview-image" style={{ maxWidth: '100%', height: 'auto', display: 'inline-block' }} />
            <button type="button" className="remove-image" onClick={() => onRemove(index)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
};


const Contact = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedbackMessage('');

    const formData = new FormData();
    formData.append('name', event.target.elements.name.value);
    formData.append('email', event.target.elements.email.value);
    formData.append('subject', event.target.elements.subject.value);
    formData.append('message', event.target.elements.message.value);
    files.forEach(file => formData.append('images', file));

    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFeedbackMessage('Email sent successfully. Thank you for contacting us!');
        } else {
          setFeedbackMessage(`Error: ${data.message}`);
        }
      } else {
        setFeedbackMessage('Error sending email. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedbackMessage('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);
  
  return (
    <div className="container-fluid py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
        <h1 className="display-5 text-uppercase mb-4">
          Please <span className="text-primary">Feel Free</span> To Contact Us
        </h1>
      </div>
      <div className="row gx-0 align-items-center">
        <div className="col-lg-6 mb-5 mb-lg-0" style={{ height: '600px' }}>
          <iframe
            className="w-100 h-100"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3474.625251593319!2d-98.26973368491834!3d29.55217398207307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865cf59af4e1a6f1%3A0x8d3b2171fe7b2a0f!2s100%20Commercial%20Pl%2C%20Schertz%2C%20TX%2078175%2C%20USA!5e0!3m2!1sen!2sbd!4v1666798592923!5m2!1sen!2sbd"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            title="Map of Our Office"
          ></iframe>
        </div>
        <div className="col-lg-6">
          <ImageDropzone onDrop={onDrop} files={files} onRemove={removeImage} />
          <form onSubmit={handleSubmit} className="contact-form bg-light p-5">
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Your Name"
                  name="name"
                  style={{ height: '55px' }}
                />
              </div>
              <div className="col-12 col-sm-6">
                <input
                  type="email"
                  className="form-control border-0"
                  placeholder="Your Email"
                  name="email"
                  style={{ height: '55px' }}
                />
              </div>
              <div className="col-12">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Subject"
                  name="subject"
                  style={{ height: '55px' }}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control border-0"
                  rows="4"
                  placeholder="Message"
                  name="message"
                ></textarea>
              </div>
              <div className="col-12">
                <button className="btn btn-primary w-100 py-3" type="submit">
                  Send Message
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
  );
};

export default Contact;
