const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/:id/edit', (req, res, next) => {
  // Find the current hacker user in the database and show his profile
});

router.post('/:id/edit', (req, res, next) => {
  // FindAndUpdate the hacker in the database
});

module.exports = router;
