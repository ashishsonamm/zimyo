const { User, Review } = require('../models');

const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

exports.postReview = async (req, res) => {
    const { artworkId, rating, comment } = req.body;
    const reviewerId = req.user.userId;
  
    try {
      const review = await Review.create({
        artwork_id: artworkId,
        reviewer_id: reviewerId,
        rating,
        comment
      });
      return requestHandler.sendSuccess(
        res,
        `Review posted successfully`,
        201
    )({reviewId: review.id });
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.getReviewsOnPost = async (req, res) => {
    const artworkId = req.params.artworkId;
  
    try {
      const reviews = await Review.findAll({
        where: { artwork_id: artworkId },
        include: [{
          model: User,
          as: 'reviewer',
          attributes: ['username'] // Fetch only the username from the User model
        }]
      });
      return requestHandler.sendSuccess(
        res,
        `Review fetched`,
        200
    )(reviews);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }



