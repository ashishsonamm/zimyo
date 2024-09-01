const express = require('express');
const router = express.Router();
const {authMiddleware, roleAuth} = require('../middleware');

const ErrorHandler = require("../middleware/error");
const ReviewController = require('../controller/review')

router.post('/post', authMiddleware, roleAuth(['buyer']), ErrorHandler(ReviewController.postReview));

router.get('/artwork/:artworkId', ErrorHandler(ReviewController.getReviewsOnPost));

module.exports = router;