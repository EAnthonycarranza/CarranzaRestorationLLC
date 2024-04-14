const passport = require('passport');
require('../config/passport'); // Ensuring passport is configured
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to where your User model is located.
const Comment = require('../models/Comment'); // Adjust the path as necessary.

const checkAuthentication = async (req, res, next) => {
  console.log("Checking authentication...");
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.error("No authorization token found in headers");
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = req.headers.authorization.split(' ')[1];
  console.log(`Token found: ${token}`);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Token decoded: ${JSON.stringify(decoded)}`);

    // Use async/await to handle the promise returned by findById
    const user = await User.findById(decoded.userId).exec();
    if (!user) {
      console.error("User not found with id:", decoded.userId);
      return res.status(401).json({ error: 'User not found' });
    }

    // Check for the presence of certain fields and prioritize them accordingly
    const authUser = {
      userId: user._id,  // Make sure this is correctly set
      username: user.username || user.googleName || user.email.split('@')[0], // If username or googleName is not available, use the email username part
      googleProfilePic: user.googleProfilePic || user.avatarUrl, // Prefer googleProfilePic, fallback to avatarUrl
      role: user.role || 'user', // If role is not available, default to 'user'
      email: user.email, // Always include email
      googleId: user.googleId, // Store the Google ID with the comment
    };

    console.log('User attached to request:', authUser);

    req.user = authUser;

    next(); // Proceed to next middleware or request handler
  } catch (error) {
    console.error("Error verifying token or finding user:", error);
    res.status(401).json({ error: 'Token verification failed or User not found' });
  }
};




const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Access denied: Admin only area.');
};

const canEditComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).send('Comment not found.');
    }

    if (req.user.role === 'admin' || comment.googleId === req.user.googleId) {
      return next();
    } else {
      return res.status(403).send('Access denied: Cannot edit this comment.');
    }
  } catch (error) {
    return res.status(500).send('Server error occurred.');
  }
};

module.exports = {
  checkAuthentication,
  adminOnly,
  canEditComment,
};
