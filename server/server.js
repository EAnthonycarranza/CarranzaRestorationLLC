const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { Storage } = require('@google-cloud/storage');
const juice = require('juice');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const axios = require('axios');
const mongoose = require('mongoose');
const Click = require('./models/Click');
const BlogPost = require('./models/BlogPost');
const Comment = require('./models/Comment');
const Contact = require('./models/Contact');
const { checkAuthentication, adminOnly, canEditComment } = require('./middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Adjust the path as necessary
const { expressjwt: expressJwt } = require('express-jwt');
const schedule = require('node-schedule'); 
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // Import your passport configuration
const { google } = require('googleapis');
const keys = require('./config/fast-gate-418608-db386b788691.json'); // path to your JSON key file
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID_1;
const { Client } = require('@googlemaps/google-maps-services-js');
const client = new OAuth2Client(CLIENT_ID);
const helmet = require('helmet');
const Template = require('./models/Templates');

const sheetsClient = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

sheetsClient.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Connected to Google Sheets API!');
  }
});

const googleSheets = google.sheets({ version: 'v4', auth: sheetsClient });

// Passport JWT Strategy Setup
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false); // User not found
    }
  } catch (error) {
    return done(error, false);
  }
}));


// Utility function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Use environment variable for your email
      pass: process.env.EMAIL_PASSWORD, // Use environment variable for your password
    },
  });

const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
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
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known'), {
  dotfiles: 'allow' // this is crucial for .well-known directory
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const corsOptions = {
  origin: '*',
  credentials: true,
};

  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
  
app.use(express.json());

function formatPhoneNumber(phoneNumber) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;  // return original if there's no match
}

