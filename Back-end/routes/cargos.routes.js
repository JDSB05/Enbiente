const cargos = require("../controllers/cargos.controller.js");
const router = require("express").Router();

module.exports = app => {


    // Obter todos tipos vagas
    router.route("/").get(cargos.getAllCargos);

    // Obter um tipo de vaga pelo id
    router.route("/:id").get(cargos.getCargoById);

    // Criar um tipo de vaga
    router.route("/").post(cargos.createCargo);

    // Atualizar um tipo de vaga pelo id
    router.route("/:id").put(cargos.updateCargo);

    // Deletar um tipo de vaga pelo id
    router.route("/:id").delete(cargos.deleteCargo);

    app.use("/api/cargos", router);
};