var Sequelize = require('sequelize');
var sequelize = require('./database');

var Perfil = sequelize.define('perfil', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  perfil: {
    type: Sequelize.STRING,
    allowNull: false
  },
  perms: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    },
    defaultValue: 3
  }
});

module.exports = Perfil;
