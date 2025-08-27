const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all users (for admin purposes)
router.get('/all', userController.getAllUsers);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Delete user account
router.delete('/profile', userController.deleteAccount);

module.exports = router;
