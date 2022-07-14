const dotenv = require('dotenv');

const { Meal } = require('../models/meal.model');
const { Review } = require('../models/review.model');

const { catchAsync } = require('../utils/catchAsync.util');
const { Restaurant } = require('../models/restaurant.model');

dotenv.config({ path: './config.env' });

const getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: { status: 'active' },
    include: {
      model: Restaurant,
      include: { model: Review },
    },
  });

  res.status(200).json({
    status: 'success',
    meals,
  });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;

  res.status(200).json({
    status: 'success',
    meal,
  });
});

const createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { restaurantId } = req;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId,
  });

  res.status(201).json({
    status: 'success',
    newMeal,
  });
});
const updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({ name, price });

  res.status(204).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: 'disable' });

  res.status(204).json({ status: 'success' });
});

module.exports = {
  getAllMeals,
  createMeal,
  getMealById,
  updateMeal,
  deleteMeal,
};
