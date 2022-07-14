const express = require('express');

const {
  createMealValidators,
} = require('../middlewares/validators.middleware');

const { restaurantExists } = require('../middlewares/restaurant.middleware');
const { protectSession, adminRole } = require('../middlewares/auth.middleware');

const {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/meals.controller');

const { mealExists } = require('../middlewares/meals.middlewares');

const mealsRouter = express.Router();

mealsRouter.get('/', getAllMeals);
mealsRouter.get('/:id', mealExists, getMealById);

mealsRouter.use(protectSession);

mealsRouter.post('/:id', createMealValidators, restaurantExists, createMeal);

mealsRouter
  .route('/:id')
  .patch(adminRole, createMealValidators, mealExists, updateMeal)
  .delete(adminRole, mealExists, deleteMeal);

module.exports = { mealsRouter };
