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
  primeiroLogin: { type: DataTypes.DATE, allowNull: true },
  ultimoLogin: { type: DataTypes.DATE, allowNull: true },
  estado: { type: DataTypes.INTEGER, allowNull: false },
  telemovel: { type: DataTypes.STRING, allowNull: true },
  TokenEmail: { type: DataTypes.STRING, allowNull: true},
  foto:{ type: DataTypes.STRING, allowNull: true},
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

// Definindo a associação com o modelo Cargo
Utilizador.belongsTo(Cargo, {
  foreignKey: 'cargo_id',
});
// Definindo a associação com o modelo TipoCliente
Utilizador.belongsTo(TipoCliente, 
  { foreignKey: 'tipo_cliente_id',
});
const createDefaultUtilizador = async () => {
  try {
    await Utilizador.bulkCreate([
      { nome: "Administrador", email: "admin@exemplo.com", password: "$2a$10$Qy3XF/XTKbqe2gsvR8IsSe/crOSksqWTOwxQUtiIwDJBHLOrKlCXO", cargo_id: 1, tipo_cliente_id: 1, estado: 1 },
    ]);
    console.log('Default records created successfully.');
  } catch (error) {
    console.error('Error creating default records:', error);
  }
};

Utilizador.afterSync(() => {
  Utilizador.count().then(count => {
    if (count === 0) {
      createDefaultUtilizador();
    }
  });
});
module.exports = Utilizador;
