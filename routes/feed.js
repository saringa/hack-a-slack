const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const Post = require('../models/post').Post;
const MAX_POST_AGE = require('../models/post').MAX_AGE;

router.get('/', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const mysort = {
    score: -1
  };
  const currentTime = new Date();
  const threshold = new Date();
  threshold.setTime(currentTime.getTime() - MAX_POST_AGE);
  Post.find({}).sort(mysort).exec((error, result) => {
    if (error) {
      next(error);
    } else {
      const valideDates = result.filter(elem => {
        return elem.created_at > threshold;
      });
      const data = {
        user: req.user,
        post: valideDates
      };
      // console.log(data.post[0].upvotes.indexOf(data.user._id));
      var isInArray = data.post[1].downvotes.some(function (el, index, array) {
        console.log('Element: ' + el);
        return el.equals(data.user._id);
      });
      console.log(isInArray, 'test' + data.user._id);
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

router.post('/upvote/:postId', (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  // const postUpvotes = postId.upvotes;
  const updateUpvote = {
    $push: {
      upvotes: userId
    },
    $inc: {
      score: 1
    }
  };

  Post.update({
    _id: postId
  }, updateUpvote, (err) => {
    if (err) {
      next(err);
    }
  });

  res.redirect('/feed');
});

router.post('/downvote/:postId', (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  // const postUpvotes = postId.upvotes;
  const updates = {
    $push: {
      downvotes: userId
    },
    $inc: {
      score: -1
    }
  };
  Post.update({
    _id: postId
  }, updates, (err) => {
    if (err) {
      next(err);
    }
  });
  res.redirect('/feed');
});

module.exports = router;
