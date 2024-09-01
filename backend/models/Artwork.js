const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Artwork = sequelize.define('Artwork', {
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.ENUM('available', 'sold'),
    allowNull: false,
    defaultValue: 'available'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Artwork;
