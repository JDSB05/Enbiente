const Reunioes = require("../models/reunioes.model");
//const Joi = require('joi');
//const Boom = require('@hapi/boom');

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }

  // Criar Novo Reunioes

  // Criar novo reunioes na base de dados
  try {
    if(!req.body.Titulo)
    {
      req.body.Titulo = req.body.Tipo === 0 ? "Reunião sobre entrevista" : "Reunião sobre oportunidade"
    }
    const data = await Reunioes.create(req.body);
    res.send({
      success: true,
      message: data
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "erro: " + error
    });
  }
};

// Get all Reunioess
exports.getAll = async (req, res) => {
  try {
    const reunioess = await Reunioes.findAll();
    res.send({
      success: true,
      message: reunioess
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao obter reunioess"
    });
  }
};

// Get a Reunioes by ID
exports.getById = async (req, res) => {
  try {
    const reunioes = await Reunioes.findByPk(req.params.nreuniao);
    if (reunioes) {
      console.log("Reunioes encontrado: ", reunioes);
      res.send({
        success: true,
        message: reunioes
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Reunioes não encontrado de id: " + req.params.reuniao
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao encontrar reunioes"
    });
  }
};

// Delete a Reunioes by ID
exports.delete = async (req, res) => {
  const reuniao = req.params.nreuniao;
  try {
    const result = await Reunioes.destroy({ where: { NReunioes: reuniao } });
    if (result === 0) {
      res.status(404).send({
        success: false,
        message: "Reunioes não encontrado de id: " + reuniao
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Reunioes apagado de id: ${reuniao}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao apagar reunioes"
    });
  }
};

// Update a Reunioes by ID
exports.updateById = async (req, res) => {
  const reuniao = req.params.nreuniao;
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }
  console.log(req.body);
  const result = await Reunioes.update(req.body, { where: { NReunioes: reuniao } });
  try {
    if(!req.body.Titulo)
    {
      req.body.Titulo = req.body.Tipo === 0 ? "Reunião sobre entrevista" : "Reunião sobre oportunidade"
    }
    if (result[0] === 0) {
      res.status(404).send({
        success: false,
        message: `Impossível encontrar o reunioes de id: ${reuniao}.`
      });
    } else {
      res.send({
        success: true,
        message: "Reunioes atualizado com sucesso"
      })
      }
     } catch (error) {
        res.status(500).send({
          success: false,
            message: `Erro ao atualizar reunioes: ${error} ` 
        })
      }
    }