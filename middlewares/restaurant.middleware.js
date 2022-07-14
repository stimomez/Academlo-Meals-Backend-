// Models
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const restaurantExists = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  if (!id) {
    const { restaurantId } = req.params;
    id = restaurantId;
  }
  req.restaurantId = id;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
    include: { model: Review, required: false, where: { status: 'active' } },
  });

  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404));
  }

  req.restaurant = restaurant;
  next();
});

const reviewExists = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  const review = await Review.findOne({ where: { id } });

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  req.review = review;
  next();
});

const protectReviewAuthor = catchAsync(async (req, res, next) => {
  const { sessionUser, review } = req;

  if (sessionUser.id !== review.userId) {
    return next(new AppError('You are not the author of this review.', 403));
  }
  next();
});

module.exports = {
  restaurantExists,
  reviewExists,
  protectReviewAuthor,
};
