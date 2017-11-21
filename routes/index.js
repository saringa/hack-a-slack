const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Hack-A-Slack',
    user: req.user
  });
  // Render the general information page
});

module.exports = router;
