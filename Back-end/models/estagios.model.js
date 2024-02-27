const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Estagios = sequelize.define('Estagios', {
    NEstagio: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    OrdemOPort: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

module.exports = Estagios