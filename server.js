const { app } = require('./app');
const { Meal } = require('./models/meal.model');
const { Order } = require('./models/order.model');
const { Restaurant } = require('./models/restaurant.model');
const { Review } = require('./models/review.model');
const { User } = require('./models/user.model');
const { db } = require('./utils/database.util');

app.listen(3520, () => console.log('Express app running!!!'));

db.authenticate()
  .then(() => console.log('Db authenticated'))
  .catch(err => console.log(err));

  Restaurant.hasMany(Review)
  Review.belongsTo(Restaurant)

  Restaurant.hasMany(Meal)
  Meal.belongsTo(Restaurant)

  User.hasMany(Review)
  Review.belongsTo(User)

  User.hasMany(Order)
  Order.belongsTo(User)

  Meal.hasOne(Order, {foreignKey: 'mealId'})
  Order.belongsTo(Meal)

db.sync()
  .then(() => console.log('Db synced'))
  .catch(err => console.log(err));
