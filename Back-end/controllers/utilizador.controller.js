const Utilizador = require("../models/utilizador.model");
const Cargo = require("../models/cargo.model");
const TipoCliente = require("../models/tipocliente.model");

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

    // Find the Utilizador by ID
    const utilizador = await Utilizador.findByPk(id, {
      attributes: { exclude: ['password', 'TokenEmail'] }
    });

    // Check if Utilizador exists
    if (!utilizador) {
      return res.status(404).json({ error: "Utilizador not found" });
    }

    // Send the Utilizador as response
    res.json(utilizador);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Utilizador" });
  }
};

// Controller for updating a Utilizador by ID
const updateUtilizador = async (req, res) => {
  try {
    // Extract Utilizador ID from request parameters
    const { id } = req.params;

    // Find the Utilizador by ID
    const utilizador = await Utilizador.findByPk(id);

    // Check if Utilizador exists
    if (!utilizador) {
      return res.status(404).json({ error: "Utilizador not found" });
    }

    // Extract updated data from request body
    const { nome, cargo_id, tipo_cliente_id, telemovel, foto } = req.body;

    // Update the Utilizador
    await utilizador.update({
      nome,
      cargo_id,
      tipo_cliente_id,
      telemovel,
      foto
    });

    // Send the updated Utilizador as response
    res.json(utilizador);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: "Failed to update Utilizador" });
  }
};



module.exports = {
  createUtilizador,
  getAllUtilizadores,
  getUtilizadorById,
  updateUtilizador
};