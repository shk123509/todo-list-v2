require('dotenv').config();
const connectToMongo = require('./db');
var cors = require('cors')
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const port = 5000;

connectToMongo();

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", require("./router/auth"));
app.use("/api/auth", require("./router/googleAuth"));
app.use("/api/preferences", require("./router/preferences"));
app.use("/api/bookmarks", require("./router/bookmarks"));
app.use("/api/contact", require("./router/contact"));
// News app API routes
app.use("/api/news", require("./router/news"));

app.listen(port, () => { 
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
