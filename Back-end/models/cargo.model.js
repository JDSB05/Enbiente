const sequelize = require("../config/sequelize");
const { Model, DataTypes } = require('sequelize');

const Cargo = sequelize.define('Cargo', {
    cargo_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cargo: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
  });

  const createDefaultCargos = async () => {
    try {
      await Cargo.bulkCreate([
        { cargo: "Administrador" },
        { cargo: "Utilizador" },
        { cargo: "Trabalhador" }
      ]);
      console.log('Registros padrão criados com sucesso.');
    } catch (error) {
      console.error('Erro ao criar registros padrão:', error);
    }
  };
  
  Cargo.afterSync(() => {
    Cargo.count().then(count => {
      if (count === 0) {
        createDefaultCargos();
      }
    });
  });
module.exports = Cargo;
