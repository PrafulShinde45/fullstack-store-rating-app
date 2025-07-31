const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateUserRegistration, validatePasswordUpdate } = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, authController.register);
router.post('/login', authController.login);

// Protected routes
router.put('/update-password', authenticateToken, validatePasswordUpdate, authController.updatePassword);
router.put('/update-profile', authenticateToken, authController.updateProfile);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router; 