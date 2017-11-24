const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const Comment = require('../models/comment').Comment;
const Post = require('../models/post').Post;
const MAX_POST_AGE = require('../models/post').MAX_AGE;

// get all the posts, filter for timestamp (validation), sort by score (upvotes)
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
        postArray: valideDates
      };
      res.render('feed/all', data);
    }
  });
});

// render the new-post-page with a form for a new feed
router.get('/new', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('feed/new');
});

// create and saves the new post and redirects to the page of the newly created post
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
});

router.post('/upvote/:postId', (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  Post.findOne({
    _id: postId
  }, (err, result) => {
    if (err) {
      next(err);
    } else {
      let alreadyVoted = result.upvotes.some((el) => {
        return el.equals(userId);
      });
      if (alreadyVoted == true) {
        res.redirect('/feed');
      } else {
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
      }
    }
  });
});

router.post('/downvote/:postId', (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  Post.findOne({
    _id: postId
  }, (err, result) => {
    if (err) {
      next(err);
    } else {
      let alreadyVoted = result.downvotes.some((el) => {
        return el.equals(userId);
      });
      if (alreadyVoted == true) {
        res.redirect('/feed');
      } else {
        const updateDownvote = {
          $push: {
            downvotes: userId
          },
          $inc: {
            score: -1
          }
        };

        Post.update({
          _id: postId
        }, updateDownvote, (err) => {
          if (err) {
            next(err);
          }
        });
        res.redirect('/feed');
      }
    }
  });
});

router.get('/:postId', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const postId = req.params.postId;
  Post.findOne({
    _id: postId
  }, (err, result) => {
    if (err) {
      next(err);
    }
    const data = {
      post: result
    };
    res.render('feed/detail', data);
  });
});

// NEW COMMENT
router.post('/:postId/comment', (req, res, next) => {
  const postId = req.params.postId;
  const hacker = req.user._id;
  const commentText = req.body.text;
  const newComment = new Comment({
    text: commentText,
    owner: hacker
  });

  newComment.save((err) => { });

  const updateComments = {
    $push: {
      comments: newComment
    }
  };

  Post.update({
    _id: postId
  }, updateComments, (err) => {
    if (err) {
      next(err);
    }
    res.redirect('/feed');
    // res.json('it worked');
  });
});

module.exports = router;
