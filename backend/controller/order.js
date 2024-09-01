const sequelize = require('../database/connection');
const { Artwork, Cart, Order, OrderItem } = require('../models');

const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

exports.createOrder = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      // Start a transaction
      const result = await sequelize.transaction(async (t) => {
        // Create the order
        const order = await Order.create({ buyer_id: userId, status: 'pending' }, { transaction: t });
  
        // Get cart items
        const cartItems = await Cart.findAll({ where: { user_id: userId }, transaction: t });
  
        // Add items to order_items
        await Promise.all(cartItems.map(item => 
          OrderItem.create({ order_id: order.id, artwork_id: item.artwork_id }, { transaction: t })
        ));
  
        // Clear the cart
        await Cart.destroy({ where: { user_id: userId }, transaction: t });
  
        return order;
      });
      return requestHandler.sendSuccess(
        res,
        `Order created successfully`,
        201
    )({orderId: result.id });
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.getUserOrders = async (req, res) => {
    try {
      let orders;
      if (req.user.role === 'buyer') {
        orders = await Order.findAll({
          where: { buyer_id: req.user.userId },
          include: [{ model: Artwork }]
        });
      } else {
        // For artists, get orders that include their artworks
        orders = await Order.findAll({
          include: [{
            model: Artwork,
            where: { artist_id: req.user.userId }
          }]
        });
      }
      return requestHandler.sendSuccess(
        res,
        `Payment successful and order completed`,
        200
    )(orders);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.paymentSimulation = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.userId;
  
    try {
      const [affectedRows] = await Order.update(
        { status: 'completed' },
        { where: { id: orderId, buyer_id: userId } }
      );
  
      if (affectedRows === 0) {
        return requestHandler.sendError(
            res,
            "Order not found or you are not authorized",
            404
          )();
      }
  
      return requestHandler.sendSuccess(
        res,
        `Payment successful and order completed`,
        200
    )(artwork.id);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.confirmOrder = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.userId;
  
    try {
      const order = await Order.findOne({ where: { id: orderId, buyer_id: userId } });
  
      if (!order) {
        return requestHandler.sendError(
            res,
            "Order not found",
            404
          )();
      }
  
      if (order.status !== 'completed') {
        return requestHandler.sendError(
            res,
            "Order is not yet completed",
            400
          )();
      }
  
      const confirmationNumber = `CONF-${Date.now()}-${orderId}`;
  
      await Order.update({ confirmation_number: confirmationNumber }, { where: { id: orderId } });
      return requestHandler.sendSuccess(
        res,
        `Order confirmed`,
        200
    )(confirmationNumber);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }