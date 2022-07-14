const dotenv = require('dotenv');

const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

const { catchAsync } = require('../utils/catchAsync.util');

dotenv.config({ path: './config.env' });

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: 'active' },
    include: { model: Review, required: false, where: { status: 'active' } },
  });

  res.status(200).json({
    status: 'success',
    restaurants,
  });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({
    status: 'success',
    newRestaurant,
  });
});
const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  await restaurant.update({ name, address });

  res.status(204).json({ status: 'success' });
});

const deleteResturant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: 'disable' });

  res.status(204).json({ status: 'success' });
});

const createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { sessionUser, restaurantId } = req;
  const { id } = sessionUser;

  const newReview = await Review.create({
    comment,
    restaurantId,
    userId: id,
    rating,
  });

  res.status(201).json({
    status: 'success',
    newReview,
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  const { comment, rating } = req.body;

  await review.update({ comment, rating });

  res.status(204).json({ status: 'success' });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

module.exports = {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteResturant,
  createReview,
  updateReview,
  deleteReview,
};
