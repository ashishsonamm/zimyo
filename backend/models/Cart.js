const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Cart = sequelize.define('Cart', {
  // id is automatically added by Sequelize
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Cart;
