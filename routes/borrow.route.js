// load library express
const express = require('express');
// initiate object that instence of express
const app = express();
// load borrow's controller
const borrowController = require('../controllers/borrow.controller');

// allow to read 'request' with json type
app.use(express.json());

// create route to add new borrowing book
app.post('/', borrowController.addBorrowing);
// create route to update borrowed book based on ID
app.put('/:id', borrowController.updateBorrowing);
// create route to delete borrowed book based on ID
app.delete('/:id', borrowController.deleteBorrowing);
// create route to return book
app.get('/return/:id', borrowController.returnBook);
// create route to get all borrowed book
app.get('/', borrowController.getBorrow);

// export app in order to load in another file
module.exports = app;