const express = require('express');
const router = express.Router();
const {authMiddleware, roleAuth} = require('../middleware');

const ErrorHandler = require("../middleware/error");
const UserController = require('../controller/user')

// Get user profile
router.get('/profile', authMiddleware, ErrorHandler(UserController.getUserProfile));

// Update user profile
router.put('/profile', authMiddleware, ErrorHandler(UserController.updateUserProfile));

// Get user's artworks (for artists)
router.get('/artworks', authMiddleware, roleAuth(['artist']), ErrorHandler(UserController.getUsersArtworks));

// Get user's orders (for buyers)
router.get('/orders', authMiddleware, roleAuth(['buyer']), ErrorHandler(UserController.getUsersOrders));

// Get public profile of a user
router.get('/:userId', ErrorHandler(UserController.getUserById));

module.exports = router;