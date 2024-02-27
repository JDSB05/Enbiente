const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')



const TopicoIdeia = sequelize.define('TopicoIdeia', {
    NTopicoIdeia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeTopico: {
        type: DataTypes.STRING,
        allowNull: false
    }
     
},{ timestamps: false});

module.exports = TopicoIdeia;