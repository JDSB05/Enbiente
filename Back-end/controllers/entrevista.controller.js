const Entrevista = require("../models/entrevista.model");
const Candidatura = require("../models/candidaturas.model")
const Usuario = require("../models/usuarios.model")
const Vagas = require("../models/vagas.model")

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

const email_sender = require("../config/email-body");
const Reunioes = require("../models/reunioes.model");

// Create a new Entrevista
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        success: false,
        message: "Conteudo não pode estar vazio!"
      });
    }
    console.log(req.body);
    // Criar Novo Entrevista
  
    // Criar novo entrevista na base de dados
    try {
       // caso sucedida, enviaremos a convocatória ao candidato
       const cand = await Candidatura.findOne({where : {NCandidatura : req.body.NCandidatura }})
       if (!cand ) {
        return res.status(404).send({ message: "Candidatura não encontrada", success: false });
      }
       const user = await Usuario.findOne({ where: { NUsuario: cand.NUsuario } });
       if (!user ) {
        return res.status(404).send({ message: "Usuário não encontrado", success: false });
      }
       const vaga = await Vagas.findOne({where: {NVaga : cand.NVaga} })
   
      console.log( user.Email+ user.Nome + vaga.NomeVaga)
       email_sender.convocacaoEntrevista(user.Email, user.Nome, vaga.NomeVaga)
       
      const entrevista = await Entrevista.create(req.body);
      res.send({
        success: true,
        message: entrevista
      });
  
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Erro ao criar entrevista: " + error
      });
    }
  };

// Get all Entrevistas
exports.getAll = async (req, res) => {

  try {
    const entrevistas = await Entrevista.findAll(
     { include: [{
        model: Reunioes,
        as: 'Reunioes',
        attributes: ['DataHora', 'Titulo'],
        required: true
      }] }
    );
    // console.log("Entrevistas: ", entrevistas);
    res.send({
      success: true,
      message: entrevistas
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao obter entrevistas"
    });
  }
};

// Get a Entrevista by ID
exports.getById = async (req, res) => {
  try {
    const entrevista = await Entrevista.findByPk(req.params.nentrevista,
      { include: [{
        model: Reunioes,
        as: 'Reunioes',
        attributes: ['DataHora', 'Titulo'],
        required: true
      }] });
    if (entrevista) {
      console.log("Entrevista encontrada: ", entrevista);
      res.send({
        success: true,
        message: entrevista,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Entrevista não encontrada com o ID: " + req.params.nentrevista
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao encontrar entrevista"
    });
  }
};

// Delete a Entrevista by ID
exports.delete = async (req, res) => {
  const nentrevista = req.params.nentrevista;
  try {
    const result = await Entrevista.destroy({ where: { NEntrevista: nentrevista } });
    if (result === 0) {
      res.status(404).send({
        success: false,
        message: "Entrevista não encontrada com o ID: " + nentrevista
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Entrevista apagada com o ID: ${nentrevista}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao apagar entrevista"
    });
  }
}
// Update a Entrevista by ID
exports.updateById = async (req, res) => {
  const nentrevista = req.params.nentrevista;
  // Validate Request
  if (!req.body) {
      res.status(400).send({
          sucess: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
  console.log(req.body);
  const result = await Entrevista.update(req.body, { where: { NEntrevista: nentrevista } });
try {
  if (result[0] === 0) {
    const candidatura = await Entrevista.findOne({ where: { NEntrevista: nentrevista } });
    if (!candidatura) {
      res.status(404).send({
        success: false,
        message: `Impossível encontrar a entrevista de id: ${nentrevista}.`
      });
    } else {
      res.send({
        success: true,
        message: "Nenhum dado foi atualizado porque os valores são iguais."
      });
    }
  } else {
    res.send({
      success: true,
      message: "Entrevista atualizada com sucesso!"
    });
  }
} catch (error) {
  res.status(500).send({
    success: false,
    message: `Erro ao atualizar entrevista: ${error}`
  });
}
}