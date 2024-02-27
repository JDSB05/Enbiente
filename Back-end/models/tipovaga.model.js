const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const TipoVaga = sequelize.define('TipoVaga', {
    NTipoVaga: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeTipoVaga: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

module.exports = TipoVaga;