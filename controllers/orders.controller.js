const dotenv = require('dotenv');

const { Meal } = require('../models/meal.model');

const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

dotenv.config({ path: './config.env' });

const getAllOrdersUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = sessionUser;

  const orders = await Order.findAll({
    where: { userId: id },
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
        include: { model: Restaurant, include:{
          model: Review
        } },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    orders,
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { order, sessionUser } = req;
  const { id } = sessionUser;

  if (order.userId !== id) {
    return next(new AppError('User without orders', 403));
  }

  res.status(200).json({
    status: 'success',
    order,
  });
});

const createOrder = catchAsync(async (req, res, next) => {
  const { meal, sessionUser } = req;
  const { price } = meal;
  const { id } = sessionUser;
  const { quantity, mealId } = req.body;

  const totalPrice = quantity * price;

  const newOrder = await Order.create({
    quantity,
    totalPrice,
    mealId,
    userId: id,
  });

  res.status(201).json({
    status: 'success',
    newOrder,
  });
});
const updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(204).json({ status: 'success' });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });

  res.status(204).json({ status: 'success' });
});

module.exports = {
  getAllOrdersUser,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
