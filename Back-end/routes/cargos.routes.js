const cargos = require("../controllers/cargos.controller.js");
const router = require("express").Router();
const middleware = require('../config/middleware');

module.exports = app => {


    // Obter todos tipos vagas
    router.route("/").get(cargos.getAllCargos);

    // Obter um tipo de vaga pelo id
    router.route("/:id").get(middleware.jwtAuthMiddleware, cargos.getCargoById);

    // Criar um tipo de vaga
    router.route("/").post(middleware.jwtAuthMiddleware, cargos.createCargo);

    // Atualizar um tipo de vaga pelo id
    router.route("/:id").put(middleware.jwtAuthMiddleware, cargos.updateCargo);

    // Deletar um tipo de vaga pelo id
    router.route("/:id").delete(middleware.jwtAuthMiddleware, cargos.deleteCargo);

    app.use("/api/cargos", router);
};