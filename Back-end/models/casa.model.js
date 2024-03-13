const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../config/sequelize");
const Utilizador = require("./utilizador.model"); // Import the Utilizador model

const Casa = sequelize.define('Casa', {
    casa_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    utilizador_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Utilizador, key: 'utilizador_id' } },
    nome: { type: DataTypes.STRING, allowNull: false },
    endereco: { type: DataTypes.STRING, allowNull: false },
    tipo_casa: { type: DataTypes.STRING, allowNull: false },
    precopormetro: { type: DataTypes.FLOAT, allowNull: false },
    data_criacao: { type: DataTypes.DATE, allowNull: false },
    data_ultalteracao: { type: DataTypes.DATE, allowNull: false }
});

Casa.belongsTo(Utilizador, { foreignKey: 'utilizador_id' });
Utilizador.hasMany(Casa, { foreignKey: 'utilizador_id' });

module.exports = Casa;