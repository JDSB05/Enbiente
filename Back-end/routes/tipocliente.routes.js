const express = require('express');
const tipoClienteController = require('../controllers/tipocliente.controller');

const router = express.Router();

// Get all casas
router.get('/', tipoClienteController.getAllTipoClientes);

// Get a casa by id
router.get('/:id', tipoClienteController.getTipoClienteById);

// Create a new casa
router.post('/', tipoClienteController.createTipoCliente);

// Update a casa by id
router.put('/:id', tipoClienteController.updateTipoCliente);

// Delete a casa by id
router.delete('/:id', tipoClienteController.deleteTipoCliente);

module.exports = app => {
    app.use("/api/tipoclientes", router);
};