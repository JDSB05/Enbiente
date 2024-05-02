const express = require('express');
const tipoClienteController = require('../controllers/tipocliente.controller');
const middleware = require('../config/middleware');
const router = express.Router();

// Get all tipoClientes
router.route('/')
    .get(tipoClienteController.getAllTipoClientes);

// Get a tipoCliente by id
router.route('/:id')
    .get( tipoClienteController.getTipoClienteById);

// Create a new tipoCliente
router.route('/')
    .post(middleware.jwtAuthMiddleware, tipoClienteController.createTipoCliente);

// Update a tipoCliente by id
router.route('/:id')
    .put(middleware.jwtAuthMiddleware, tipoClienteController.updateTipoCliente);

// Delete a tipoCliente by id
//router.route('/:id')
 //   .delete(middleware.jwtAuthMiddleware, tipoClienteController.deleteTipoCliente);

module.exports = app => {
    app.use("/api/tipoclientes", router);
};