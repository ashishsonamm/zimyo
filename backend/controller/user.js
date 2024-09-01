const { User, Artwork, Order } = require('../models');

const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: ['id', 'username', 'email', 'role']
      });
  
      if (!user) {
        return requestHandler.sendError(
            res,
            "User not found",
            404
          )();
      }
      return requestHandler.sendSuccess(
        res,
        `User profile fetched`,
        200
    )(user);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.updateUserProfile = async (req, res) => {
    const { username, email } = req.body;
    try {
      const [affectedRows] = await User.update(
        { username, email },
        { where: { id: req.user.userId } }
      );
  
      if (affectedRows === 0) {
        return requestHandler.sendError(
            res,
            "User not found",
            404
          )();
      }
  
      return requestHandler.sendSuccess(
        res,
        `Profile updated successfully`,
        200
    )();
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.getUsersArtworks = async (req, res) => {
    try {
      const artworks = await Artwork.findAll({
        where: { artist_id: req.user.userId }
      });
  
      return requestHandler.sendSuccess(
        res,
        `Artworks fetched successfully`,
        200
    )(artworks);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.getUsersOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: { buyer_id: req.user.userId },
        include: [{
          model: Artwork,
          attributes: ['title', 'price']
        }]
      });
  
      return requestHandler.sendSuccess(
        res,
        `Orders fetched successfully`,
        200
    )(orders);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.getUserById = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId, {
        attributes: ['id', 'username', 'role']
      });
  
      if (!user) {
        return requestHandler.sendError(
            res,
            "User not found",
            404
          )();
      }
      return requestHandler.sendSuccess(
        res,
        `User profile fetched successfully`,
        200
    )(user);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }