const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');

// JWT Strategy Configuration
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
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


// Google OAuth 2.0 Strategy Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID_1,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET_1,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, cb) => {
  try {
    let user = await User.findOne({ googleId: profile.id }).exec();

    if (user) {
      // User already exists, pass the existing user to the callback
      cb(null, user);
    } else {
      // If not, create a new user in your DB with the additional fields
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        image: profile.photos[0]?.value,
        googleName: profile.displayName,  // Save the Google name
        googleProfilePic: profile.photos[0]?.value,  // Save the Google profile picture URL
      });
      await user.save();
      cb(null, user);
    }
  } catch (err) {
    console.error(err);
    cb(err, null);
  }
}));


passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    cb(err, user);
  }).exec();
});

module.exports = passport;
