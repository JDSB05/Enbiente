const Ideia = require("../models/ideias.model");
const Usuario = require('../models/usuarios.model')

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Ideia
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  console.log(req.body);
  // Criar Novo Ideia

  // Criar novo ideia na base de dados
  try {
    const ideia = await Ideia.create(req.body);
    const data = await ideia.reload({ include: [Usuario] });
    res.send({
      success: true,
      message: data
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao criar ideia: " + error
    });
  }
};

// Get all Ideias
exports.getAll = async (req, res) => {

  try {
    const ideias = await Ideia.findAll(
      {
        include: [
          {
            model: Usuario,
            attributes: ['Nome']
          }
        ]
      }
    );
    // console.log("Ideias: ", ideias);
    res.send({
      success: true,
      message: ideias
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao obter ideias"
    });
  }
};

// Get a Ideia by ID
exports.getById = async (req, res) => {
  try {
    const ideia = await Ideia.findByPk(req.params.nideia,
      {
        include: [
          {
            model: Usuario,
            attributes: ['Nome']
          }
        ]
      });
    if (ideia) {
      console.log("Ideia encontrado: ", ideia);
      res.send({
        success: true,
        message: ideia,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Ideia não encontrada com o ID: " + req.params.nideia
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao encontrar ideia"
    });
  }
};

// Delete a Ideia by ID
exports.delete = async (req, res) => {
  const nideia = req.params.nideia;
  try {
    const result = await Ideia.destroy({ where: { NIdeia: nideia } });
    if (result === 0) {
      res.status(404).send({
        success: false,
        message: "Ideia não encontrada com o ID: " + nideia
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Ideia apagada com o ID: ${nideia}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao apagar ideia"
    });
  }
}
// Update a Ideia by ID
exports.updateById = async (req, res) => {
  const nideia = req.params.nideia;
  // Validate Request
  if (!req.body) {
      res.status(400).send({
          sucess: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
  console.log(req.body);
  const result = await Ideia.update(req.body, { where: { NIdeia: nideia } });
  try {
      if (result[0] === 0) {
          res.status(404).send({
            success: false,
              message: `Impossível encontrar o ideia de id: ${nideia}.`
          });
      } else {
          res.send({
              success: true,
              message: "Ideia atualizada com sucesso!"
          });
      }
  } catch (error) {
      res.status(500).send({
          success: false,
          message: `Erro ao atualizar ideia: ${error}`
      });
  }
}





