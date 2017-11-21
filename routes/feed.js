const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const Post = require('../models/post').Post;

router.get('/', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
<<<<<<< HEAD
  Post.find({}, (err, result) => {
    if (err) {
      return next(err);
    }
    const data = {
      feeds: result
    };
    res.render('feed/all', data);
=======
  Post.find({}, (error, result) => {
    if (error) {
      next(error);
    } else {
      const data = {
        post: result
      };
      console.log(data.post[0].text);
      res.render('feed/all', data);
    }
>>>>>>> b5eafc01ef06e10e44ab19f72b06e7762283f861
  });
  // get all the posts, filter for timestamp (validation), sort by score (upvotes)
});

router.get('/new', (req, res, next) => {
  // render the new-post-page with a form for a new feed
});

router.get('/:id', (req, res, next) => {
  // find the selected post, including the comments from the database and rendering it
});

router.post('/:id', (req, res, next) => {
  // create and saves the new post and redirects to the page of the newly created post
});

module.exports = router;
