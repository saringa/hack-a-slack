const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const Post = require('../models/post').Post;

router.get('/', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const mysort = {
    score: -1
  };
  Post.find({}).sort(mysort).exec((error, result) => {
    if (error) {
      next(error);
    } else {
      const data = {
        post: result
      };
      res.render('feed/all', data);
    }
  });
  // get all the posts, filter for timestamp (validation), sort by score (upvotes)
});

router.get('/new', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('feed/new');
  // render the new-post-page with a form for a new feed
});

router.get('/:id', (req, res, next) => {
  // find the selected post, including the comments from the database and rendering it
});

router.post('/new', (req, res, next) => {
  const hacker = req.user._id;
  const posttext = req.body.text;
  const newPost = new Post({
    text: posttext,
    owner: hacker,
    score: 0
  });

  newPost.save((err) => {
    if (err) {
      next(err);
    }
    res.redirect('/feed');
  });

  // create and saves the new post and redirects to the page of the newly created post
});

module.exports = router;
