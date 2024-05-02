const express = require('express');
const consumosController = require('../controllers/consumos.controller');
const middleware = require('../config/middleware');
const router = express.Router();

// Get all consumos
router.route('/')
    .get(middleware.jwtAuthMiddleware, consumosController.getAllConsumos);

// Get a consumo by id
router.route('/:id')
    .get(middleware.jwtAuthMiddleware, consumosController.getConsumoById);

// Create a new consumo
router.route('/')
    .post(middleware.jwtAuthMiddleware, consumosController.createConsumo);

// Update a consumo by id
router.route('/:id')
    .put(middleware.jwtAuthMiddleware, consumosController.updateConsumo);

// Delete a consumo by id
//router.route('/:id')
//    .delete(consumosController.deleteConsumo);


module.exports = app => {
    app.use("/api/consumos", router);
};