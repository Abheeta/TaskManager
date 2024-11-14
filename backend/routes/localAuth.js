const express = require('express');
const crypto = require('crypto');
const passport = require('passport');
const {UserModel} = require('../models/usermodel.js'); // Adjust the path as needed
const HttpError = require('../utils/http.js');
const router = express.Router();

// Route to handle login
router.post('/login',
  (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return next(new HttpError.badRequest('Email is required'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new HttpError.badRequest('Please enter a valid email address'));
    }

    if (!password) {
      return next(new HttpError.badRequest('Password is required'));
    }

    next();
  },
  (req, res, next) => passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(HttpError.unauthorized(info.message)); // Handle incorrect login attempt
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      // Successful login response
      res.json({ redirectUrl: `${process.env.LOCAL_FRONTEND}/board` });
    });
  })(req, res, next)
  // passport.authenticate('local', {
  //   failureMessage: true,
  //   keepSessionInfo: true
  // }),
  // (req, res) => {
  //   // Send a JSON response with the redirect URL
  //   res.json({ redirectUrl: `${process.env.LOCAL_FRONTEND}/board` });
  // }
);





// Route to handle signup and auto-login
router.post('/signup', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName.trim()) {
      return next(new HttpError.badRequest('First name is required'));
    } else if (firstName.length < 2) {
      return next(new HttpError.badRequest('First name must be at least 2 characters'));
    }
    
    if (!lastName.trim()) {
      return next(new HttpError.badRequest('Last name is required'));
    } else if (lastName.length < 2) {
      return next(new HttpError.badRequest('Last name must be at least 2 characters'));
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return next(new HttpError.badRequest('Email is required'));
    } else if (!emailRegex.test(email)) {
      return next(new HttpError.badRequest('Please enter a valid email address'));
    }
    
    if (!password) {
      return next(new HttpError.badRequest('Password is required'));
    } else if (password.length < 8) {
      return next(new HttpError.badRequest('Password must be at least 8 characters'));
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return next(new HttpError.badRequest('Password must contain at least one uppercase letter, one lowercase letter, and one number'));
    }
    
    
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email: email, googleId: {$exists:false} });
    if (existingUser) {
      return next( new HttpError.badRequest('An account exists for this email') );
    }

    // Generate a salt and hash the password
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
      if (err) throw err;

      // Create a new user instance
      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword.toString('hex'), // Store hashed password
        salt
      });

      // Save the new user to the database
      await newUser.save();

      // Auto-login after signup
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        // Redirect or respond with success message
        res.json({ redirectUrl: `${process.env.LOCAL_FRONTEND}/board` });
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

