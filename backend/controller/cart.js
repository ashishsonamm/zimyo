const {Artwork, Cart } = require('../models');

const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

exports.addToCart = async (req, res) => {
    const { artworkId } = req.body;
    try {
        // Check if the item is already in the cart
        const existingItem = await Cart.findOne({
            where: {
                user_id: req.user.userId,
                artwork_id: artworkId
            }
        });

        if (existingItem) {
            return requestHandler.sendError(
                res,
                "Item already in cart",
                400
              )();
        }

        // Add the item to the cart
        await Cart.create({
            user_id: req.user.userId,
            artwork_id: artworkId
        });
        return requestHandler.sendSuccess(
            res,
            `tem added to cart`,
            201
        )({userId: newUser.id});
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
}

exports.viewCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: {
                user_id: req.user.userId
            },
            include: [
                {
                    model: Artwork,
                    attributes: ['title', 'price']
                }
            ]
        });
        return requestHandler.sendSuccess(
            res,
            `cart details fetched`,
            200
        )(cartItems);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
}

exports.removeFromCart = async (req, res) => {
    const { artworkId } = req.params;
    try {
        const result = await Cart.destroy({
            where: {
                user_id: req.user.userId,
                artwork_id: artworkId
            }
        });

        if (result === 0) {
            return requestHandler.sendError(
                res,
                "Item not found in cart",
                404
              )();
        }
        return requestHandler.sendSuccess(
            res,
            `item removed from cart`,
            200
        )();

    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
}