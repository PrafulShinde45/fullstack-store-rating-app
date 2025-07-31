const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateUserRegistration } = require('../middleware/validation');

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard stats
router.get('/dashboard/stats', userController.getDashboardStats);

// Get all users with filtering and sorting
router.get('/', userController.getAllUsers);

// Get user by ID with details
router.get('/:id', userController.getUserById);

// Create new user (admin only)
router.post('/', validateUserRegistration, userController.createUser);

module.exports = router; 