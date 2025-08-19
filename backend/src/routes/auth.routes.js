const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register a new user
router.post('/register', authController.register);
http://localhost:3000/api/auth/register

// User login
router.post('/login', authController.login);

module.exports = router;
