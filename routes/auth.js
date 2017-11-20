'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Hacker = require('../models/hacker');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
  // Checks, if hacker is logged in, Render the Signup-View (views/auth/signup)
});
router.post('/signup', (req, res, next) => {
  const hackername = req.body.hackername;
  const password = req.body.password;

  if (hackername === '' || password === '') {
    res.render('auth/signup', {
      message: 'Indicate hackername and password'
    });
    return;
  }

  User.findOne({
    hackername
  }, 'hackername', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', {
        message: 'The hackername already exists'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      hackername,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          message: 'Something went wrong'
        });
      } else {
        res.redirect('/');
      }
    });
  });
});
// Creates a new hacker, saves it in the Database, Redirects to feed

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});
// Checks Logged-In, Find the hacker in the Database, Redirect to Feed

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

// Creates a session and redirects to feed
module.exports = router;
