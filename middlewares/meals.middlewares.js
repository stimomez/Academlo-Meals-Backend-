// Models
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const mealExists = catchAsync(async (req, res, next) => {
  const { mealId } = req.body;
  const status = 'active';
  let id;
  mealId ? (id = mealId) : (id = req.params.id);

  const meal = await Meal.findOne({
    where: { id, status },
    include: {
      model: Restaurant,
      include: { model: Review },
    },
  });

  if (!meal) {
    return next(new AppError('Meal not found', 404));
  }

  req.meal = meal;
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
  mealExists,
  reviewExists,
  protectReviewAuthor,
};
