const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.post('/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Use environment variable for your email
      pass: process.env.EMAIL_PASSWORD, // Use environment variable for your password
    },
  });

// Email options for /send-email, including CC and structuring the HTML body
const mailOptions = {
  from: process.env.EMAIL, // Use your email as the sender
  to: process.env.RECEIVER_EMAIL, // Primary recipient email address from environment variable
  cc: `${email}, ${process.env.COMPANY_EMAIL}`,
  subject: subject,
  html: `
    <div>
      <p><strong>From:</strong> ${name} (${email})</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <div style="margin-top: 20px;">
        <a href="http://www.carranzarestoration.org" target="_blank">
        <img src="https://storage.googleapis.com/new13/CarranzaLLCLogo1.png" alt="Carranza Restoration LLC Logo" style="max-width: 200px;">
        </a>
        <div style="margin-top: 10px;">
        <p style="margin: 0; font-weight: bold;">Carranza Restoration LLC; FWR General Contractors</p>
        <a href="https://maps.google.com/?q=100+Commercial+Place+Schertz+TX+78154" target="_blank" ">
          <p style="margin: 5px 0;">100 Commercial Place</p>
          <p style="margin: 0;">Schertz, TX 78154</p>
        </a>
        <p style="margin: 5px 0;">
          <a href="tel:+12102671008" ">(210) 267-1008</a> Office
        </p>
        <p style="margin: 0;">
          <a href="tel:+12104285610" ">(210) 428-5610</a> Cell
        </p>
      </div>      
        <p><a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank">Google Review</a></p>
        <p><a href="http://www.carranzarestoration.org" target="_blank">Carranza Restoration LLC Website</a></p>
        <p><a href="https://www.angieslist.com/companylist/us/TX/Cibolo/Carranza-Restoration-LLC-reviews-9611706.htm" target="_blank">Angli List Review</a></p>
      </div>
    </div>
  `, // Use HTML formatting
};


  // Send email
  try {
    await transporter.sendMail(mailOptions);
    // Success feedback
    res.status(200).json({ success: true, message: 'Email sent successfully. Thank you for contacting us!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email. Please try again later.' });
  }
});

// This is the correct and only needed /send-quote handler
app.post('/send-quote', async (req, res) => {
  const { name, email, date, time, message, address, phoneNumber, projectType, insuranceClaim, insuranceCompany, claimNumber } = req.body;

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

  // Constructing the email body with new fields
  const emailBody = `  
  <div>
  <h1>Inspection/Estimate Request</h1>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Date:</strong> ${formattedDate}</p>
  <p><strong>Time:</strong> ${formattedTime}</p>
  <p><strong>Address:</strong> ${address}</p>
  <p><strong>Callback Phone Number:</strong> ${phoneNumber}</p>
  <p><strong>Project Type:</strong> ${projectType}</p>
  <p><strong>Insurance Claim:</strong> ${insuranceClaim}</p>
  <p><strong>Insurance Company:</strong> ${insuranceCompany}</p>
  <p><strong>Claim Number:</strong> ${claimNumber}</p>
  <hr>
  <p><strong>Message:</strong> ${message}</p>
  <hr>
  <div style="margin-top: 30px;">
  <a href="http://www.carranzarestoration.org" target="_blank">
  <img src="https://storage.googleapis.com/new13/CarranzaLLCLogo1.png" alt="Carranza Restoration LLC Logo" style="max-width: 200px;">
  </a>
  <div style="margin-top: 10px;">
  <p style="margin: 0; font-weight: bold;">Carranza Restoration LLC; FWR General Contractors</p>
  <a href="https://maps.google.com/?q=100+Commercial+Place+Schertz+TX+78154" target="_blank" ">
    <p style="margin: 5px 0;">100 Commercial Place</p>
    <p style="margin: 0;">Schertz, TX 78154</p>
  </a>
  <p style="margin: 5px 0;">
    <a href="tel:+12102671008" ">(210) 267-1008</a> Office
  </p>
  <p style="margin: 0;">
    <a href="tel:+12104285610" ">(210) 428-5610</a> Cell
  </p>
</div>      
  <p><a href="https://g.page/r/CZUXLaHzvDKhEB0/review" target="_blank">Google Review</a></p>
  <p><a href="http://www.carranzarestoration.org" target="_blank">Carranza Restoration LLC Website</a></p>
  <p><a href="https://www.angieslist.com/companylist/us/TX/Cibolo/Carranza-Restoration-LLC-reviews-9611706.htm" target="_blank">Angli List Review</a></p>
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
