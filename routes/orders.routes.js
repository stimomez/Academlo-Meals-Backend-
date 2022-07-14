const express = require('express');

const {
  createOrderValidators,
} = require('../middlewares/validators.middleware');

const { protectSession } = require('../middlewares/auth.middleware');

const { mealExists } = require('../middlewares/meals.middlewares');

const {
  createOrder,
  getAllOrdersUser,
  updateOrder,
  deleteOrder,
} = require('../controllers/orders.controller');
const {
  orderExists,
  protectOrderAuthor,
} = require('../middlewares/orders.middlewares');

const ordersRouter = express.Router();

ordersRouter.use(protectSession);

ordersRouter.get('/me', getAllOrdersUser);

ordersRouter.post('/', createOrderValidators, mealExists, createOrder);

ordersRouter
  .route('/:id')
  .patch(orderExists, protectOrderAuthor, updateOrder)
  .delete(orderExists, protectOrderAuthor, deleteOrder);

module.exports = { ordersRouter };
