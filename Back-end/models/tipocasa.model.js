const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../config/sequelize");

const TipoCasa = sequelize.define('TipoCasa', {
    tipo_casa_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tipo_casa: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
  });

  const createDefaultTipoCasa = async () => {
    try {
      await TipoCasa.bulkCreate([
        { tipo_casa: "Convencional" },
        { tipo_casa: "Eficiente" },
        { tipo_casa: "Ecológica" },
        { tipo_casa: "Autossufiente" }
      ]);
      console.log('Registros padrão criados com sucesso.');
    } catch (error) {
      console.error('Erro ao criar registros padrão:', error);
    }
  };
  
  TipoCasa.afterSync(() => {
    TipoCasa.count().then(count => {
      if (count === 0) {
        createDefaultTipoCasa();
      }
    });
  });
module.exports = TipoCasa;