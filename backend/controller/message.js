const { Op } = require('sequelize');
const { Message } = require('../models');

const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

exports.sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    try {
      const message = await Message.create({
        sender_id: req.user.userId,
        receiver_id: receiverId,
        content
      });
      return requestHandler.sendSuccess(
        res,
        `Message sent successfully`,
        201
    )({messageId: message.id});
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.getConversation = async (req, res) => {
    const otherUserId = req.params.userId;
    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: req.user.userId, receiver_id: otherUserId },
            { sender_id: otherUserId, receiver_id: req.user.userId }
          ]
        },
        order: [['created_at', 'ASC']]
      });
      return requestHandler.sendSuccess(
        res,
        `conversation fetched`,
        200
    )(messages);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }