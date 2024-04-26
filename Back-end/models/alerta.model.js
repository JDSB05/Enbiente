const { Sequelize } = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Casa = require("./casa.model"); // Import the Casa model

const Alerta = sequelize.define('Alerta', {
    alerta_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    casa_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Casa, key: 'casa_id' } },
    tipo_alerta: { type: DataTypes.STRING, allowNull: false },
    mensagem_alerta: { type: DataTypes.STRING, allowNull: false },
    data_alerta: { type: DataTypes.DATE, allowNull: false },
    estado: { type: DataTypes.BOOLEAN, allowNull: false }
}, { 
    timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
  });

Alerta.belongsTo(Casa, { foreignKey: 'casa_id' });
Casa.hasMany(Alerta, { foreignKey: 'casa_id' });
module.exports = Alerta;
