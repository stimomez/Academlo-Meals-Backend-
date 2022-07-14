const express = require('express');

// Controllers
const {
  createUser,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/users.controller');

// Middlewares
const {
  createUserValidators,
} = require('../middlewares/validators.middleware');

const { userExists } = require('../middlewares/users.middleware');

const {
  protectSession,
  protectUserAccount,
} = require('../middlewares/auth.middleware');

const { orderExists } = require('../middlewares/orders.middlewares');

const {
  getAllOrdersUser,
  getOrderById,
} = require('../controllers/orders.controller');

const usersRouter = express.Router();

usersRouter.post('/signup', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/orders', getAllOrdersUser);
usersRouter.get('/orders/:id', orderExists, getOrderById);
usersRouter
  .use('/:id', userExists)
  .route('/:id')
  .patch(protectUserAccount, updateUser)
  .delete(protectUserAccount, deleteUser);

module.exports = { usersRouter };
