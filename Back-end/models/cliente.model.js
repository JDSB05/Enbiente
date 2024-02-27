const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')



const Clientes = sequelize.define('Clientes', {
    NCliente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeEmp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    EmailEmp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
     
},{ timestamps: false});

module.exports = Clientes;