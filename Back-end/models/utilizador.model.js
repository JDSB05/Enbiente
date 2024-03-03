const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Cargo = require("./cargo.model");
const TipoCliente = require("./tipocliente.model");

const Utilizador = sequelize.define('Utilizador', {
  utilizador_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  cargo_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Cargo, key: 'cargo_id' } },
  tipo_cliente_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: TipoCliente, key: 'tipo_cliente_id' } },
  primeiroLogin: { type: DataTypes.DATE, allowNull: false },
  ultimoLogin: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.STRING, allowNull: false },
  telemovel: { type: DataTypes.STRING, allowNull: false }
});

// Definindo a associação com o modelo Cargo
Utilizador.belongsTo(Cargo, {
  foreignKey: 'cargo_id',
});
// Definindo a associação com o modelo TipoCliente
Utilizador.belongsTo(TipoCliente, 
  { foreignKey: 'tipo_cliente_id',
});

module.exports = Utilizador;
