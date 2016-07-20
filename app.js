'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var config = require('./config/config.json');
var LocalStrategy = require('passport-local').Strategy;
var models  = require('./models')

var app = express();

// Add shared functoins for ejs templates
require('./modules/ejs-shared.js')(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// start login strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('MADE IT HERE!! B!');
    models.user.findOne({ where : { username: username }}).then(function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

// end login strategy


var sessionInfo = {
  secret:  config.sessionSecret,
  resave: false,
  saveUninitialized: true
};


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionInfo));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/signup'));
app.use(require('./routes/login'));
app.use(require('./routes/logout'));
app.use(require('./routes/destinations'));
app.use(require('./routes/destination'));
app.use(require('./routes/countries'));



app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {

    console.log(err);
    console.log(user);
    console.log(info);

    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var testPort = 3001;
var testServer =  null;
app.startTestServer = function(){
  testServer = this.listen(testPort, function () {
  var port = testServer.address().port;
  console.log('App listening at port %s', testPort);
  });
}

app.closeTestServer = function(){
  testServer.close();
}


module.exports = app;
