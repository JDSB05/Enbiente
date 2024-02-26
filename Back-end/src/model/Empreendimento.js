var Sequelize = require('sequelize');
var sequelize = require('./database');
var Utilizador = require('./Utilizador');

var Empreendimento = sequelize.define('empreendimento', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  morada: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  excel: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  documentoTecnico: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  utilizadorId: {
    type: Sequelize.INTEGER,
    references: {
      model: Utilizador,
      key: 'id'
    },
    allowNull: false
  }
});

Empreendimento.belongsTo(Utilizador, {foreignKey: 'utilizadorId' });
module.exports = Empreendimento;
