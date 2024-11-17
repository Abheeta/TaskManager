/**
 * Express.js Server with Google OAuth2 Authentication
 * 
 * This server implements Google OAuth2 authentication using Passport.js and includes
 * session management with MongoDB storage. It provides endpoints for authentication,
 * user account management, and session handling.
 * 
 * Required Environment Variables:
 * - GOOGLE_CREDENTIALS_SECRET: Secret for session management
 * - MONGO_URL: MongoDB connection string
 * - LOCAL_FRONTEND: Frontend application URL
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('./auth/passport.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const apiErrorHandler = require('./middleware/apiErrorHandler.js');
const googleAuth = require("./routes/googleAuth.js");
const localAuth = require("./routes/localAuth.js");
const taskRoutes = require("./routes/taskRoutes.js");


require('dotenv').config();

const app = express();

// CORS Configuration
app.use(
    cors({
        origin: [
            'http://localhost:3006',
            'http://localhost:8000',
            'https://task-manager-pi-neon.vercel.app',
            'https://taskmanager-xchn.onrender.com'
        ],
        credentials: true,
    })
);

app.set('trust proxy', 1);

// CORS Headers Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `${process.env.LOCAL_FRONTEND}`);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Session Configuration
 * Uses MongoDB store for persistent session storage
 * Cookie configuration is set for development environment
 * For production: set secure: true and sameSite: 'none'
 */
app.use(session({
    secret: `${process.env.GOOGLE_CREDENTIALS_SECRET}SESSION_SECRET`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true, // Set to true in production with HTTPS
        sameSite: 'None', // Use 'None' in production with secure: true
        maxAge: 24 * 60 * 60 * 1000, // 24 hours,
        httpsOnly: true,
        httpOnly: false
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collectionName: 'sessions'
    })
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(googleAuth);
app.use("/local", localAuth);
app.use(taskRoutes);



/**
 * Database Connection
 */
const mongoConnectionString = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoConnectionString, {
            dbName: "template-mern-google-oauth2-passport",
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

app.use(apiErrorHandler);

// Start server after database connection
connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("listening for requests");
    });
});