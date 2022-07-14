// Models
const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const status = 'active';

  const order = await Order.findOne({
    where: { id, status },
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
        include: { model: Restaurant, include: { model: Review } },
      },
    ],
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  req.order = order;
  next();
});

const protectOrderAuthor = catchAsync(async (req, res, next) => {
  const { sessionUser, order } = req;

  if (sessionUser.id !== order.userId) {
    return next(new AppError('You are not the author of this order.', 403));
  }
  next();
});

module.exports = {
  orderExists,
  protectOrderAuthor,
};
