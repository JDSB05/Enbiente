const sequelize = require("../config/sequelize");
const { Model, DataTypes } = require('sequelize');

const Cargo = sequelize.define('Cargo', {
    cargo_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cargo: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
  });

module.exports = Cargo;
