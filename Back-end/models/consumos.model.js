const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Casa = require("./casa.model"); // Import the Casa model


const Consumo = sequelize.define('Consumo', {
    consumo_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    casa_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Casa, key: 'casa_id' } },
    data_consumo: { type: DataTypes.DATE, allowNull: false },
    volume_consumido: { type: DataTypes.FLOAT, allowNull: false },
    valor: { type: DataTypes.FLOAT, allowNull: false }
}, { 
    timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
  });

// Define the association between Consumo and Casa
Consumo.belongsTo(Casa, { foreignKey: 'casa_id' });
Casa.hasMany(Consumo, { foreignKey: 'casa_id' }); // Add this line to define the association between Casa and Consumo

module.exports = Consumo;


