const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Message;
