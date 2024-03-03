const Cargo = require("../models/cargo.model");

// Get all Cargos
exports.getAllCargos = async (_, res) => {
  try {
    const cargos = await Cargo.findAll();

    if (cargos.length === 0) {
      return res.send({ message: "Não existem cargos", success: true });
    }

    return res.send({ message: cargos, success: true });

  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({ message: "Erro ao obter cargos.", success: false });
  }
};

// Get a Cargo by ID
exports.getCargoById = async (req, res) => {
  try {
    const cargo = await Cargo.findByPk(req.params.cargo_id);

    if (cargo) {
      console.log("Cargo encontrado: ", cargo);
      return res.send({ message: cargo, success: true });
    } else {
      return res.status(404).send({ message: `Cargo não encontrado com o ID: ${req.params.cargo_id}`, success: false });
    }

  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send({ message: "Erro ao encontrar cargo " + err, success: false });
  }}
// Create a new Cargo
exports.createCargo = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    const cargo = await Cargo.create({ nome, descricao });

    console.log("Cargo criado: ", cargo);
    return res.send({ message: cargo, success: true });

  } catch (err) {
    console.log("erro na criação do cargo: ", err);
    return res.status(500).send({ message: "Erro ao criar cargo " + err, success: false });
  }
}

// Update a Cargo by ID
exports.updateCargoById = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    const cargo = await Cargo.findByPk(req.params.cargo_id);

    if (cargo) {
      await cargo.update({ nome, descricao });

      console.log("Cargo atualizado: ", cargo);
      return res.send({ message: cargo, success: true });
    } else {
      return res.status(404).send({ message: `Cargo não encontrado com o ID: ${req.params.cargo_id}`, success: false });
    }

  } catch (err) {
    console.log("erro na atualização do cargo: ", err);
    return res.status(500).send({ message: "Erro ao atualizar cargo " + err, success: false });
  }
}
