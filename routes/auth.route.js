// load library express
const express = require('express');
// initiate object that instance of express
const app = express();
// load function authentication from auth's controller
const { authenticate } = require('../controllers/auth.controller');

// allow to read 'request' with josn type
app.use(express.json());

// create route for authentication
app.post('/', authenticate);

// export app in order to load in another file
module.exports = app