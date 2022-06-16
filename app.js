var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');

var app = express();

const { decodeToken } = require('./utils')
const authRoute = require('./app/auth/routes');
const productRoute = require('./app/product/routes');
const categoryRoute = require('./app/category/routes');
const tagRoute = require('./app/tag/routes');
const deliveryAddressRoute = require('./app/deliveryAddress/routes');
const cartRoute = require('./app/cart/routes');
const orderRoute = require('./app/order/routes');
const invoiceRoute = require('./app/invoice/routes');
const cookieParser = require('cookie-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: [
    'http://localhost:3000'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(decodeToken());

app.use('/auth', authRoute);
app.use('/api/v1', productRoute);
app.use('/api/v1', categoryRoute);
app.use('/api/v1', tagRoute);
app.use('/api/v1', deliveryAddressRoute);
app.use('/api/v1', cartRoute);
app.use('/api/v1', orderRoute);
app.use('/api/v1', invoiceRoute);

app.use('/', function (req, res) {
  res.render('index', { title: 'Product API Service' });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
