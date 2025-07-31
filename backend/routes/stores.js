const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateStoreCreation } = require('../middleware/validation');

// Public routes (no authentication required)
router.get('/', storeController.getAllStores);
router.get('/search', storeController.searchStores);
router.get('/:id', storeController.getStoreById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, validateStoreCreation, storeController.createStore);

module.exports = router; 