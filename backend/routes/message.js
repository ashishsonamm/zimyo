const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware');

const ErrorHandler = require("../middleware/error");
const MessageController = require('../controller/message')

// Send a message
router.post('/send', authMiddleware, ErrorHandler(MessageController.sendMessage));

// Get conversation between users
router.get('/conversation/:userId', authMiddleware, ErrorHandler(MessageController.getConversation));

module.exports = router;