const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

const multer = require('multer');

const fs = require('fs');

// Check if the uploads directory exists, and create it if it doesn't
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

console.log('Email:', process.env.EMAIL);
console.log('Password:', process.env.EMAIL_PASSWORD);

app.post('/send-email', upload.array('images'), async (req, res) => {
  const { name, email, subject, message } = req.body;
  const files = req.files;

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Use environment variable
      pass: process.env.EMAIL_PASSWORD, // Use environment variable
    },
  });

  // Email options with attachment
  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL,
    subject: subject,
    text: `Message from ${name} (${email}): ${message}`,
    attachments: files.map(file => ({
      filename: file.originalname,
      path: path.join(uploadsDir, file.filename)
    }))    
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    // Email sent successfully, now delete the files
    files.forEach(file => {
      fs.unlink(path.join(uploadsDir, file.filename), err => {
        if (err) {
          console.error('Error deleting file:', file.filename, err);
        } else {
          console.log('File deleted:', file.filename);
        }
      });
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email', error: error.message });
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
