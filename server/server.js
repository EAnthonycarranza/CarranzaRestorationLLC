const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const juice = require('juice');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const axios = require('axios');
const helmet = require('helmet');


  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Use environment variable for your email
      pass: process.env.EMAIL_PASSWORD, // Use environment variable for your password
    },
  });

const app = express();

app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(301, `https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

app.use(helmet.hsts({
  maxAge: 15552000  // 180 days in seconds
}));

app.use(cors());
app.use(express.json());

// Serve sitemap.xml at the root URL
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, '../sitemap.xml'));
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
      <a href="http://www.carranzarestoration.org" target="_blank" style="color: #15c;">
        <img src="https://storage.googleapis.com/new13/CarranzaLLCLogo1.png" alt="Carranza Restoration LLC Logo" style="max-width: 200px;">
      </a>
      <div style="margin-top: 10px;">
        <p style="margin: 0; font-weight: bold; color: black;">Carranza Restoration LLC; FWR General Contractors</p>
        <a href="https://maps.google.com/?q=100+Commercial+Place+Schertz+TX+78154" target="_blank" style="color: #15c;">
          <p style="margin: 5px 0;">100 Commercial Place</p>
          <p style="margin: 0;">Schertz, TX 78154</p>
        </a>
        <p style="margin: 5px 0">
          <a href="tel:+12102671008" style="color: #15c;"> (210) 267-1008</a> <span style="color: black;">Office</span>
        </p>
        <p style="margin: 0;">
          <a href="tel:+12104285610" style="color: #15c;"> (210) 428-5610</a> <span style="color: black;">Cell</span>
        </p>
      </div>      
      <p><a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank" style="color: #15c;">Google Review</a></p>
      <p><a href="http://www.carranzarestoration.org" target="_blank" style="color: #15c;">Carranza Restoration LLC Website</a></p>
      <p><a href="https://www.angieslist.com/companylist/us/TX/Cibolo/Carranza-Restoration-LLC-reviews-9611706.htm" target="_blank" style="color: #15c;">Angi Review</a></p>
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

function createDateFromDateTimeCentralTime(date, time) {
  const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
  const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

  // Create a UTC date object
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  // Determine if Central Time is currently in daylight saving time
  const isCDT = isDaylightSavingTime(utcDate);

  // CST is UTC-6, CDT is UTC-5
  const offset = isCDT ? 5 : 6;

  // Subtract offset to get Central Time
  utcDate.setHours(utcDate.getHours() - offset);

  return utcDate;
}

function isDaylightSavingTime(date) {
  // Determine the second Sunday in March
  const march = new Date(Date.UTC(date.getUTCFullYear(), 2, 1));
  const secondSundayInMarch = new Date(Date.UTC(march.getUTCFullYear(), march.getUTCMonth(), 14 - (march.getUTCDay() || 7)));

  // Determine the first Sunday in November
  const november = new Date(Date.UTC(date.getUTCFullYear(), 10, 1));
  const firstSundayInNovember = new Date(Date.UTC(november.getUTCFullYear(), november.getUTCMonth(), 7 - (november.getUTCDay() || 7)));

  // CDT is in effect between the second Sunday in March and the first Sunday in November
  return date >= secondSundayInMarch && date < firstSundayInNovember;
}

const { v4: uuidv4 } = require('uuid'); // Import the function to generate UUID v4

function generateICSContent(eventStart, eventEnd, name, email, message, address, city, state, country) {
  // Use the formatDate function as previously defined
  const formatDate = (date) => {
    try {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const dtStamp = formatDate(new Date());
  const uid = uuidv4(); // Generate a unique identifier for the event
  const dtStart = formatDate(eventStart);
  const dtEnd = formatDate(eventEnd);
  
  // Ensure date formatting was successful
  if (!dtStart || !dtEnd) {
    console.error('Invalid start or end time');
    return ''; // Return an empty string or handle this error as appropriate for your application
  }

  const description = message.replace(/(\r\n|\n|\r)/gm, "\\n");

  // Construct the .ics content
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Carranza Restoration LLC//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Inspection/Estimate Request for ${name}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${address}, ${city}, ${state}, ${country}`,
    `ORGANIZER;CN="Carranza Restoration LLC":mailto:${email}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
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
    city,
    state,
    country,
    phoneNumber,
    projectType,
    insuranceClaim,
    insuranceCompany,
    claimNumber,
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

// Function to format the date for email display
function formatDateForEmail(isoDateString) {
  // Create a new Date object from the ISO string
  const date = new Date(isoDateString);

  // Check if the date is valid before proceeding
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Adjust date to UTC time zone
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  // Specify your desired options for toLocaleDateString
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Return the formatted date
  return utcDate.toLocaleDateString('en-US', options);
}

// Function to format the time for email display
function formatTimeForEmail(isoTimeString) {
  // Create a new Date object from the ISO string
  const time = new Date(isoTimeString);

  // Check if the time is valid before proceeding
  if (isNaN(time.getTime())) {
    return "Invalid time";
  }

  // Specify your desired options for toLocaleTimeString
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour time with AM/PM
    timeZone: 'America/Chicago' // Set the time zone to Central Time (CT)
  };

  // Return the formatted time
  return time.toLocaleTimeString('en-US', options);
}

// Use these functions when setting formattedDate and formattedTime:
let formattedDate = formatDateForEmail(req.body.date); // For date without time
let formattedTime = formatTimeForEmail(req.body.time); // For time without date
  
// Conditional logic to append insurance company information if it exists
let insuranceCompanyHtml = insuranceCompany
  ? `<p><strong style="color: black;">Insurance Company:</strong> <span style="color: black;">${insuranceCompany}</span></p>`
  : '';

// Conditional logic to append claim number information if it exists
let claimNumberHtml = claimNumber
  ? `<p><strong style="color: black;">Claim Number:</strong> <span style="color: black;">${claimNumber}</span></p>`
  : '';

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  // Constructing the email body with new fields
  const emailBody = `  
  <div>
    <h1 style="color: black;">Inspection/Estimate Request</h1>
    <p><strong style="color: black;">Name:</strong> <span style="color: black;">${name}</span></p>
    <p><strong style="color: black;">Email:</strong> <a href="mailto:${email}" style="color: #15c;">${email}</a></p>
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
      <a href="http://www.carranzarestoration.org" target="_blank" style="color: #15c;">
        <img src="https://storage.googleapis.com/new13/CarranzaLLCLogo1.png" alt="Carranza Restoration LLC Logo" style="max-width: 200px;">
      </a>
      <div style="margin-top: 10px;">
        <p style="margin: 0; font-weight: bold; color: black;">Carranza Restoration LLC; FWR General Contractors</p>
        <a href="https://maps.google.com/?q=100+Commercial+Place+Schertz+TX+78154" target="_blank" style="color: #15c;">
          <p style="margin: 5px 0;">100 Commercial Place</p>
          <p style="margin: 0;">Schertz, TX 78154</p>
        </a>
        <p style="margin: 5px 0; color: black;">
          <a href="tel:+12102671008" style="color: #15c;"> (210) 267-1008</a> <span style="color: black;">Office</span>
        </p>
        <p style="margin: 0;">
          <a href="tel:+12104285610" style="color: #15c;"> (210) 428-5610</a> <span style="color: black;">Cell</span>
        </p>
      </div>      
      <p><a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank" style="color: #15c;">Google Review</a></p>
      <p><a href="http://www.carranzarestoration.org" target="_blank" style="color: #15c;">Carranza Restoration LLC Website</a></p>
      <p><a href="https://www.angieslist.com/companylist/us/TX/Cibolo/Carranza-Restoration-LLC-reviews-9611706.htm" target="_blank" style="color: #15c;">Angi Review</a></p>
    </div>
  </div>`;

  
  try {
    // Correctly use startDateISO and startTimeISO to parse the date and time
    let eventDateTime = new Date(time); // 'time' already represents the full date-time in your structure

    // Example: Adding 2 hour for the eventEnd, adjust as necessary
    let eventEnd = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000);
  
    const icsContent = generateICSContent(eventDateTime, eventEnd, name, email, message, address, city, state, country);
    if (!icsContent) {
      throw new Error('Failed to generate ICS content');
    }
    const icsBuffer = Buffer.from(icsContent, 'utf-8');
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.RECEIVER_EMAIL,
      cc: `${email}, ${process.env.COMPANY_EMAIL}`,
      subject: `Inspection/Estimate Request from ${name}`,
      html: emailBody,
      attachments: [{
        filename: 'appointment.ics',
        content: icsBuffer,
        contentType: 'text/calendar;charset=utf-8',
      }],
    };
  

    // Attempt to send email
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
