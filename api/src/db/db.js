const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:r@127.0.0.1:5432/webproject')

module.exports = {
    sequelize,
  };