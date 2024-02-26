var Sequelize = require('sequelize');
var sequelize = require('./database');
var Perfil = require('./Perfil');
const bcrypt = require('bcrypt'); 

var Utilizador = sequelize.define('utilizador', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  img: {
    type: Sequelize.STRING(500),
    allowNull: true
  },
  username: {
    type: Sequelize.STRING(15),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  primNome: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  ultNome: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  telemovel: {
    type: Sequelize.STRING(12),
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  nascimento: {
    type: Sequelize.DATE,
    allowNull: false
  },
  morada: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  primeiroLogin: {
    type: Sequelize.DATE,
    allowNull: true
  },
  ultimoLogin: {
    type: Sequelize.DATE,
    allowNull: true
  },
  passwordAlteradaEm: {
    type: Sequelize.DATE,
    allowNull: false
  },
  estado: {
    type: Sequelize.STRING,
    validate: {
      isIn: [['Ativa', 'Por Verificar', 'Inativa', 'Bloqueada']]
    },
    allowNull: false,
    defaultValue: 'Por Verificar',
  },
  perfilId: {
    type: Sequelize.INTEGER,
    references: {
      model: Perfil,
      key: 'id'
    },
    allowNull: false
  }
});

Utilizador.beforeCreate(async (utilizador, options) => {
  try {
    const hash = await bcrypt.hash(utilizador.password, 10);
    utilizador.password = hash;
  } catch (err) {
    throw new Error();
  }
});

Utilizador.belongsTo(Perfil, { foreignKey: 'perfilId' });
module.exports = Utilizador;
