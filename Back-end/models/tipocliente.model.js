const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../config/sequelize");

const TipoCliente = sequelize.define('TipoCliente', {
    tipo_cliente_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tipo_cliente: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
  });
  const createDefaultTipoCliente = async () => {
    try {
      await TipoCliente.bulkCreate([
        { tipo_cliente: "Particular" },
        { tipo_cliente: "Corporativo" }
      ]);
      console.log('Registros padrão criados com sucesso.');
    } catch (error) {
      console.error('Erro ao criar registros padrão:', error);
    }
  };
  
  TipoCliente.afterSync(() => {
    TipoCliente.count().then(count => {
      if (count === 0) {
        createDefaultTipoCliente();
      }
    });
  });
module.exports = TipoCliente;