const fetchAndAppendContacts = async () => {
  try {
    const response = await axios.get('https://app.jobnimbus.com/api1/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.JOBNIMBUS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data && Array.isArray(response.data.results)) {
      // First, sort the contacts by the date created in ascending order
      const sortedContacts = response.data.results.sort((a, b) => a.date_created - b.date_created);

      const contacts = sortedContacts.filter(contact => {
        const date = new Date(contact.date_created * 1000); // Convert Unix timestamp to JavaScript Date
        const year = date.getFullYear(); // Extract year from Date object
        console.log(`Checking contact: ${contact.display_name}, Year: ${year}`);
        return year === 2024;
      });

      console.log('Filtered contacts:', contacts);

      // Retrieve existing data from Google Sheets to check against duplicates
      const existingDataResponse = await googleSheets.spreadsheets.values.get({
        spreadsheetId: '1CtMYyWrFbLJJuPdV_2hcKHgbdDFWR5rkaAZpRvwWeds',
        range: '2024 Referral List'
      });

      const existingDisplayNames = existingDataResponse.data.values.map(row => row[0]);

      const newEntries = contacts.filter(contact => !existingDisplayNames.includes(contact.display_name))
        .map(contact => ([
          contact.display_name,
          `${contact.address_line1}, ${contact.city}, ${contact.state_text} ${contact.zip || ''}, USA`,
          formatPhoneNumber(contact.home_phone),
          '',
          '',
          contact.source_name,
          `https://app.jobnimbus.com/contact/${contact.jnid}`
        ]));

      console.log('New entries to append to Google Sheets:', newEntries);

      if (newEntries.length > 0) {
        const sheetsResponse = await googleSheets.spreadsheets.values.append({
          spreadsheetId: '1CtMYyWrFbLJJuPdV_2hcKHgbdDFWR5rkaAZpRvwWeds',
          range: '2024 Referral List',
          valueInputOption: 'USER_ENTERED',
          resource: { values: newEntries },
        });

        console.log('Response from Google Sheets API:', JSON.stringify(sheetsResponse, null, 2));
        console.log('Updated Google Sheet with new contacts.');
      } else {
        console.log('No new entries to append to Google Sheets.');
      }
    } else {
      console.error('Response data is not in expected format:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('Error during the contact fetching and updating process:', error);
  }
};

// Schedule to run at 8:00 AM every day
schedule.scheduleJob('0 8 * * *', fetchAndAppendContacts);

// Schedule to run at 5:00 PM every day
schedule.scheduleJob('0 17 * * *', fetchAndAppendContacts);

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

function formatPhoneNumberToUS(phoneNumber) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-digit characters
  if (cleaned.length === 10) {
      // Format numbers to standard US format
      return '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
  } else {
      // If the number doesn't match expected length, return it unformatted
      return phoneNumber;
  }
}
let latestJnid = ''; // Declare latestJnid variable

async function handleContactAndFileOperations(req, res) {
  try {
    // Prepare the data for creating a JobNimbus contact
    const jobData = {
      name: req.body.name,
      record_type_name: "contact",
      status_name: "Lead",
      sales_rep_name: "Anthony Carranza",
      lead_source: "Website",
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${process.env.JOBNIMBUS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    // Split the name into first and last names
    const [firstName, lastName] = req.body.name.split(' ');
    const addressComponents = req.body.address.split(',').map(component => component.trim());
    const stateMappings = { "TX": "Texas" };

    // Create the contact data
    const contactData = {
      type: "contact",
      first_name: firstName,
      last_name: lastName,
      email: req.body.email,
      home_phone: formatPhoneNumberToUS(req.body.phoneNumber),
      address_line1: addressComponents[0],
      city: addressComponents[1] || '',
      state_text: stateMappings[addressComponents[2]] || addressComponents[2],
      country_name: "United States",
      description: `Project Type: ${req.body.projectType}\nMessage: ${req.body.message}`,
      created_by_name: "Anthony Carranza",
      sales_rep_name: "Anthony Carranza",
      status_name: "Lead",
      source_name: "Website",
    };

    const contactResponse = await axios.post('https://app.jobnimbus.com/api1/contacts', contactData, config);

    if (contactResponse.status === 200) {
      console.log('Contact created successfully:', contactResponse.data);
      
      // Extract the jnid from the response data
      const jnid = contactResponse.data.jnid;
      latestJnid = jnid; // Assign jnid to latestJnid

      console.log('Extracted jnid:', jnid); // Logging the extracted jnid separately

      // Check if req.body.fileBuffer exists and is not empty before calling postFileToJobNimbus
      if (req.body.fileBuffer && req.body.fileBuffer.length > 0) {
        await postFileToJobNimbus(req.body.fileName, req.body.fileType, req.body.fileBuffer, latestJnid); // Pass latestJnid to postFileToJobNimbus
      } else {
        console.error('Error: fileBuffer is undefined or empty');
        if (!res.headersSent) {
          res.status(400).json({ success: false, message: 'File buffer is required and cannot be empty' });
        }
        return; // Early return if fileBuffer is invalid
      }

      // Prepare the data to be written to the Google Sheet
      const values = [
        [`${firstName} ${lastName}`, req.body.address, formatPhoneNumberToUS(req.body.phoneNumber), '', '', "Website (Anthony Carranza)", `https://app.jobnimbus.com/contact/${jnid}`]
      ];

      // Write data to Google Sheet
      await googleSheets.spreadsheets.values.append({
        spreadsheetId: '1CtMYyWrFbLJJuPdV_2hcKHgbdDFWR5rkaAZpRvwWeds',
        range: '2024 Referral List', // Adjust if your worksheet's name is different
        valueInputOption: 'USER_ENTERED',
        resource: { values: values },
      });

      if (!res.headersSent) {
        res.status(200).json({ success: true, message: 'Contact creation and data logging successful', jnid: jnid });
      }
    } else {
      throw new Error(`Failed to create contact: ${contactResponse.statusText}`);
    }
  } catch (error) {
    console.error('Error during the contact creation process:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
  }
}

const postFileToJobNimbus = async (fileName, fileType, fileBuffer, latestJnid) => {
  if (!fileBuffer || fileBuffer.length === 0) {
    console.error('Error: fileBuffer is undefined or empty');
    return; // Return early if fileBuffer is undefined or empty
  }

  console.log('fileBuffer length:', fileBuffer.length); // Log the length of the buffer

  const fileContentBase64 = fileBuffer.toString('base64');
  const currentDateTimestamp = Math.floor(Date.now() / 1000);

  try {
    const postData = {
      data: fileContentBase64,
      is_private: false,
      related: [latestJnid], // Using latestJnid for file association
      type: determineType(fileType),  // Ensure fileType is used
      subtype: "contact",
      filename: fileName,
      description: "Uploaded image file from website",
      date: currentDateTimestamp,
      persist: true
    };

    const response = await axios.post('https://app.jobnimbus.com/api1/files', postData, {
      headers: {
        'Authorization': `Bearer ${process.env.JOB_NIMBUS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`File posted to JobNimbus successfully, response: ${JSON.stringify(response.data)}`);
    console.log('Posting data:', JSON.stringify(postData.related));  // Logging the 'related' part to ensure correct JNID is being used
    return response.data;
  } catch (error) {
    console.error(`Error posting file to JobNimbus: ${error}`);
    throw error;
  }
};



app.post('/send-quote', async (req, res) => {
  try {
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
      postalCode,
      phoneNumber,
      projectType,
      insuranceClaim,
      insuranceCompany,
      claimNumber,
      fileBuffer,
      fileName,
      fileType,
    } = req.body;

const fullAddress = req.body.address;

// Adjust the regex to capture the individual components correctly
const addressRegex = /^(.*),\s*(.*),\s*(.*),\s*(.*)$/;
const addressMatch = fullAddress.match(addressRegex);

let extractedAddress = {};
if (addressMatch && addressMatch.length === 5) {
  // Split the first group into address and city
  const addressCity = addressMatch[1].trim().split(', ');
  const address = addressCity[0].trim();
  const city = addressCity[1].trim();

  extractedAddress = {
    address: address, // Street address
    city: city, // City
    state: addressMatch[2].trim(), // State
    country: addressMatch[3].trim(), // Country is expected to be the fourth group
    postalCode: postalCode // Postal code from a separate variable
  };
} else {
  console.error('Address format is not as expected:', fullAddress);
}

console.log('Extracted Address:', extractedAddress);


console.log('Extracted Address:', extractedAddress);


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    function formatDateForEmail(isoDateString) {
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return utcDate.toLocaleDateString('en-US', options);
    }

    function formatTimeForEmail(isoTimeString) {
      const time = new Date(isoTimeString);
      if (isNaN(time.getTime())) {
        return "Invalid time";
      }
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Chicago'
      };
      return time.toLocaleTimeString('en-US', options);
    }

    let formattedDate = formatDateForEmail(req.body.date);
    let formattedTime = formatTimeForEmail(req.body.time);

    let insuranceCompanyHtml = insuranceCompany
      ? `<p><strong style="color: black;">Insurance Company:</strong> <span style="color: black;">${insuranceCompany}</span></p>`
      : '';

    let claimNumberHtml = claimNumber
      ? `<p><strong style="color: black;">Claim Number:</strong> <span style="color: black;">${claimNumber}</span></p>`
      : '';

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    console.log('Extracted Address:', extractedAddress); 
    console.log('Postal Code:', postalCode);

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
        <p><strong style="color: black;">Postal Code:</strong> <span style="color: black;">${postalCode}</span></p>
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

    let eventDateTime = new Date(time);
    let eventEnd = new Date(eventDateTime.getTime() + 60 * 60 * 1000);
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

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Quote request sent successfully' });
  } catch (error) {
    console.error('Error sending quote request email:', error);
    res.status(500).json({ success: false, message: 'Error sending quote request', error: error.message });
  }

  try {
    await handleContactAndFileOperations(req, res);
  } catch (error) {
    console.error('Error handling operations:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
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

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return payload;
}

// Admin Registration
app.post('/api/admin/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword, // Store the hashed password in the database
      role: 'admin' // Assuming all registered users are admins
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'An error occurred during registration' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('User not found.');
      return res.status(401).send('Login failed: User not found.');
    }

    // Ensure user has admin role
    if (user.role !== 'admin') {
      console.log('Access denied: Admin only area.');
      return res.status(403).send('Access denied: Admin only area.');
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Login failed: Incorrect password.');
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined.');
      return res.status(500).send('Internal server error.');
    }

    // Generate JWT token with userId included in the payload
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
});


// User Login
app.post('/api/user/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('User not found.');
      return res.status(401).send('Login failed: User not found.');
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send('Login failed: Incorrect password.');
    }

    // Generate JWT token with user-specific payload
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // You might adjust the expiry time based on your use case
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
});


// Middleware to validate token and extract user information
const checkToken = expressJwt({
  secret: process.env.JWT_SECRET, // The secret key for JWT
  algorithms: ['HS256'], // Algorithm to decode the JWT
});

app.get('/api/validateToken', checkToken, (req, res) => {
  // If token is valid, expressJwt middleware will attach user info to req.user
  // We can just return a simple message or any user details necessary
  res.status(200).send({
    isValid: true,
    user: req.user
  });
});

// Error handler for token validation errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // Catch expressJwt errors
    res.status(401).send('Invalid token');
  } else {
    next(err);
  }
});


app.post('/api/blogposts/:id/comments', checkAuthentication, async (req, res) => {

  if (!req.user) {
    console.error('User object is missing in request.');
    return res.status(401).json({ error: 'Authentication failed. User is not logged in.' });
  }

  if (!req.user.username) {
    console.error('User object does not have required properties.');
    return res.status(400).json({ error: 'User information not available' });
  }

  const postId = req.params.id;

  try {
    const newComment = new Comment({
      username: req.user.username,
      userProfilePic: req.user.googleProfilePic, // Make sure this exists in your User model
      googleId: req.user.googleId,  // Ensure you are saving the googleId here
      userId: req.user.userId, // Corrected from user._id to req.user.userId
      comment: req.body.comment,
      date: Date.now(),
      postId: postId,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Failed to post comment', details: error.message });
  }
});



app.post('/api/blogposts', async (req, res) => {
  try {
    const { title, content, author, image, avatar } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    const newBlogPost = new BlogPost({
      title,
      content,
      author,
      image,
      avatar
    });

    await newBlogPost.save();
    res.status(201).json(newBlogPost);
  } catch (error) {
    console.error('Failed to create blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blogposts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await BlogPost.countDocuments();
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the blog posts.");
  }
});

// Fetching a blog post
app.get('/api/blogposts/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate('comments');
    if (!blogPost) {
      return res.status(404).send('Blog post not found');
    }
    res.status(200).json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the blog post');
  }
});

// DELETE a blog post by ID
app.delete('/api/blogposts/:id', checkAuthentication, adminOnly, async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).send('Blog post not found');
    }
    res.status(200).send('Blog post deleted successfully');
  } catch (error) {
    res.status(500).send('An error occurred while deleting the blog post');
  }
});

// UPDATE a blog post by ID
app.put('/api/blogposts/:id', checkAuthentication, adminOnly, async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) {
      return res.status(404).send('Blog post not found');
    }
    res.status(200).send(updatedPost);
  } catch (error) {
    res.status(500).send('An error occurred while updating the blog post');
  }
});


// User Registration
app.post('/api/users/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
      // Check if the email or username already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user with the role set to "user"
      const newUser = new User({
        userId: uuidv4(), // Generate a new UUID
          email,
          password: hashedPassword,
          username,
          role: 'user'
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Respond with a success message
      return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'An error occurred during registration' });
  }  
});

app.get('/api/blogposts/:id/comments', async (req, res) => {
  try {
    // Fetch comments for the postId and include all fields
    const comments = await Comment.find({ postId: req.params.id });
    if (!comments) {
      return res.status(404).send('Comments not found');
    }
    res.status(200).send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(function(err) {
      if(err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error logging out');
      } else {
        // Send a response with the logout message
        console.log('Successfully logged out');
        res.status(200).send('Logged out');
      }
    });
  });
});

// Google auth route
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID_1,
    });

    const payload = ticket.getPayload();

    // Correct use of findOne to search by googleId
    let user = await User.findOne({ googleId: payload.sub }).exec(); // Use exec() for returning a true promise

    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        googleName: payload.name, // Ensure you're storing the Google name
        googleProfilePic: payload.picture, // Ensure you're storing the Google profile picture
        // Add any additional user info you wish to store
      });
      await user.save(); // Save the user if it doesn't exist
    }

    // Generate a JWT token for the user
    const jwtToken = jwt.sign(
      {
        userId: user._id, // MongoDB's _id of the user document
        username: user.username,
        googleId: user.googleId, // This is what's missing and you want to add
        email: user.email,
        googleName: user.googleName,
        googleProfilePic: user.googleProfilePic,
      },
    
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    
    res.json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

  
// Update a comment by ID
app.put('/api/comments/:id', checkAuthentication, canEditComment, async (req, res) => {
  try {
    const { id: commentId } = req.params;

    // Include the googleId field in the request body if available
    const commentUpdate = { ...req.body, googleId: req.user.googleId };

    const updatedComment = await Comment.findByIdAndUpdate(commentId, commentUpdate, { new: true });

    if (!updatedComment) {
      return res.status(404).send('Comment not found');
    }

    res.status(200).send(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/api/user-comments/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch comments by userId and populate post details
    const comments = await Comment.find({ userId })
                                  .populate({
                                    path: 'postId',  // Populate the post information
                                    select: 'title image'  // Select to only include title and image from the blog post
                                  });

    // Transform the data to include both post info and the actual comment text
    const commentsWithPostInfo = comments.map(comment => ({
      post: {
        title: comment.postId.title,  // Get title from the populated post data
        _id: comment.postId._id,      // Get post ID from the populated post data
        image: comment.postId.image   // Get image URL from the populated post data
      },
      commentText: comment.comment,    // Include the comment text
      date: comment.date,              // Include the date of the comment
      username: comment.username || 'Anonymous'  // Use the username stored in the comment or default to 'Anonymous'
    }));

    res.json(commentsWithPostInfo);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'An error occurred while fetching the comments', details: error.message });
  }
});

app.get('/api/user-comments/:googleId', async (req, res) => {
  const { googleId } = req.params;
  try {
    let comments;
    if (googleId) {
      // Fetch comments for Google users and ensure to populate both the user and the post
      comments = await Comment.find({ googleId })
                              .populate({
                                path: 'postId',  // Populate the post information
                                select: 'title image'  // Select to only include title and image from the blog post
                              })
                              .populate({
                                path: 'userId',  // Populate the user information
                                select: 'username'  // Select to only include username from the user
                              });
    } else {
      // Fetch all comments for non-Google users
      comments = await Comment.find({})
                              .populate({
                                path: 'postId',  // Populate the post information
                                select: 'title image'  // Select to only include title and image from the blog post
                              })
                              .populate({
                                path: 'userId',  // Populate the user information
                                select: 'username'  // Select to only include username from the user
                              });
    }

    // Transform the data to include both post info and the actual comment text
    const commentsWithPostInfo = comments.map(comment => ({
      post: {
        title: comment.postId.title,
        _id: comment.postId._id,
        image: comment.postId.image  // Ensure the image URL is included
      },
      commentText: comment.comment,
      date: comment.date,
      username: comment.userId ? comment.userId.username : 'Anonymous'  // Handle cases where user might be missing
    }));

    res.json(commentsWithPostInfo);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'An error occurred while fetching the comments', details: error.message });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    // Remove comment from blog post
    await BlogPost.findByIdAndUpdate(comment.postId, {
      $pull: { comments: comment._id }
    });

    res.status(200).send({ message: 'Comment deleted', comment });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// POST endpoint to track clicks on URLs
app.post('/api/track-click', async (req, res) => {
  const { url } = req.body;
  try {
      // Ensure the URL is valid or meets certain criteria if necessary
      const clickUpdate = await Click.findOneAndUpdate(
          { url }, 
          { $inc: { count: 1 } }, 
          { new: true, upsert: true }
      );
      console.log('Click tracked:', clickUpdate);
      res.sendStatus(200);  // Consider sending back some data if needed
  } catch (err) {
      console.error('Error tracking click:', err);
      res.status(500).send('Failed to track click');
  }
});

// GET endpoint to retrieve popular links based on click counts
app.get('/api/get-popular-links', async (req, res) => {
  try {
      const popularLinks = await Click.find({}).sort({ count: -1 });
      res.json(popularLinks.map(link => ({ url: link.url, clicks: link.count })));
  } catch (error) {
      console.error('Error fetching popular links:', error);
      res.status(500).send('Failed to fetch popular links');
  }
});

const CONTACTS_URL = 'https://app.jobnimbus.com/api1/contacts';

// Function to convert timestamp to 12-hour format with MM:DD:YY
const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

// Endpoint to fetch contacts
app.get('/contacts', async (req, res) => {
  console.log('Received query for contacts');

  try {
    // Fetch contacts from JobNimbus API
    const response = await axios.get(CONTACTS_URL, {
      headers: {
        Authorization: `Bearer ${process.env.JOBNIMBUS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // Log the response data for inspection
    console.log('Response data:', response.data);

    // Extract contacts from the response data and filter by year 2024
    const filteredData = response.data.results
      .filter(contact => {
        const date = new Date(contact.date_created * 1000);
        return date.getFullYear() === 2024;
      })
      .map(contact => ({
        jnid: contact.jnid,
        date_created: contact.date_created,
        source_name: contact.source_name,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.home_phone
      }));

    // Log the filtered contacts data
    console.log('Filtered contacts data:', filteredData);

    // Send the filtered contacts data as a response
    res.json(filteredData);
  } catch (error) {
    // Handle errors
    console.error('Error fetching contacts from JobNimbus:', error);
    res.status(500).json({
      message: 'Error fetching contacts from JobNimbus',
      details: error.message
    });
  }
});

const googleCloudKey = {
  type: process.env.GOOGLE_CLOUD_TYPE,
  project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
  private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
  auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
  token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL
};

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: googleCloudKey
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

// Queue for batching file uploads
const fileQueue = [];
const UPLOAD_WAIT_TIME_MS = 5000; // 5 seconds

// Function to send batch email
const sendBatchEmail = async () => {
  const queuedFiles = [...fileQueue];
  fileQueue.length = 0; // Clear the queue

  const attachments = await Promise.all(
    queuedFiles.map(async (file) => {
      const [buffer] = await bucket.file(file.fileName).download();
      return {
        filename: file.fileName,
        content: buffer
      };
    })
  );

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER_EMAIL,
    subject: "New Images Made Public",
    html: "<p>The following images have been made public:</p>" +
          "<ul>" + queuedFiles.map(f => `<li>${f.fileName}</li>`).join('') + "</ul>",
    attachments: attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Batch email sent successfully with attachments.');
  } catch (error) {
    console.error('Failed to send batch email:', error);
  }
};

// Function to queue a file for batch email
const queueFileForEmail = (fileName) => {
  fileQueue.push({ fileName });

  // If this is the first file in the queue, start a timer for batch processing
  if (fileQueue.length === 1) {
    setTimeout(sendBatchEmail, UPLOAD_WAIT_TIME_MS);
  }
};

function determineType(fileType) {
  const typeMapping = {
    'image/jpeg': 2,
    'image/png': 2,
    'application/pdf': 1,
    'text/plain': 1,
    'application/msword': 1,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 1
  };

  return typeMapping[fileType] || 1; // Default to type 1 if not found
}

// Endpoint to get signed URL for uploading
app.get('/api/sign-url', async (req, res) => {
  const { fileName, fileType } = req.query;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: 'Both fileName and fileType parameters are required.' });
  }

  try {
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 10 * 60 * 1000,
      contentType: fileType
    };
    const [url] = await bucket.file(fileName).getSignedUrl(options);
    res.json({ signedUrl: url, fileName });
  } catch (error) {
    console.error("Error getting signed URL:", error);
    res.status(500).json({ error: 'Failed to create signed URL.' });
  }
});



// Example of adjusting to include fileType (assuming you send it from the client)
app.post('/api/make-public', async (req, res, next) => {
  const { fileName, fileType, jnid } = req.body;  // Now expecting jnid as part of the request

  try {
    await bucket.file(fileName).makePublic();
    const [fileBuffer] = await bucket.file(fileName).download();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(fileName)}`;

    queueFileForEmail(fileName);
    await postFileToJobNimbus(fileName, fileType, fileBuffer, jnid);  // Using the jnid from the client

    res.json({ message: 'File made public successfully.', publicUrl });
  } catch (error) {
    console.error("Error in /api/make-public endpoint:", error);
    next(error);
  }
});




// Scheduled job to delete old files
cron.schedule('* * * * *', async () => {
  console.log('Running a task every minute to check for old files');
  try {
    const [files] = await bucket.getFiles();
    files.forEach(async (file) => {
      const fileAge = Date.now() - new Date(file.metadata.timeCreated).getTime();
      if (fileAge > 60000) { // 60 seconds
        await file.delete();
        console.log(`Deleted ${file.name} because it was older than 1 minute.`);
      }
    });
  } catch (error) {
    console.error('Error during cron job for deleting files:', error);
  }
});

// In-memory storage for templates
let templates = [

  {
    id: 1,
    text: "Hi {first_name}, I am {travelTime} away from your location at {address_line1}, {city}, {state_text}, {zip}.",
  },
];

function logErrorAndThrow(error, message) {
  console.error(message, error);
  throw new Error(message);
}

// Fetch customer info
async function getCustomerInfo(customerId) {
  try {
    const response = await axios.get(`https://app.jobnimbus.com/api1/contacts/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.JOBNIMBUS_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    logErrorAndThrow(error, `Could not fetch information for customer ID ${customerId}`);
  }
}

// Fetch all customers
async function fetchAllCustomers() {
  try {
    const response = await axios.get('https://app.jobnimbus.com/api1/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.JOBNIMBUS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    return [];
  } catch (error) {
    logErrorAndThrow(error, "Failed to fetch customers");
  }
}

// Endpoint for fetching all customers
app.get('/customers', async (req, res) => {
  try {
    const customers = await fetchAllCustomers();
    res.json({ customers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

// Endpoint to fetch all templates
app.get('/templates', async (req, res) => {
  try {
      const templates = await Template.find();
      const templatesWithIds = templates.map(template => ({
          id: template._id.toString(),
          text: template.text,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
      }));

      res.json({ templates: templatesWithIds });
  } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: error.message });
  }
});


// Endpoint to create a new template
app.post('/templates/create', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Template text is required." });
    }

    const newTemplate = new Template({ text });
    await newTemplate.save();

    res.json({ success: true, template: newTemplate });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to update a template
app.put('/templates/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const template = await Template.findByIdAndUpdate(id, { text }, { new: true });
    if (template) {
      res.json({ success: true, template });
    } else {
      res.status(404).json({ error: "Template not found." });
    }
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to delete a template
app.delete('/templates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Template.findByIdAndRemove(id);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Template not found." });
    }
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ error: error.message });
  }
});

// Calculate travel time
async function getTravelTime(origin, destination) {
  try {
    const client = new Client({});
    const response = await client.directions({
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const leg = response.data.routes[0].legs[0];
    return leg.duration.text;
  } catch (error) {
    logErrorAndThrow(error, "Failed to fetch travel time");
  }
}

// Endpoint for calculating travel time
app.post('/calculate', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: "Origin and destination are required." });
    }

    const travelTime = await getTravelTime(origin, destination);
    res.json({ travelTime });
  } catch (error) {
    console.error('Error calculating travel time:', error);
    res.status(500).json({ error: error.message });
  }
});

