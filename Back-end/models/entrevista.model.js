const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const Candidatura = require('../models/candidaturas.model')
const Reunioes = require('../models/reunioes.model')


const Entrevista = sequelize.define('Entrevista', {
    NEntrevista: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NCandidatura: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Candidatura',
            key: 'NCandidatura'
        }
    },
    NReunioes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Reunioes',
            key: 'NReunioes'
        }
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Estado: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, { timestamps: false,   getters: true ,// Adicionando a opção getters: true para definir getters virtuais
freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela

});

Entrevista.belongsTo(Reunioes,
    { foreignKey: 'NReunioes',  as: 'Reunioes' }
)
Entrevista.belongsTo(Candidatura,
    { foreignKey: 'NCandidatura' }
)

Entrevista.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
      // Removendo as propriedades dos modelos associados
      delete values.Reunioes;

    // Incluindo as propriedades das associações diretamente no objeto
  
    if (this.Reunioes) {
        values.DataHoraReuniao = this.Reunioes.DataHora;
        values.TituloReuniao = this.Reunioes.Titulo
      }
      
    return values;
  };
module.exports = Entrevista;