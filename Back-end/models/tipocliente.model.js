const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../config/sequelize");

const TipoCliente = sequelize.define('TipoCliente', {
    tipo_cliente_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tipo_cliente: { type: DataTypes.STRING, allowNull: false }
});

module.exports = TipoCliente;