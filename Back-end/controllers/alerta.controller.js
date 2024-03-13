const Alerta = require('../models/alerta.model');
const Casa = require('../models/casa.model');
// GET all alertas
const getAllAlertas = async (req, res) => {
  try {
    const alertas = await Alerta.findAll();
    res.json(alertas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET a single alerta by ID
const getAlertaById = async (req, res) => {
  const { id } = req.params;
  try {
    const alerta = await Alerta.findByPk(id);
    if (!alerta) {
      return res.status(404).json({ message: 'Alerta not found' });
    }
    res.json(alerta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST a new alerta
const createAlerta = async (req, res) => {
  const { casa_id, tipo_alerta, mensagem_alerta, data_alerta, estado } = req.body;
  try {
    const casa = await Casa.findByPk(casa_id);
    if (!casa) {
      return res.status(404).json({ message: 'Casa not found' });
    }
    const alerta = await Alerta.create({ casa_id, tipo_alerta, mensagem_alerta, data_alerta, estado });
    res.status(201).json(alerta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT update an existing alerta
const updateAlerta = async (req, res) => {
  const { id } = req.params;
  const { casa_id, tipo_alerta, mensagem_alerta, data_alerta, estado } = req.body;
  try {
    const alerta = await Alerta.findByPk(id);
    if (!alerta) {
      return res.status(404).json({ message: 'Alerta not found' });
    }
    await alerta.update({ casa_id, tipo_alerta, mensagem_alerta, data_alerta, estado });
    res.json(alerta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE an alerta
const deleteAlerta = async (req, res) => {
  const { id } = req.params;
  try {
    const alerta = await Alerta.findByPk(id);
    if (!alerta) {
      return res.status(404).json({ message: 'Alerta not found' });
    }
    await alerta.destroy();
    res.json({ message: 'Alerta deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllAlertas,
  getAlertaById,
  createAlerta,
  updateAlerta,
  deleteAlerta
};