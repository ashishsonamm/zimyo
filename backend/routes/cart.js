const express = require('express');
const router = express.Router();
const {authMiddleware, roleAuth} = require('../middleware');
const ErrorHandler = require("../middleware/error");
const CartController = require('../controller/cart')

// Add to cart
router.post('/add', authMiddleware, roleAuth(['buyer']), ErrorHandler(CartController.addToCart));

// View cart
router.get('/', authMiddleware, roleAuth(['buyer']), ErrorHandler(CartController.viewCart));

// Remove from cart
router.delete('/remove/:artworkId', authMiddleware, roleAuth(['buyer']), ErrorHandler(CartController.removeFromCart));

module.exports = router;