const sequelize = require("../config/sequelize");
const { Model, DataTypes } = require('sequelize');

const Cargo = sequelize.define('Cargo', {
    cargo_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cargo: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Cargo;
