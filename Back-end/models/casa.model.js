const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../config/sequelize");
const Utilizador = require("./utilizador.model"); // Import the Utilizador model
const TipoCasa = require('./tipocasa.model');

const Casa = sequelize.define('Casa', {
    casa_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    utilizador_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Utilizador, key: 'utilizador_id' } },
    nome: { type: DataTypes.STRING, allowNull: false },
    endereco: { type: DataTypes.STRING, allowNull: false },
    pessoas: { type: DataTypes.INTEGER, allowNull: false },
    tipo_casa_id: { type: DataTypes.INTEGER, allowNull: false,  references: { model: TipoCasa, key: 'tipo_casa_id' }  },
    precopormetro: { type: DataTypes.FLOAT, allowNull: true },
    data_criacao: { type: DataTypes.DATE, allowNull: false },
    data_ultalteracao: { type: DataTypes.DATE, allowNull: false },
}, { 
    timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
  });

Casa.belongsTo(Utilizador, { foreignKey: 'utilizador_id' });
Utilizador.hasMany(Casa, { foreignKey: 'utilizador_id' });
Casa.belongsTo(TipoCasa, 
  { foreignKey: 'tipo_casa_id',
});
module.exports = Casa;