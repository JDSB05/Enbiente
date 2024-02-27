const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const RelatorioIdeia = sequelize.define('RelatorioIdeia', {
    NRelatorioIdeia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Apontamentos: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    DataHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

module.exports = RelatorioIdeia