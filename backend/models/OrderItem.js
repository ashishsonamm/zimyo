const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const OrderItem = sequelize.define('OrderItem', {
  // id is automatically added by Sequelize
});

module.exports = OrderItem;
