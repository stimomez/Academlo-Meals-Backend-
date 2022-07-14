const express = require('express');

// Controllers
const {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteResturant,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/restaurants.controller');

// Middlewares
const {
  createRestaurantValidators,
} = require('../middlewares/validators.middleware');

const {
  restaurantExists,
  reviewExists,
  protectReviewAuthor,
} = require('../middlewares/restaurant.middleware');
const { protectSession, adminRole } = require('../middlewares/auth.middleware');

const restaurantRouter = express.Router();

restaurantRouter.get('/', getAllRestaurants);
restaurantRouter.get('/:id', restaurantExists, getRestaurantById);

restaurantRouter.use(protectSession);

restaurantRouter.post('/', createRestaurantValidators, createRestaurant);

restaurantRouter
  .route('/:id')
  .patch(restaurantExists, adminRole, updateRestaurant)
  .delete(restaurantExists, adminRole, deleteResturant);

restaurantRouter.post('/reviews/:restaurantId', restaurantExists, createReview);

restaurantRouter.patch(
  '/reviews/:id',
  reviewExists,
  protectReviewAuthor,
  updateReview
);
restaurantRouter.delete(
  '/reviews/:id',
  reviewExists,
  protectReviewAuthor,
  deleteReview
);

module.exports = { restaurantRouter };
