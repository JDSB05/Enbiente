const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../config/sequelize");

const TipoCasa = sequelize.define('TipoCasa', {
    tipo_casa_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tipo_casa: { type: DataTypes.STRING, allowNull: false },
    fator: { type: DataTypes.FLOAT, allowNull: false }
}, { 
    timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
  });

  const createDefaultTipoCasa = async () => {
    try {
      await TipoCasa.bulkCreate([
        { tipo_casa: "Convencional", fator: 1.0},
        { tipo_casa: "Eficiente", fator: 0.8},
        { tipo_casa: "Ecológica", fator: 0.6},
        { tipo_casa: "Autossufiente", fator: 0.4}
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