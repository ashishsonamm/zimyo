const sequelize = require('../database/connection');
const User = require('./User');
const Artwork = require('./Artwork');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Message = require('./Message');
const Review = require('./Review');

// Define associations
// User and Artwork
User.hasMany(Artwork, { foreignKey: 'artist_id' });
Artwork.belongsTo(User, { as: 'artist', foreignKey: 'artist_id' });

// User and Cart
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart and Artwork
Cart.belongsTo(Artwork, { foreignKey: 'artwork_id' });
Artwork.hasMany(Cart, { foreignKey: 'artwork_id' });

// User and Order
User.hasMany(Order, { foreignKey: 'buyer_id' });
Order.belongsTo(User, { as: 'buyer', foreignKey: 'buyer_id' });

// Order and Artwork (through OrderItem)
Order.belongsToMany(Artwork, { through: OrderItem, foreignKey: 'order_id', otherKey: 'artwork_id' });
Artwork.belongsToMany(Order, { through: OrderItem, foreignKey: 'artwork_id', otherKey: 'order_id' });

// User and Message
User.hasMany(Message, { as: 'SentMessages', foreignKey: 'sender_id' });
User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'receiver_id' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiver_id' });

// User, Artwork, and Review
User.hasMany(Review, { foreignKey: 'reviewer_id' });
Artwork.hasMany(Review, { foreignKey: 'artwork_id' });
Review.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewer_id' });
Review.belongsTo(Artwork, { foreignKey: 'artwork_id' });

// Sync models with database
sequelize.sync({ force: false })
  .then(() => console.log('Database & tables created!'));

module.exports = {
  User,
  Artwork,
  Cart,
  Order,
  OrderItem,
  Message,
  Review
};
