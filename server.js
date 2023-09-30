// load library express
const express = require('express');
// create object that instances of express
const app = express();
// define port of server
const PORT = 3000;
// load library cors
const cors = require('cors');
// define all routes
const memberRoute = require('./routes/member.route');
const bookRoute = require('./routes/book.route');
const borrowRoute = require('./routes/borrow.route');
const auth = require('./routes/auth.route');

// open CORS policy
app.use(cors());
// define prefix for each route
app.use('/auth', auth);
app.use('/member', memberRoute);
app.use('/book', bookRoute);
// route to access uploaded file
app.use(express.static(__dirname));
app.use('/borrow', bookRoute);

// run server based on defined port
app.listen(PORT, () => {
  console.log(`Server of School's Library runs on port ${PORT}`);
});