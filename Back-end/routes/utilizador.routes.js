const express = require('express');
const utilizadorController = require('../controllers/utilizador.controller');

const router = express.Router();

// Get all casas
router.get('/', utilizadorController.getAllUtilizadores);

// Get a casa by id
router.get('/:id', utilizadorController.getUtilizadorById);

// Create a new casa
router.post('/', utilizadorController.createUtilizador);

// Update a casa by id
router.put('/:id', utilizadorController.updateUtilizador);


module.exports = app => {
    app.use("/api/utilizador", router);
};