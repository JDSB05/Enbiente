const Candidatura = require("../models/candidaturas.model");
const Vaga = require('../models/vagas.model');
const Usuario = require('../models/usuarios.model')

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Candidatura
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  console.log(req.body);
  // Criar Novo Candidatura

  // Criar novo candidatura na base de dados
  try {
    const candidaturaExistente = await Candidatura.findOne(
      {
        where: {NUsuario: req.body.NUsuario, NVaga: req.body.NVaga, Estado: 1}
      })

      if(candidaturaExistente)
      res.status(403).send(
        {
          success: false,
          message: "Um usuário não pode se candidatar a mesma vaga mais de uma vez"
        }
      )

    const candidatura = await Candidatura.create(req.body);
    const data = await candidatura.reload({ include: [Usuario, Vaga] });
    res.send({
      success: true,
      message: data
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao criar candidatura: " + error
    });
  }
};

// Get all Candidaturas
exports.getAll = async (req, res) => {

  const estado = req.query.estado;
  if(!req.query.NUsuario)
  {
    try {
      const candidaturas = await Candidatura.findAll(
        {
          where: estado === '1' ? { Estado: 1 } : {},
          include: [
            {
              model: Usuario,
              attributes: ['Nome', 'Email']
            },
            {
              model: Vaga,
              attributes: ['NomeVaga', 'Subtitulo']
            }
          ],
          order: [['DataCandidatura', 'DESC']]
        },
        
      );
      // console.log("Candidaturas: ", candidaturas);
      res.send({
        success: true,
        message: candidaturas
      });
    } catch (err) {
      console.log("error: ", err);
      res.status(500).send({
        success: false,
        message: "Erro ao obter candidaturas"
      });
    }

  }
  else
  {
    try {
      const candidaturas = await Candidatura.findAll(
        {
          where: { NUsuario : req.query.NUsuario},
          include: [
            {
              model: Usuario,
              attributes: ['Nome', 'Email']
            },
            {
              model: Vaga,
              attributes: ['NomeVaga', 'Subtitulo']
            }
          ]
        }
      );
      // console.log("Candidaturas: ", candidaturas);
      res.send({
        success: true,
        message: candidaturas
      });
    } catch (err) {
      console.log("error: ", err);
      res.status(500).send({
        success: false,
        message: "Erro ao obter candidaturas"
      });
    }

  }
 
};

// Get a Candidatura by ID
exports.getById = async (req, res) => {
  try {
    const candidatura = await Candidatura.findByPk(req.params.ncandidatura,
      {
        include: [
          {
            model: Usuario,
            attributes: ['Nome', 'Email']
          },
          {
            model: Vaga,
            attributes: ['NomeVaga', 'Subtitulo']
          }
        ]
      });
    if (candidatura) {
      console.log("Candidatura encontrado: ", candidatura);
      res.send({
        success: true,
        message: candidatura,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Candidatura não encontrada com o ID: " + req.params.ncandidatura
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao encontrar candidatura"
    });
  }
};

// Delete a Candidatura by ID
exports.delete = async (req, res) => {
  const ncandidatura = req.params.ncandidatura;
  try {
    const result = await Candidatura.destroy({ where: { NCandidatura: ncandidatura } });
    if (result === 0) {
      res.status(404).send({
        success: false,
        message: "Candidatura não encontrada com o ID: " + ncandidatura
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Candidatura apagada com o ID: ${ncandidatura}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao apagar candidatura"
    });
  }
}
// Update a Candidatura by ID
exports.updateById = async (req, res) => {
  const ncandidatura = req.params.ncandidatura;
  // Validate Request
  if (!req.body) {
      res.status(400).send({
          sucess: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
  console.log(req.body);
  const result = await Candidatura.update(req.body, { where: { NCandidatura: ncandidatura } });
  try {
      if (result[0] === 0) {
          res.status(404).send({
            success: false,
              message: `Impossível encontrar a candidatura de id: ${ncandidatura}.`
          });
      } else {
          res.send({
              success: true,
              message: "Candidatura atualizado com sucesso!"
          });
      }
  } catch (error) {
      res.status(500).send({
          success: false,
          message: `Erro ao atualizar candidatura: ${error}`
      });
  }
}






