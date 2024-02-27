const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const Usuario = require("./usuarios.model")
const Reunioes = require("./reunioes.model")

const UsuarioReunioes = sequelize.define('UsuarioReunioes', {
    NUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:
        {
            model: 'Usuario',
            key: 'NUsuario'
        }
    },
    NReunioes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:
        {
            model: 'Reunioes',
            key: 'NReunioes'
        }
    }
     
},{ timestamps: false});

module.exports = UsuarioReunioes;