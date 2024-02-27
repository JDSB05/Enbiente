const Vaga = require("../models/vagas.model");
const Localidade = require('../models/localidade.model');
const TipoVaga = require('../models/tipovaga.model');

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Vaga
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  console.log(req.body);
  // Criar Novo Vaga

  // Criar novo vaga na base de dados
  try {
    const vaga = await Vaga.create(req.body);
    const data = await vaga.reload({ include: [Localidade, TipoVaga] });
    res.send(
      {
        success: true,
        message: data
      }
    );
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro: " + error
    });
  }

};
exports.getAll = async (req, res) => {
  const estado = req.query.estado;

  try {
    const vagas = await Vaga.findAll({
      where: estado === '1' ? { Estado: 1 } : {},
      include: [
        { model: Localidade, attributes: ['Localidade'] },
        { model: TipoVaga, attributes: ['NomeTipoVaga'] }
      ]
    });

    res.send({ success: true, message: vagas });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send({
      success: false,
      message: `Erro ao obter vagas: ${err}`
    });
  }
};

// Get a Vaga by ID
exports.getById = async (req, res) => {
  try {
    const vaga = await Vaga.findByPk(req.params.nvaga,
      {
        include: [
          {
            model: Localidade,
            attributes: ['Localidade']
          },
          {
            model: TipoVaga,
            attributes: ['NomeTipoVaga']
          }
        ]
      });
    if (vaga) {
      console.log("Vaga encontrada: ", vaga);
      res.send({
        success: true,
        message: vaga
      })
    } else {
      res.status(404).send(
        {
          success: false,
          message: "Vaga não encontrada de id: " + req.params.nvaga
        }
      )
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send(
      {
        success: false,
        message: "Erro ao encontrar vaga de nvaga: " + req.params.nvaga
      }
    )
  }
};

// Delete a Vaga by ID
exports.delete = async (req, res) => {
  const nvaga = req.params.nvaga;
  try {
    const result = await Vaga.destroy({ where: { NVaga: nvaga } });
    if (result === 0) {
      res.status(404).send(
        {
          message: "Vaga não encontrada de id: " + nvaga,
          success: false
        })

    } else {
      res.status(200).send(
        {
          success: true,
          message: `Vaga apagada de id: ${nvaga}`
        })
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send(
      {
        success: false,
        message: `Erro ao apagar vaga: ${err}`
      })
  }
};

// Update a Vaga by ID
exports.updateById = async (req, res) => {
  const nvaga = req.params.nvaga
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }
  console.log(req.body);
  const result = await Vaga.update(req.body, { where: { NVaga: nvaga } });
  try {
    if (result[0] === 0) {
      res.status(404).send({
        success: false,
        message: `Impossível encontrar a vaga de id: ${nvaga}.`
      });
    } else {
      res.send({
        success: true,
        message: "Vaga atualizada com successo!"
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Erro ao atualizar vaga: ${error} `
    })
  }
}

