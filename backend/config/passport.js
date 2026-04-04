const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth profile:', profile);
      
      // Check if user already exists with this Google ID
      let user = await User.findByGoogleId(profile.id);
      
      if (user) {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }
      
      // Check if user exists with same email
      user = await User.findByEmail(profile.emails[0].value);
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.authProvider = 'google';
        user.isEmailVerified = true; // Google emails are pre-verified
        user.lastLogin = new Date();
        
        // Update avatar if not set
        if (!user.avatar && profile.photos && profile.photos.length > 0) {
          user.avatar = profile.photos[0].value;
        }
        
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      const newUser = new User({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        authProvider: 'google',
        isEmailVerified: true, // Google emails are pre-verified
        lastLogin: new Date()
      });
      
      await newUser.save();
      console.log('New Google user created:', newUser._id);
      
      done(null, newUser);
    } catch (error) {
      console.error('Google OAuth error:', error);
      done(error, null);
    }
  }));
} else {
  console.log('⚠️ Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

// Microsoft OAuth Strategy
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "/api/auth/microsoft/callback",
    scope: ['user.read']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Microsoft OAuth profile:', profile);
      
      // Check if user already exists with this Microsoft ID
      let user = await User.findByMicrosoftId(profile.id);
      
      if (user) {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }
      
      // Check if user exists with same email
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : profile.userPrincipalName;
      user = await User.findByEmail(email);
      
      if (user) {
        // Link Microsoft account to existing user
        user.microsoftId = profile.id;
        user.authProvider = 'microsoft';
        user.isEmailVerified = true; // Microsoft emails are pre-verified
        user.lastLogin = new Date();
        
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      const newUser = new User({
        microsoftId: profile.id,
        firstName: profile.name.givenName || profile.displayName.split(' ')[0],
        lastName: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' '),
        email: email,
        authProvider: 'microsoft',
        isEmailVerified: true, // Microsoft emails are pre-verified
        lastLogin: new Date()
      });
      
      await newUser.save();
      console.log('New Microsoft user created:', newUser._id);
      
      done(null, newUser);
    } catch (error) {
      console.error('Microsoft OAuth error:', error);
      done(error, null);
    }
  }));
} else {
  console.log('⚠️ Microsoft OAuth not configured - missing MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET');
}

module.exports = passport;