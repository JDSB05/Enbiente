const express = require('express');
const tipoCasaController = require('../controllers/tipocasa.controller');

const router = express.Router();

// Get all tipocasas
router.get('/', tipoCasaController.getAllTipoCasas);

// Get a tipocasa by id
router.get('/:id', tipoCasaController.getTipoCasaById);

// Create a new tipocasa
router.post('/', tipoCasaController.createTipoCasa);

// Update a tipocasa by id
router.put('/:id', tipoCasaController.updateTipoCasa);

// Delete a tipocasa by id
router.delete('/:id', tipoCasaController.deleteTipoCasa);

module.exports = app => {
    app.use("/api/tipocasa", router);
};