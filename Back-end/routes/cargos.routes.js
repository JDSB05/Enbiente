module.exports = app => {
    const cargos = require("../controllers/cargos.controller.js");
    const router = require("express").Router();


    // Obter todos tipos vagas
    router.route("/").get(cargos.getAllCargos);

    // Obter um tipo de vaga pelo id
    router.route("/:ncargo").get(cargos.getCargoById);


    app.use("/api/cargos", router);
};