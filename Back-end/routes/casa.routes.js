const express = require('express');
const casaController = require('../controllers/casa.controller');

const router = express.Router();

// Get all casas
router.get('/', casaController.getAllCasas);

// Get a casa by id
router.get('/:id', casaController.getCasaById);

// Create a new casa
router.post('/', casaController.createCasa);

// Update a casa by id
router.put('/:id', casaController.updateCasa);

// Delete a casa by id
router.delete('/:id', casaController.deleteCasa);

module.exports = app => {
    app.use("/api/casas", router);
};
