const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");


const Etiquetas = require("../models/etiquetas.model")
const Estagios = require("../models/estagios.model")
const Reunioes = require("../models/reunioes.model")
const Clientes = require("../models/cliente.model")

const Oportunidade = sequelize.define('Oportunidade', {
  NOportunidade: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  Titulo: {
      type: DataTypes.STRING,
      allowNull: false
  },
  Valor: {
      type: DataTypes.STRING,
      allowNull: true
  },
  Descricao: {
      type: DataTypes.TEXT,
      allowNull: true
  },
  NEtiqueta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Etiquetas',
          key: 'NEtiqueta'
      }
  },
  NEstagio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Estagios',
          key: 'NEstagio'
      }
  },
  NCliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: 'Clientes',
        key: 'NCliente'
    }
  }
}, { 
timestamps: false,
freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
getters: true // Adicionando a opção getters: true para definir getters virtuais

});

// Definindo a associação com o modelo Clientes
Oportunidade.belongsTo(Clientes, {
foreignKey: 'NCliente'
});

// Definindo a associação com o modelo Estagios
Oportunidade.belongsTo(Estagios, {
foreignKey: 'NEstagio'
});

// Definindo a associação com o modelo Etiquetas
Oportunidade.belongsTo(Etiquetas, {
    foreignKey: 'NEtiqueta'
    });
/*
Oportunidade.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
  
    // Removendo as propriedades dos modelos associados
    delete values.Localidade;
    delete values.TipoOportunidade;
  
    // Incluindo as propriedades das associações diretamente no objeto
    values.Localidade = this.Localidade.Localidade;
    values.TipoOportunidade = this.TipoOportunidade.NomeTipoOportunidade;
  
    return values;
  };
*/
module.exports = Oportunidade;