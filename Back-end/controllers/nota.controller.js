const Nota = require("../models/nota.model");
const Usuario = require("../models/usuarios.model")
//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Nota
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  console.log(req.body);
  // Criar Novo Nota

  // Criar novo nota na base de dados
  try {
    const nota = await Nota.create(req.body);
    const data = await nota.reload({ include: [Usuario] })
    res.send({
      success: true,
      message: data
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro ao criar nota: " + error
    });
  }
};

// Get all Notas
exports.getAll = async (req, res) => {

  const nentrevista = req.query.nentrevista;
  try {
    let nota
    if(nentrevista)
    
       nota = await Nota.findAll(
        {
          where : {NEntrevista : nentrevista}, 
          include: [{
            model: Usuario,
            attributes: ['Nome'],
            required: true
          }],
          
        }
      )
    
    else

    nota = await Nota.findAll(
      {
        include: [{
          model: Usuario,
          attributes: ['Nome'],
          required: true
        }],
        
      }
    )
    
   
    // console.log("Notas: ", nota);
    res.send({
      success: true,
      message: nota
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao obter nota"
    });
  }
};

// Get a Nota by ID
exports.getById = async (req, res) => {
  try {
    const nota = await Nota.findByPk(req.params.nnota,
      {
        include: [{
          model: Usuario,
          attributes: ['Nome'],
          required: true
        }]
      });
    if (nota) {
      console.log("Nota encontrado: ", nota);
      res.send({
        success: true,
        message: nota
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Nota não encontrada com o ID: " + req.params.nnota
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao encontrar nota"
    });
  }
};

// Delete a Nota by ID
exports.delete = async (req, res) => {
  const nnota = req.params.nnota;
  try {
    const result = await Nota.destroy({ where: { NNota: nnota } });
    if (result === 0) {
      res.status(404).send({
        success: false,
        message: "Nota não encontrada com o ID: " + nnota
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Nota apagada com o ID: ${nnota}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao apagar nota"
    });
  }
}
// Update a Nota by ID
exports.updateById = async (req, res) => {
  const nnota = req.params.nnota;
  // Validate Request
  if (!req.body) {
      res.status(400).send({
          sucess: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
  console.log(req.body);
  const result = await Nota.update(req.body, { where: { NNota: nnota } });
  try {
      if (result[0] === 0) {
          res.status(404).send({
            success: false,
              message: `Impossível encontrar a nota de id: ${nnota}.`
          });
      } else {
          res.send({
              success: true,
              message: "Nota atualizada com sucesso!"
          });
      }
  } catch (error) {
      res.status(500).send({
          success: false,
          message: `Erro ao atualizar nota: ${error}`
      });
  }
}
