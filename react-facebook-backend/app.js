var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var usersRouter = require('./routes/users');
var auth0userRouter = require('./routes/auth0user') ;
var app = express();

var cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' })); // Increased JSON payload limit
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased URL-encoded payload limit
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/auth0user', auth0userRouter) ;
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

async function main() {
  try {
    const connectionUrl = 'mongodb+srv://Rajesh123:dF5tLdEIRqq7I4V2@cluster0.194ppjj.mongodb.net/Facebook?retryWrites=true&w=majority';
    await mongoose.connect(connectionUrl);
    console.log('Db is connected');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the application on a database connection error
  }
}
main();
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
