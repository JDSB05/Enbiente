const Cargo = require("../models/cargo.model");

// Create a new cargo
const createCargo = async (req, res) => {
  if (req.user.cargo_id !== 1) {
    console.log("Não autorizado")
    return res.status(401).json({ error: "Não autorizado" })}
  try {
    const cargo = await Cargo.create(req.body);
    res.status(201).json(cargo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cargo" });
  }
};

// Get all cargos
const getAllCargos = async (req, res) => {
  try {
    const cargos = await Cargo.findAll();
    res.status(200).json(cargos);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cargos" });
  }
};

// Get a single cargo by ID
const getCargoById = async (req, res) => {
  const { id } = req.params;
  if (req.user.cargo_id !== 1) {
    console.log("Não autorizado")
    return res.status(401).json({ error: "Não autorizado" })}
  try {
    const cargo = await Cargo.findByPk(id);
    if (!cargo) {
      return res.status(404).json({ error: "Cargo not found" });
    }
    res.status(200).json(cargo);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cargo" });
  }
};

// Update a cargo by ID
const updateCargo = async (req, res) => {
  if (req.user.cargo_id !== 1) {
    console.log("Não autorizado")
    return res.status(401).json({ error: "Não autorizado" })}
  const { id } = req.params;
  try {
    const [updated] = await Cargo.update(req.body, {
      where: { cargo_id: id },
    });
    if (updated) {
      const updatedCargo = await Cargo.findByPk(id);
      return res.status(200).json(updatedCargo);
    }
    throw new Error("Cargo not found");
  } catch (error) {
    res.status(500).json({ error: "Failed to update cargo" });
  }
};

// Delete a cargo by ID
const deleteCargo = async (req, res) => {
  if (req.user.cargo_id !== 1) {
    console.log("Não autorizado")
    return res.status(401).json({ error: "Não autorizado" })}
  const { id } = req.params;
  try {
    const deleted = await Cargo.destroy({
      where: { cargo_id: id },
    });
    if (deleted) {
      return res.status(204).json({ message: "Cargo deleted" });
    }
    throw new Error("Cargo not found");
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cargo" });
  }
};

module.exports = {
  getAllCargos,
  getCargoById,
  createCargo,
  updateCargo,
  deleteCargo
};