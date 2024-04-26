const Utilizador = require("../models/utilizador.model");
const Cargo = require("../models/cargo.model");
const TipoCliente = require("../models/tipocliente.model");
const Joi = require("joi");
const jwt = require('jsonwebtoken')
const cache = require("../config/cache");
const passport = require("passport");



// Controller for creating a new Utilizador
const createUtilizador = async (req, res) => {
  try {
    // Extract data from request body
    const { nome, email, password, cargo_id, tipo_cliente_id, primeiroLogin, ultimoLogin, estado, telemovel } = req.body;

    // Create a new Utilizador instance
    const utilizador = await Utilizador.create({
      nome,
      email,
      password,
      cargo_id,
      tipo_cliente_id,
      primeiroLogin,
      ultimoLogin,
      estado,
      telemovel
    });

    // Send the created Utilizador object as response
    res.status(201).json(utilizador);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: "Failed to create Utilizador" });
  }
};

// Controller for getting all Utilizadors
const getAllUtilizadores = async (req, res) => {
  try {
    // Retrieve the orderby parameter from the query string
    const orderby = req.query.orderby;
    const utilizador_id = req.query.utilizador_id;

    // Set the order option based on the orderby parameter
    const order = orderby === 'ASC' ? 'DESC' : 'ASC';

    // Set the where condition based on the utilizador_id parameter
    const where = utilizador_id ? { utilizador_id } : {};

    // Retrieve all Utilizadors from the database with the specified order and where condition
    const utilizadores = await Utilizador.findAll({
      attributes: { exclude: ['password', 'TokenEmail'] },
      order: [['utilizador_id', order]],
      where
    });

    // Send the Utilizadors as response
    res.json(utilizadores);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Utilizadores" });
  }
};

// Controller for getting a single Utilizador by ID
const getUtilizadorById = async (req, res) => {
  try {
    // Extract Utilizador ID from request parameters
    const { id } = req.params;
    const user = req.user;

    // Find the Utilizador by ID´
    if (user.cargo_id == 1 || user.utilizador_id == id) {
      const utilizador = await Utilizador.findByPk(id, {
        attributes: { exclude: ['password', 'TokenEmail'] }
      })

      // Check if Utilizador exists
      if (!utilizador) {
        return res.status(404).json({ error: "Utilizador not found" });
      }

      // Send the Utilizador as response
      res.json(utilizador);
    } else {
      return res.status(401).json({ error: "Não está autorizado para obter informação de contas alheias" });
    }
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Utilizador" });
  }
};

const updateUtilizador = async (req, res) => {
  const schema = Joi.object({
    telemovel: Joi.string().allow('').allow(null).optional(),
    cargo_id: Joi.number().allow(null).optional(),
    foto: Joi.string().allow('').allow(null).optional(),
    nome: Joi.string().required().optional(),
    tipo_cliente_id: Joi.number().allow(null).optional()
  });
 
  try {
    const { utilizador_id } = req.params;
    const { cargo_id: newCargo_id } = req.body;
    const { cargo_id: utilizadorCargoId, utilizador_id: utilizadorAuthId } = req.user;
    
 

    // Validate request body against schema
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send({
        success: false,
        message: "Erro de validação: " + validationResult.error.details[0].message
      });
    }

    const utilizador = await Utilizador.findOne({ where: { utilizador_id } });
    if (!utilizador) {
      return res.status(404).send({
        success: false,
        message: `Impossível encontrar o utilizador de ID: ${utilizador_id}.`
      });
    }

    if (newCargo_id !== undefined && utilizadorCargoId !== 1 && newCargo_id !== utilizadorCargoId) {
      return res.status(401).send({
        success: false,
        message: "Apenas os administradores podem alterar o campo cargo_id."
      });
    }

    if(utilizadorCargoId !== 1 && utilizador_id != utilizadorAuthId)
    {
      return res.status(401).send({
        success: false,
        message: "Não tem permissão para alterar uma conta alheia."
      });

    }

    for (const field in req.body) {
      utilizador[field] = req.body[field];
    }

    await utilizador.save();

    cache.del(utilizador_id)
    res.send({
      success: true,
      message: "Utilizador atualizado com sucesso."
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Erro ao atualizar o utilizador: ${error}`
    });
    console.error(error);
  }
};




module.exports = {
  createUtilizador,
  getAllUtilizadores,
  getUtilizadorById,
  updateUtilizador
};