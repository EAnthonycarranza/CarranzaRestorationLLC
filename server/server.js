const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const juice = require('juice');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const axios = require('axios');

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Use environment variable for your email
      pass: process.env.EMAIL_PASSWORD, // Use environment variable for your password
    },
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known'), {
  dotfiles: 'allow' // this is crucial for .well-known directory
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


app.post('/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  const emailStyles = `
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      p { margin: 0 0 10px; }
      h1, h2, h3 { margin: 10px 0; }
      .ql-size-small { font-size: 0.75em; }
      .ql-size-large { font-size: 1.5em; }
      .ql-size-huge { font-size: 2.5em; }
      .ql-align-center { text-align: center; }
      .ql-align-right { text-align: right; }
      .ql-align-justify { text-align: justify; }
    </style>
  `;

  const emailHtmlContent = `
  <div>
    <p><strong style="color: black;">From:</strong> <span style="color: black;">${name} (${email})</span></p>
    <p><strong style="color: black;">Message:</strong></p>
    <div style="color: black;">${message}</div>
    <hr>
    <div style="margin-top: 20px;">
      <a href="http://www.carranzarestoration.org" target="_blank" style="color: blue;">
        <img src="https://storage.googleapis.com/new13/CarranzaLLCLogo1.png" alt="Carranza Restoration LLC Logo" style="max-width: 200px;">
      </a>
      <div style="margin-top: 10px;">
        <p style="margin: 0; font-weight: bold; color: black;">Carranza Restoration LLC; FWR General Contractors</p>
        <a href="https://maps.google.com/?q=100+Commercial+Place+Schertz+TX+78154" target="_blank" style="color: blue;">
          <p style="margin: 5px 0;">100 Commercial Place</p>
          <p style="margin: 0;">Schertz, TX 78154</p>
        </a>
        <p style="margin: 5px 0">
          <a href="tel:+12102671008" style="color: blue;"> (210) 267-1008</a> <span style="color: black;">Office</span>
        </p>
        <p style="margin: 0;">
          <a href="tel:+12104285610" style="color: blue;"> (210) 428-5610</a> <span style="color: black;">Cell</span>
        </p>
      </div>      
      <p><a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank" style="color: blue;">Google Review</a></p>
      <p><a href="http://www.carranzarestoration.org" target="_blank" style="color: blue;">Carranza Restoration LLC Website</a></p>
      <p><a href="https://www.angieslist.com/companylist/us/TX/Cibolo/Carranza-Restoration-LLC-reviews-9611706.htm" target="_blank" style="color: blue;">Angi Review</a></p>
    </div>
  </div>
`;


const emailHtml = juice(`${emailStyles} ${emailHtmlContent}`);

// Email options for /send-email, including CC and structuring the HTML body
const mailOptions = {
  from: process.env.EMAIL,
  to: process.env.RECEIVER_EMAIL, // The recipient's email address
  cc: `${email}`, // CC to the sender
  subject: subject,
  html: emailHtml,
};

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully. Thank you for contacting us!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email. Please try again later.' });
  }
});

// Function to format phone number
function formatPhoneNumber(phoneNumber) {
  // Remove all non-digit characters from the phone number
  const digits = phoneNumber.replace(/\D/g, '');
  // Check if the phone number has 10 digits as expected for US numbers
  if (digits.length === 10) {
    // Reformat to (xxx) xxx-xxxx
    return `(${digits.substr(0,3)}) ${digits.substr(3,3)}-${digits.substr(6)}`;
  } else {
    // If not 10 digits, return the original input
    return phoneNumber;
  }
}

// This is the correct and only needed /send-quote handler
app.post('/send-quote', async (req, res) => {
  const {
    name,
    email,
    date,
    time,
    message,
    address,
    phoneNumber,
    projectType,
    insuranceClaim,
    insuranceCompany,
    claimNumber,
    country, // New field
    state,   // New field
    city     // New field
  } = req.body;

    // Assuming fullAddress is a string like "5915 Oak Country Way, San Antonio, TX, USA"
    const fullAddress = req.body.address;

    // Use a regex pattern to extract address components
    // This pattern assumes that the address is always in the format "Address, City, State, Country"
    // Note: This might not be robust for all address formats, especially international ones.
    const addressRegex = /^(.*),\s*(.*),\s*(.*),\s*(.*)$/;
    const addressMatch = fullAddress.match(addressRegex);
  
    let extractedAddress = {};
    if (addressMatch) {
      extractedAddress = {
        address: addressMatch[1].trim(),
        city: addressMatch[2].trim(),
        state: addressMatch[3].trim(),
        country: addressMatch[4].trim(),
      };
    } else {
      // Handle case where address doesn't match the expected format
      console.error('Address format is not as expected:', fullAddress);
      // Send back a response or handle accordingly
    }

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let formattedDate = "Invalid date";
  let formattedTime = "Invalid time";
  
// Conditional logic to append insurance company information if it exists
let insuranceCompanyHtml = insuranceCompany
  ? `<p><strong style="color: black;">Insurance Company:</strong> <span style="color: black;">${insuranceCompany}</span></p>`
  : '';

// Conditional logic to append claim number information if it exists
let claimNumberHtml = claimNumber
  ? `<p><strong style="color: black;">Claim Number:</strong> <span style="color: black;">${claimNumber}</span></p>`
  : '';
  
  // Validate and format date and time
  if (date && !isNaN(new Date(date).getTime())) {
    const dateObj = new Date(date);
    formattedDate = new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', month: 'long', day: '2-digit' 
    }).format(dateObj);
  }
  
  if (time && !isNaN(new Date(time).getTime())) {
    const timeObj = new Date(time);
    formattedTime = new Intl.DateTimeFormat('en-US', { 
      hour: '2-digit', minute: '2-digit', hour12: true 
    }).format(timeObj);
  }

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  // Constructing the email body with new fields
  const emailBody = `  
  <div>
    <h1 style="color: black;">Inspection/Estimate Request</h1>
    <p><strong style="color: black;">Name:</strong> <span style="color: black;">${name}</span></p>
    <p><strong style="color: black;">Email:</strong> ${email}</p>
    <p><strong style="color: black;">Callback Phone Number:</strong> <a href="tel:${formattedPhoneNumber}" style="color: #15c;">${formattedPhoneNumber}</a></p>
    <p><strong style="color: black;">Date:</strong> <span style="color: black;">${formattedDate}</span></p>
    <p><strong style="color: black;">Time:</strong> <span style="color: black;">${formattedTime}</span></p>
    <p><strong style="color: black;">Address:</strong> <span style="color: black;">${extractedAddress.address}</span></p>
    <p><strong style="color: black;">City:</strong> <span style="color: black;">${extractedAddress.city}</span></p>
    <p><strong style="color: black;">State:</strong> <span style="color: black;">${extractedAddress.state}</span></p>
    <p><strong style="color: black;">Country:</strong> <span style="color: black;">${extractedAddress.country}</span></p>
    <p><strong style="color: black;">Project Type:</strong> <span style="color: black;">${projectType}</span></p>
    <p><strong>Insurance Claim:</strong> <span style="color: black;">${insuranceClaim}</span></p>
    ${insuranceCompanyHtml}
    ${claimNumberHtml} 
    <hr>
    <p><strong style="color: black;">Message:</strong> <span style="color: black;">${message}</span></p>
    <hr>
    <div style="margin-top: 30px;">
      <a href="http://www.carranzarestoration.org" target="_blank" style="color: blue;">
        <img src="https://storage.googleapis.com/new13/CarranzaLLCLogo1.png" alt="Carranza Restoration LLC Logo" style="max-width: 200px;">
      </a>
      <div style="margin-top: 10px;">
        <p style="margin: 0; font-weight: bold; color: black;">Carranza Restoration LLC; FWR General Contractors</p>
        <a href="https://maps.google.com/?q=100+Commercial+Place+Schertz+TX+78154" target="_blank" style="color: blue;">
          <p style="margin: 5px 0;">100 Commercial Place</p>
          <p style="margin: 0;">Schertz, TX 78154</p>
        </a>
        <p style="margin: 5px 0; color: black;">
          <a href="tel:+12102671008" style="color: blue;"> (210) 267-1008</a> <span style="color: black;">Office</span>
        </p>
        <p style="margin: 0;">
          <a href="tel:+12104285610" style="color: blue;"> (210) 428-5610</a> <span style="color: black;">Cell</span>
        </p>
      </div>      
      <p><a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank" style="color: blue;">Google Review</a></p>
      <p><a href="http://www.carranzarestoration.org" target="_blank" style="color: blue;">Carranza Restoration LLC Website</a></p>
      <p><a href="https://www.angieslist.com/companylist/us/TX/Cibolo/Carranza-Restoration-LLC-reviews-9611706.htm" target="_blank" style="color: blue;">Angi Review</a></p>
    </div>
  </div>`;


// Email options for /send-email, including CC and using HTML for body
const mailOptions = {
  from: process.env.EMAIL, // This should likely be your EMAIL variable or a specific sender email
  to: process.env.RECEIVER_EMAIL,
  cc: `${email}, ${process.env.COMPANY_EMAIL}`,
  subject: `Inspection/Estimate Request from ${name}`,
  html: emailBody, // Use html key instead of text
};

  // Attempt to send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Quote request sent successfully' });
  } catch (error) {
    console.error('Error sending quote request email:', error);
    res.status(500).json({ success: false, message: 'Error sending quote request', error: error.message });
  }
});

const subscribers = [];

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
  }
  if (subscribers.includes(email)) {
      return res.status(409).json({ message: 'Email already subscribed' });
  }
  subscribers.push(email);

  // Send confirmation email
  try {
      await sendConfirmationEmail(email);
      res.status(200).json({ message: 'Thank you for subscribing! A confirmation email has been sent.' });
  } catch (error) {
      console.error('Error sending confirmation email:', error);
      res.status(500).json({ message: 'Subscribed successfully, but failed to send confirmation email.' });
  }
});

async function sendConfirmationEmail(userEmail) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.EMAIL_PASSWORD,
      },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER_EMAIL,
    cc: `${email}, ${process.env.COMPANY_EMAIL}`,
    subject: subject,
    text: `Message from ${name} (${email}): ${message}`,
  };
  await transporter.sendMail(mailOptions);
}


function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
