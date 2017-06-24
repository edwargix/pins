var express = require('express');
const path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
const fs = require('fs');

const qs = require('querystring');

const multer = require('multer');
const upload = multer();


const admin = require('./config/admin');


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, cb) {
    if (username != admin.username) { return cb(null, false); }
    if (password != admin.password) { return cb(null, false); }
    return cb(null, admin);
  })
            );

passport.serializeUser(function(user, cb) {
  cb(null, admin.id);
});

passport.deserializeUser(function(id, cb) {
  cb(null, admin);
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((require('cookie-parser'))());


// Auth
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// Statics
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'pins')));


app.get('/login', function(req, res) {
  res.render('login', { user: req.user, title: 'Login' });
});

app.post('/login',
         passport.authenticate('local', { failureRedirect: '/login' }),

         function(req, res) {
           res.redirect(req.body.redirect);
         });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


app.use(require('./routes/ops'));


app.use('/', require('./routes/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
