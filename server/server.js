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
const User = require('./models/User'); 
const { expressjwt: expressJwt } = require('express-jwt');
const schedule = require('node-schedule'); 
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); 
const { google } = require('googleapis');
const keys = require('./config/fast-gate-418608-db386b788691.json'); 
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
  if (err) return;
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
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(301, `https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

app.use(helmet.hsts({ maxAge: 15552000 }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).catch(err => console.error('DB Error:', err));

const generateEmailTemplate = (title, badge, contentHtml) => {
  const emailStyles = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; color: #333; }
      .wrapper { width: 100%; padding: 40px 0; background-color: #f9fafb; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
      .header { background: #040F28; padding: 40px; text-align: center; }
      .header img { height: 50px; margin-bottom: 10px; }
      .header h2 { color: #ffffff; font-size: 20px; font-weight: 800; margin: 0; letter-spacing: 1px; text-transform: uppercase; }
      .header h2 span { color: #FD5D14; }
      .body { padding: 40px; }
      .badge { display: inline-block; background: rgba(253, 93, 20, 0.1); color: #FD5D14; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 16px; border-radius: 50px; margin-bottom: 20px; }
      .title { font-size: 28px; font-weight: 800; color: #040F28; margin: 0 0 10px; }
      .divider { height: 3px; background: linear-gradient(to right, #FD5D14, transparent); margin: 30px 0; border: none; }
      .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .info-table td { padding: 12px 0; vertical-align: top; border-bottom: 1px solid #f0f0f0; }
      .label { width: 140px; font-weight: 700; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
      .value { color: #040F28; font-size: 15px; font-weight: 500; }
      .message-box { background: #f8f9fa; border-radius: 12px; padding: 25px; margin-top: 30px; border-left: 4px solid #FD5D14; }
      .message-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #999; margin-bottom: 10px; }
      .message-text { font-size: 15px; line-height: 1.7; color: #333; margin: 0; }
      .footer { background: #040F28; padding: 40px; text-align: center; }
      .footer-text { color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.6; margin-bottom: 20px; }
      .footer-links a { color: #FD5D14; font-size: 12px; font-weight: 700; text-decoration: none; text-transform: uppercase; margin: 0 12px; }
      .copyright { color: rgba(255,255,255,0.3); font-size: 11px; margin-top: 30px; }
    </style>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>${emailStyles}</head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <img src="https://lh3.googleusercontent.com/a-/ALV-UjUz45V8tmU6Ujkn_nPy5Ac16du4Bo7XJRvLYbpXU4jSG1io5ic=s80-p" alt="Carranza Restoration">
            <h2>Carranza <span>Restoration</span> LLC</h2>
          </div>
          <div class="body">
            <span class="badge">${badge}</span>
            <h1 class="title">${title}</h1>
            <div class="divider"></div>
            ${contentHtml}
          </div>
          <div class="footer">
            <div class="footer-text">
              <strong>Carranza Restoration LLC &bull; FWR General Contractors</strong><br>
              100 Commercial Place, Schertz, TX 78154<br>
              <a href="tel:+12102671008" style="color: #fff; text-decoration: none;">(210) 267-1008</a> Office &bull; 
              <a href="tel:+12104285610" style="color: #fff; text-decoration: none;">(210) 428-5610</a> Cell
            </div>
            <div class="footer-links">
              <a href="https://carranzarestoration.com">Website</a>
              <a href="https://g.page/r/CZUXLaHzvDKhEB0/review">Google Review</a>
              <a href="https://www.angieslist.com/companylist/us/TX/Cibolo/Carranza-Restoration-LLC-reviews-9611706.htm">Angi Review</a>
            </div>
            <div class="copyright">&copy; 2026 Carranza Restoration LLC. All rights reserved.</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  return juice(html);
};

function formatPhoneNumber(phoneNumber) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
  return phoneNumber;
}

app.post('/send-email', async (req, res) => {
  const { name, email, subject, message, captchaToken } = req.body;
  if (!captchaToken) return res.status(400).json({ success: false, message: 'reCAPTCHA missing' });

  try {
    const v = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`);
    if (!v.data.success) return res.status(400).json({ success: false, message: 'reCAPTCHA failed' });

    const contentHtml = `
      <table class="info-table">
        <tr><td class="label">Name</td><td class="value">${name}</td></tr>
        <tr><td class="label">Email</td><td class="value">${email}</td></tr>
        <tr><td class="label">Subject</td><td class="value">${subject}</td></tr>
      </table>
      <div class="message-box"><div class="message-title">Message</div><div class="message-text">${message}</div></div>
    `;
    const emailHtml = generateEmailTemplate('New Contact Message', 'General Inquiry', contentHtml);
    await transporter.sendMail({ from: process.env.EMAIL, to: process.env.RECEIVER_EMAIL, cc: `${email}`, subject: `Contact: ${subject}`, html: emailHtml });
    res.status(200).json({ success: true, message: 'Sent!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

app.post('/send-quote', async (req, res) => {
  const { name, email, date, message, address, phoneNumber, projectType, insuranceClaim, captchaToken } = req.body;
  if (!captchaToken) return res.status(400).json({ success: false, message: 'reCAPTCHA missing' });

  try {
    const v = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`);
    if (!v.data.success) return res.status(400).json({ success: false, message: 'reCAPTCHA failed' });

    const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const contentHtml = `
      <table class="info-table">
        <tr><td class="label">Name</td><td class="value">${name}</td></tr>
        <tr><td class="label">Email</td><td class="value">${email}</td></tr>
        <tr><td class="label">Phone</td><td class="value">${formatPhoneNumber(phoneNumber)}</td></tr>
        <tr><td class="label">Date</td><td class="value">${formattedDate}</td></tr>
        <tr><td class="label">Address</td><td class="value">${address}</td></tr>
        <tr><td class="label">Project</td><td class="value">${projectType}</td></tr>
        <tr><td class="label">Insurance</td><td class="value">${insuranceClaim}</td></tr>
      </table>
      <div class="message-box"><div class="message-title">Additional Notes</div><div class="message-text">${message || 'None'}</div></div>
    `;
    const emailHtml = generateEmailTemplate('New Estimate Request', 'Inspection Request', contentHtml);
    await transporter.sendMail({ from: process.env.EMAIL, to: process.env.RECEIVER_EMAIL, cc: `${email}, ${process.env.COMPANY_EMAIL}`, subject: `Inspection Request: ${name}`, html: emailHtml });
    res.status(200).json({ success: true, message: 'Sent!' });
    handleContactAndFileOperations(req, { headersSent: true }).catch(e => console.error("BG Error:", e));
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: 'Error' });
  }
});

// Admin Registration
app.post('/api/admin/register', async (req, res) => {
  const { email, password, username } = req.body;

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
  
      const { v4: uuidv4 } = require('uuid');

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

let googleCloudKey;
let googleCloudKeyRaw = process.env.Google_Cloud_Key;
if (googleCloudKeyRaw) {
  if (googleCloudKeyRaw.startsWith("'") && googleCloudKeyRaw.endsWith("'")) googleCloudKeyRaw = googleCloudKeyRaw.slice(1, -1);
  try {
    googleCloudKey = JSON.parse(googleCloudKeyRaw);
    if (googleCloudKey.private_key) googleCloudKey.private_key = googleCloudKey.private_key.replace(/\\n/g, '\n');
  } catch (e) { console.error("Key Error:", e); }
}

if (!googleCloudKey) {
  googleCloudKey = {
    type: process.env.GOOGLE_CLOUD_TYPE,
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY ? process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
    auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
    token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL
  };
}

const storage = new Storage({ projectId: googleCloudKey.project_id || process.env.GOOGLE_CLOUD_PROJECT_ID, credentials: googleCloudKey });
const bucket = storage.bucket(process.env.BUCKET_NAME);

async function handleContactAndFileOperations(req, res) {
  try {
    const config = { headers: { 'Authorization': `Bearer ${process.env.JOBNIMBUS_TOKEN}`, 'Content-Type': 'application/json' } };
    const [firstName, lastName] = req.body.name.split(' ');
    const contactData = {
      type: "contact", first_name: firstName, last_name: lastName || '', email: req.body.email,
      home_phone: formatPhoneNumber(req.body.phoneNumber), address_line1: req.body.address,
      description: `Project: ${req.body.projectType}\nMessage: ${req.body.message}`,
      status_name: "Lead", source_name: "Website"
    };
    const contactResponse = await axios.post('https://app.jobnimbus.com/api1/contacts', contactData, config);
    if (contactResponse.status === 200) {
      const jnid = contactResponse.data.jnid;
      const values = [[`${firstName} ${lastName || ''}`, req.body.address, formatPhoneNumber(req.body.phoneNumber), '', '', "Website", `https://app.jobnimbus.com/contact/${jnid}`]];
      await googleSheets.spreadsheets.values.append({ spreadsheetId: '1CtMYyWrFbLJJuPdV_2hcKHgbdDFWR5rkaAZpRvwWeds', range: '2024 Referral List', valueInputOption: 'USER_ENTERED', resource: { values } });
    }
  } catch (error) { console.error('BG Operations Error:', error); }
}

app.get('*', (req, res) => { res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html')); });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { console.log(`Server on ${PORT}`); });
