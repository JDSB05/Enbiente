const express = require('express');
const consumosController = require('../controllers/consumos.controller');

const router = express.Router();

// Get all casas
router.get('/', consumosController.getAllConsumos);

// Get a casa by id
router.get('/:id', consumosController.getConsumoById);

// Create a new casa
router.post('/', consumosController.createConsumo);

// Update a casa by id
router.put('/:id', consumosController.updateConsumo);

// Delete a casa by id
router.delete('/:id', consumosController.deleteConsumo);


module.exports = app => {
    app.use("/api/consumos", router);
};