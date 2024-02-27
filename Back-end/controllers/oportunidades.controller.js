const Oportunidade = require("../models/oportunidades.model");

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Oportunidade
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  console.log(req.body);
  // Criar Novo Oportunidade

  // Criar novo oportunidade na base de dados
  try {
    const oportunidade = await Oportunidade.create(req.body);
    res.send({
      success: true,
      message: oportunidade
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao criar oportunidade: " + error
    });
  }
};

// Get all Oportunidades
exports.getAll = async (req, res) => {

  try {
    const oportunidades = await Oportunidade.findAll();
    // console.log("Oportunidades: ", oportunidades);
    res.send({
      success: true,
      message: oportunidades
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao obter oportunidades"
    });
  }
};

// Get a Oportunidade by ID
exports.getById = async (req, res) => {
  try {
    const oportunidade = await Oportunidade.findByPk(req.params.noportunidade);
    if (oportunidade) {
      console.log("Oportunidade encontrado: ", oportunidade);
      res.send({
        success: true,
        message: oportunidade,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Oportunidade não encontrada com o ID: " + req.params.noportunidade
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao encontrar oportunidade"
    });
  }
};

// Delete a Oportunidade by ID
exports.delete = async (req, res) => {
  const noportunidade = req.params.noportunidade;
  try {
    const result = await Oportunidade.destroy({ where: { NOportunidade: noportunidade } });
    if (result === 0) {
      res.status(404).send({
        success: false,
        message: "Oportunidade não encontrada com o ID: " + noportunidade
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Oportunidade apagada com o ID: ${noportunidade}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao apagar oportunidade"
    });
  }
}
// Update a Oportunidade by ID
exports.updateById = async (req, res) => {
  const noportunidade = req.params.noportunidade;
  // Validate Request
  if (!req.body) {
      res.status(400).send({
          sucess: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
  const result = await Oportunidade.update(req.body, { where: { NOportunidade: noportunidade } });
  try {
      if (result[0] === 0) {
          res.status(404).send({
            success: false,
              message: `Impossível encontrar o oportunidade de id: ${noportunidade}.`
          });
      } else {
          res.send({
              success: true,
              message: "Oportunidade atualizada com sucesso!"
          });
      }
  } catch (error) {
      res.status(500).send({
          success: false,
          message: `Erro ao atualizar oportunidade: ${error}`
      });
  }
}
