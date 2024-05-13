const Alerta = require('../controllers/alerta.controller');
const router = require("express").Router();
const middleware = require('../config/middleware');

// GET all alertas
router.route("/").get(middleware.jwtAuthMiddleware, Alerta.getAllAlertas);

// GET a single alerta by ID
//router.route("/:id").get(Alerta.getAlertaById);

// POST a new alerta
//router.route("/").post(Alerta.createAlerta);

// PUT update an existing alerta
router.route("/:id").put(Alerta.updateAlerta);


module.exports = app => {
    app.use("/api/alertas", router);
};
