const Beneficio = require("../models/beneficio.model");
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

  // Criar Novo Beneficio

  // Criar novo beneficio na base de dados
  try {
    const data = await Beneficio.create(req.body);
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

// Get all Beneficios
exports.getAll = async (req, res) => {
  try {
    const beneficios = await Beneficio.findAll();
    res.send({
      success: true,
      message: beneficios
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao obter beneficios"
    });
  }
};

// Get a Beneficio by ID
exports.getById = async (req, res) => {
  try {
    const beneficio = await Beneficio.findByPk(req.params.nbeneficio);
    if (beneficio) {
      console.log("Beneficio encontrado: ", beneficio);
      res.send({
        success: true,
        message: beneficio
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Beneficio não encontrado de id: " + req.params.nbeneficio
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao encontrar beneficio"
    });
  }
};

// Delete a Beneficio by ID
exports.delete = async (req, res) => {
  const nbeneficio = req.params.nbeneficio;
  try {
    const result = await Beneficio.destroy({ where: { NBeneficio: nbeneficio } });
    if (result === 0) {
      res.status(404).send({
        success: false,
        message: "Beneficio não encontrado de id: " + nbeneficio
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Beneficio apagado de id: ${nbeneficio}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao apagar beneficio"
    });
  }
};

// Update a Beneficio by ID
exports.updateById = async (req, res) => {
  const nbeneficio = req.params.nbeneficio;
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }
  console.log(req.body);
  const result = await Beneficio.update(req.body, { where: { NBeneficio: nbeneficio } });
  try {
    if (result[0] === 0) {
      res.status(404).send({
        success: false,
        message: `Impossível encontrar o beneficio de id: ${nbeneficio}.`
      });
    } else {
      res.send({
        success: true,
        message: "Beneficio atualizado com sucesso"
      })
      }
     } catch (error) {
        res.status(500).send({
          success: false,
            message: `Erro ao atualizar beneficio: ${error} ` 
        })
      }
    }