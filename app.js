'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const ensureLoggedIn = require('connect-ensure-login');
// const configurePassport = require('./helpers/passport');

const index = require('./routes/index');
const hackers = require('./routes/hackers');
const auth = require('./routes/auth');
const feed = require('./routes/feed');

const Hacker = require('./models/hacker').Hacker;

const app = express();

// --SETUP THE APP-- //

dotenv.config();

// --SESSION-- //
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// --PASSPORT-- //

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  Hacker.findOne({
    '_id': id
  }, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, hackername, password, next) => {
  Hacker.findOne({
    hackername
  }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, {
        message: 'Incorrect hackername'
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {
        message: 'Incorrect password'
      });
    }

    return next(null, user);
  });
}));

// configurePassport();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: 'hack-a-slack-app',
  resave: true,
  saveUninitialized: true
}));

// --DATABASE-- //

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// --VIEWS-- //
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

// --other middlewares-- //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --app middlewares-- //

// --ROUTES-- //
app.use('/', index);
app.use('/hackers', hackers);
app.use('/auth', auth);
app.use('/feed', feed);

// --404 AND ERROR HANDLER--//
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render('not-found');
});

// error handler
app.use(function (err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
