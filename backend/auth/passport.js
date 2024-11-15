/**
 * @file passportConfig.js
 * @description Passport.js configuration for Google OAuth2 authentication
 * @requires passport
 * @requires passport-google-oauth2
 * @requires dotenv
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const { UserModel } = require('../models/usermodel.js');
const crypto = require('crypto');

const mongoose = require('mongoose');
const { TaskListModel } = require('../models/tasklistmodel.js');
require('dotenv').config();

/**
 * Environment variables validation
 * @throws {Error} If required environment variables are missing
 */
const requiredEnvVars = [
  'GOOGLE_AUTH_CLIENT_ID',
  'GOOGLE_CREDENTIALS_SECRET',
  'BACKEND_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

/**
 * Serializes user data for the session
 * Stores only the user ID in the session
 * 
 * @param {Object} user - User object
 * @param {Function} done - Passport callback
 */
passport.serializeUser(async (user, done) => {
  console.log('serializing user', user);
  done(null, user.googleId?{email:user.email, googleId:user.googleId}:{email:user.email});
});

/**
 * Deserializes user data from the session
 * Retrieves complete user object using the stored ID
 * 
 * @param {string} id - User ID
 * @param {Function} done - Passport callback
 */
passport.deserializeUser(async (identifier, done) => {
  try {
    console.log(identifier, "LOCAL EMAIL USER");

    const user = await UserModel.findOne(
      identifier.googleId
        ? { email: identifier.email, googleId: identifier.googleId }
        : { email: identifier.email }
    )
    .select('_id email firstName lastName avatar')
    .lean()
    .exec();

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


// Log backend URL for debugging
console.log(`Backend URL: ${process.env.BACKEND_URL}`);

passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Use 'email' as the username field
  },
  async function verify(email, password, done) {
    try {
      const user = await UserModel.findOne({ email: email, googleId: { $exists: false } });
      console.log("/user", user);
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) {
          return done(err);
        }
        if (!crypto.timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword)) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
  
));


/**
 * Google OAuth2 Strategy Configuration
 * Handles user authentication and creation/update
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CREDENTIALS_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/google/callback`,
  passReqToCallback: true
}, 





/**
 * Google Strategy callback
 * Handles user verification and database operations
 * 
 * @async
 * @param {Object} request - Express request object
 * @param {string} accessToken - OAuth2 access token
 * @param {string} refreshToken - OAuth2 refresh token
 * @param {Object} profile - User profile from Google
 * @param {Function} done - Passport callback
 * @returns {Promise<void>}
 */
async function(request, accessToken, refreshToken, profile, done) {
  try {
    console.log("Processing Google OAuth Strategy");

    console.log(profile);
    
    // Extract primary email from profile
    const email = profile.emails[0].value;
   let user = await UserModel.findOne({ googleId: profile.id });

   if (!user) {
    // Create a new user
    user = new UserModel({
      googleId: profile.id,
      email: email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      avatar: profile.picture,
      lastUpdated: new Date()
    });
  
    try {
      // Save the new user
      await user.save();
      console.log('New user saved:', user);
    } catch (error) {
      console.error('Error saving the new user:', error);
      throw new Error('Failed to save the user');
    }
  
    // Create task lists associated with the new user ID
    const tasklists = [
      new TaskListModel({
        name: 'To Do',
        user: user._id,
        tasks: []
      }),
      new TaskListModel({
        name: 'In Progress',
        user: user._id,
        tasks: []
      }),
      new TaskListModel({
        name: 'Done',
        user: user._id,
        tasks: []
      }),
    ];
  
    try {
      console.log('Attempting to save task lists...');
      
      // Save each task list and confirm they are saved
      const savedTasklists = await Promise.all(tasklists.map(async tasklist => {
        try {
          const saved = await tasklist.save();
          console.log('Task list saved:', saved);
          return saved;
        } catch (error) {
          console.error('Error saving a task list:', error);
          throw new Error('Failed to save a task list');
        }
      }));
  
      // Update the user with the saved tasklist IDs
      user.tasklists = savedTasklists.map(list => list._id);
      await user.save();
      console.log('User updated with tasklists:', user);
  
    } catch (error) {
      console.error('Error saving the task lists:', error);
      throw new Error('Failed to save task lists');
    }
  
  } else {
    // Update existing user
    try {
      console.log('Updating existing user...');
      user = await UserModel.findOneAndUpdate(
        { googleId: profile.id },
        {
          $set: {
            email: email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            avatar: profile.picture,
            lastUpdated: new Date()
          }
        },
        {
          new: true // Returns the updated document
        }
      );
      console.log('User updated:', user);
    } catch (error) {
      console.error('Error updating the user:', error);
      throw new Error('Failed to update the user');
    }
  }
  
  console.log(`User ${user ? 'updated' : 'created'} successfully: ${profile.displayName}`);
  ;
    
    // Return user data for session
    return done(null, {
      firstName: profile.given_name,
      lastName: profile.family_name,
      googleId: profile.id,
      email: email
    });
    
  } catch (error) {
    console.error('Google Strategy Error:', error);
    return done(error);
  }
}));

/**
 * Error handling middleware for Passport
 */
passport.use('error', (error, req, res, next) => {
  console.error('Passport Error:', error);
  res.status(500).json({ error: 'Authentication failed' });
});

module.exports = passport;