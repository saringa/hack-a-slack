const express = require('express');
const router = express.Router();

router.get('/signup', (req, res, next) => {
  // Checks, if hacker is logged in, Render the Signup-View (views/auth/signup)
});
router.post('/signup', (req, res, next) => {
  // Creates a new hacker, saves it in the Database, Redirects to feed
});
router.get('/login', (req, res, next) => {
  // Checks Logged-In, Find the hacker in the Database, Redirect to Feed
});
router.post('/login', (req, res, next) => {
  // Creates a session and redirects to feed
});

module.exports = router;
