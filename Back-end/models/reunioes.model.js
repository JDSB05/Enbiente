const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Usuario = require("../models/usuarios.model")
const Reunioes = sequelize.define('Reunioes', {
    NReunioes: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NUsuarioCriador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'NUsuario'
        }
    },
    Titulo:
    {
        type: DataTypes.STRING,
        allowNull: true
    },
    Tipo: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    DataHora: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

module.exports = Reunioes