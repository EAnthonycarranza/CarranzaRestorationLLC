const path = require('path');
const { google } = require('googleapis');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

// For Business Profile Performance API
const businessProfilePerformance = google.businessprofileperformance('v1');

// Or for My Business Business Information API
const myBusinessBusinessInformation = google.mybusinessbusinessinformation('v1');


const cors = require('cors');
app.use(cors());


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

console.log('Email:', process.env.EMAIL);
console.log('Password:', process.env.EMAIL_PASSWORD);

app.post('/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Use environment variable
      pass: process.env.EMAIL_PASSWORD, // Use environment variable
    },
  });

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL, // Use environment variable for receiver email
    subject: subject,
    text: `Message from ${name} (${email}): ${message}`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email', error: error.message });
  }
});

// Google OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3001/oauth2callback' // Your callback URL
);

// Redirect to Google's OAuth 2.0 server
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/business.manage'], // Adjust scope according to your needs
  });
  res.redirect(url);
});

// Handle the OAuth 2.0 server response
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // Store tokens in a secure way (e.g., in a database)
    res.redirect('/'); // Redirect back to your application
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});
const mybusinessbusinessinformation = google.mybusinessbusinessinformation('v1');

// Fetch reviews
app.get('/reviews', async (req, res) => {
  console.log("Fetching reviews...");
  try {
    console.log("Fetching reviews from Google API");
    const response = await mybusinessbusinessinformation.accounts.locations.reviews.list({
      parent: 'accounts/11979887974311245294/locations/11615554143509092245',
    });
    console.log("Reviews fetched:", response.data);
    res.json({ reviews: yourReviewsData });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: error.message });
  }
});



const subscribers = []; // This should be replaced with a database in a real application

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
          user: 'anthonycarranza123@gmail.com', // Your email
          pass: process.env.EMAIL_PASSWORD, // Your email password from .env
      },
  });

  const mailOptions = {
      from: 'anthonycarranza123@gmail.com',
      to: userEmail,
      subject: 'Subscription Confirmation',
      text: 'You are Subscribed!',
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
