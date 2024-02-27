module.exports = app => {
    const tipovagas = require("../controllers/tipovagas.controller.js");
    const router = require("express").Router();

    // router.route("/").post(localidades.create);
    // Obter todos tipos vagas
    router.route("/").get(tipovagas.getAll);

    // Obter um tipo de vaga pelo id
    router.route("/:ntipovaga").get(tipovagas.getById);



    app.use("/api/tipovagas", router);
};