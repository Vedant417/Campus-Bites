const express = require('express');
const router = express.Router();
const { submitRating, getRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

// GET all ratings for a menu item (public)
router.get('/:menuItemId', getRatings);

// POST submit a rating (auth required)
router.post('/:menuItemId', protect, submitRating);

module.exports = router;
