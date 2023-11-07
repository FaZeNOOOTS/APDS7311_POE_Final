require('dotenv').config();
const express = require('express');
const app = express();
const https = require('http');
const mongoose = require('mongoose');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const hsts = require('./middleware/hsts');
const cert = fs.readFileSync('Keys/certificate.pem');
const options = {
  server: { sslCA: cert }
};

mongoose
  .connect(process.env.connstring)
  .then(() => {
    console.log('Connected :=)');
  })
  .catch(() => {
    console.log('NOT connected :-(');
  }, options);

// Middleware
app.use(express.json());
app.use(hsts);
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: '*', // Replace with the actual origin of your frontend application
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you need to allow credentials (e.g., cookies), set this to true
  optionsSuccessStatus: 204, // An HTTP status code to respond with for preflight requests
};

app.use(cors(corsOptions)); // Use the CORS configuration here

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/fruits', require('./routes/fruit'));

module.exports = app;
