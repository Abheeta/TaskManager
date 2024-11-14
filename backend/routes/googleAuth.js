/**
 * Routes
 */

// Test Route
const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get("/", (req, res) => {
    console.log('SESSION', req.session);
    console.log('sessionID', req.sessionID);
    console.log('USERRRRRRRRRRRRRRRRRR', req.user);
});

// Authentication Failed Route
router.get("/failed", (req, res) => {
    res.send("Failed");
});

// Authentication Success Route
router.get("/success", (req, res) => {
    res.redirect(`Welcome ${req.user.email}`);
});

/**
 * Google OAuth Routes
 */

// Initiates Google OAuth flow
router.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile'],
        keepSessionInfo: true
    })
);

// Google OAuth callback handler
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
        keepSessionInfo: true
    }),
    function(req, res) {
        console.log(req.user + " HERE'S THE AUTHENTICATED USER");
        res.redirect(`${process.env.LOCAL_FRONTEND}/board`);
    }
);

/**
 * Account Management Routes
 */

// Get user account information
router.get("/account", (req, res) => {
    console.log(req.user + "ACCOUNT ROUTE");
    if (req.user) {
        const user = {
            ...req.user,
            loggedIn: true,
        };
        res.json(user);
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout route
router.get('/logout', function(req, res) {
    console.log("logout");
    req.logout((err) => {
        if (err) {
            res.json({ message: err });
        } else {
            const user = {
                ...req.user,
                loggedIn: false,
            };
            res.json(user);
        }
    });
});

module.exports = router;