function formatPhoneNumber(phoneNumber) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}

function replacePlaceholders(template, customer, travelTime) {
  const formattedPhone = formatPhoneNumber(customer.home_phone);
  return template
    .replace("{first_name}", customer.first_name || "")
    .replace("{last_name}", customer.last_name || "")
    .replace("{address_line1}", customer.address_line1 || "")
    .replace("{city}", customer.city || "")
    .replace("{state_text}", customer.state_text || "")
    .replace("{zip}", customer.zip || "")
    .replace("{travelTime}", travelTime || "")
    .replace("{phone}", formattedPhone || "")
    .replace("{email}", customer.email || "")
    .replace("{review_link}", "https://g.page/r/CZUXLaHzvDKhEB0/review" || "")
    .replace("{company_website}", "https://www.carranzarestoration.org" || "");
}

// Endpoint to notify customer
app.post('/notify', async (req, res) => {
  try {
      const { customerId, travelTime, templateId } = req.body;

      if (!customerId || !travelTime || !templateId) {
          return res.status(400).json({ error: "Required fields are missing." });
      }

      const customer = await getCustomerInfo(customerId);
      const template = await Template.findById(templateId);

      if (!template) {
          return res.status(400).json({ error: "Template not found." });
      }

      const message = replacePlaceholders(template.text, customer, travelTime);
      console.log(`Sending SMS with message: ${message}`);

      await sendSMS("210 997 2900", message);

      res.json({ success: true, message: `Notified customer: ${customer.first_name} ${customer.last_name}` });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});


// Function to send an SMS
async function sendSMS(phoneNumber, message) {
  try {
    await axios.post(
      'https://rest.textmagic.com/api/v2/messages',
      {
        phones: phoneNumber,
        text: message,
      },
      {
        headers: {
          'X-TM-Username': process.env.TEXTMAGIC_USERNAME,
          'X-TM-Key': process.env.TEXTMAGIC_API_KEY,
        },
      }
    );
  } catch (error) {
    logErrorAndThrow(error, 'Failed to send SMS');
  }
}

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('*', (req, res) => {
  // Ensure you are pointing to the correct directory where your React app's build index.html resides
  res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
