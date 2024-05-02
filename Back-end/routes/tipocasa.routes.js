const express = require('express');
const tipoCasaController = require('../controllers/tipocasa.controller');
const middleware = require('../config/middleware');
const router = express.Router();

// Get all tipocasas
router.route('/')
    .get(tipoCasaController.getAllTipoCasas);

// Get a tipocasa by id
router.route('/:id')
    .get(middleware.jwtAuthMiddleware, tipoCasaController.getTipoCasaById);

// Create a new tipocasa
router.route('/')
    .post( tipoCasaController.createTipoCasa);

// Update a tipocasa by id
router.route('/:id')
    .put(middleware.jwtAuthMiddleware, tipoCasaController.updateTipoCasa);

// Delete a tipocasa by id
//router.route('/:id')
//    .delete(tipoCasaController.deleteTipoCasa);

module.exports = app => {
    app.use("/api/tipocasa", router);
};