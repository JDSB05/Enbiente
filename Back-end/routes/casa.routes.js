const express = require('express');
const casaController = require('../controllers/casa.controller');
const middleware = require('../config/middleware');

const router = express.Router();

// Get all casas
router.route('/')
    .get(middleware.jwtAuthMiddleware, casaController.getAllCasas);

// Get a casa by id
router.route('/:id')
    .get(middleware.jwtAuthMiddleware, casaController.getCasaById);

// Create a new casa
router.route('/')
    .post(middleware.jwtAuthMiddleware, casaController.createCasa);

// Update a casa by id
router.route('/:id')
    .put(middleware.jwtAuthMiddleware, casaController.updateCasa);

// Delete a casa by id
//router.route('/:id')
//   .delete(casaController.deleteCasa);

module.exports = app => {
    app.use("/api/casas", router);
};
