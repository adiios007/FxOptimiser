const express = require('express');
var createError = require('http-errors');
var path = require('path');
//const session  = require('express-session');

//add routes
const homeRoutes = require('./routes/homepage');
const xchangeRoutes = require('./routes/xchangecurrency');
const orderRoutes = require('./routes/orderdetails');

const app = express();

const port = 3000;

app.use('/fx', homeRoutes);
app.use('/currencyconvertor', xchangeRoutes);
app.use('/orderdetails',orderRoutes);
//app.set('/checkout', checkoutRoutes);

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  console.log("error: "+err);
  res.render('error');  
});
app.listen(8080, () => console.log('Server running on port 3000!'));

module.exports = app;