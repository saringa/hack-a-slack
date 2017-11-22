'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Hacker = require('../models/hacker').Hacker;

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.use((req, res, next) => {
  if (req.user && req.path !== '/logout') {
    res.redirect('/feed');
  }
  next();
});

// Checks, if hacker is logged in, Render the Signup-View (views/auth/signup)
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// Creates a new hacker, saves it in the Database, Redirects to feed
router.post('/signup', (req, res, next) => {
  const hackername = req.body.hackername;
  const password = req.body.password;

  if (hackername === '' || password === '') {
    res.render('auth/signup', {
      message: 'Indicate hackername and password'
    });
    return;
  }

  Hacker.findOne({
    hackername
  }, 'hackername', (err, hacker) => {
    if (err) {
      return next(err);
    }

    if (hacker !== null) {
      res.render('auth/signup', {
        message: 'The hackername already exists'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newHacker = new Hacker({
      hackername,
      password: hashPass
    });

    newHacker.save((err) => {
      if (err) {
        res.render('auth/signup', {
          message: 'Something went wrong'
        });
      }
      req.login(newHacker, () => {
        res.redirect('/feed');
      });
    });
  });
});

// Checks Logged-In, Find the hacker in the Database, Redirect to Feed
router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    'message': req.flash('error')
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/feed',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true
}));

// logout

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
module.exports = router;
