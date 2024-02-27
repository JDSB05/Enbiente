const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const Ideia = require("./ideias.model")
const TopicoIdeia = require("./topicoidea.model")



const TopicosDaIdeia = sequelize.define('TopicosDaIdeia', {
    NTopicoIdeia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:
        {
            model: 'TopicoIdeia',
            key: 'NTopicoIdeia'
        }
    },
    NIdeia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:
        {
            model: 'Ideia',
            key: 'NIdeia'
        }
    }
     
},{ timestamps: false});

module.exports = TopicosDaIdeia;