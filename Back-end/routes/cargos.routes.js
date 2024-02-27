module.exports = app => {
    const cargos = require("../controllers/cargos.controller.js");
    const router = require("express").Router();

    // router.route("/").post(localidades.create);
    // Obter todos tipos vagas
    router.route("/").get(cargos.getAll);

    // Obter um tipo de vaga pelo id
    router.route("/:ncargo").get(cargos.getById);


    app.use("/api/cargos", router);
};