
const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

router.get('/', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('feed/all');
  // get all the posts, filter for timestamp (validation), sort by score (upvotes)
});

router.get('/:id', (req, res, next) => {
  // find the selected post, including the comments from the database and rendering it
});

router.get('/new', (req, res, next) => {
  // render the new-post-page with a form for a new feed
});

router.post('/:id', (req, res, next) => {
  // create and saves the new post and redirects to the page of the newly created post
});

module.exports = router;
