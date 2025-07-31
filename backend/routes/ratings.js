const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken } = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Submit new rating
router.post('/', validateRating, ratingController.submitRating);

// Update existing rating
router.put('/', validateRating, ratingController.updateRating);

// Get ratings for a specific store (for store owners)
router.get('/store/:storeId', ratingController.getStoreRatings);

// Get user's ratings
router.get('/user', ratingController.getUserRatings);

// Delete rating
router.delete('/:id', ratingController.deleteRating);

module.exports = router; 