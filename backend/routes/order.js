const express = require('express');
const router = express.Router();
const {authMiddleware, roleAuth} = require('../middleware');

const ErrorHandler = require("../middleware/error");
const OrderController = require('../controller/order')

router.post('/create', authMiddleware, roleAuth(['buyer']), ErrorHandler(OrderController.createOrder));

router.get('/user', authMiddleware, roleAuth(['buyer', 'artist']), ErrorHandler(OrderController.getUserOrders));

router.post('/pay/:orderId', authMiddleware, roleAuth(['buyer']), ErrorHandler(OrderController.paymentSimulation));

router.post('/confirm/:orderId', authMiddleware, roleAuth(['buyer']), ErrorHandler(OrderController.confirmOrder));

module.exports = router;