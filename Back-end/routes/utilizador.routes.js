const express = require('express');
const utilizadorController = require('../controllers/utilizador.controller');
const middleware = require('../config/middleware');

const router = express.Router();

// Get all utilizadores
router.get('/', middleware.jwtAuthMiddleware, utilizadorController.getAllUtilizadores);

// Get a utilizador by id
router.get('/:id', middleware.jwtAuthMiddleware, utilizadorController.getUtilizadorById);

// Create a new casa
//router.post('/', utilizadorController.createUtilizador);

// Update a utilizador by id
router.put('/:utilizador_id', middleware.jwtAuthMiddleware, utilizadorController.updateUtilizador);


module.exports = app => {
    app.use("/api/utilizador", router);
};