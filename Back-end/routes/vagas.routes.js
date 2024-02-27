module.exports = app => {
    const vagas = require("../controllers/vagas.controller.js");
    const router = require("express").Router();

     // Criar Novo vaga
     router.route("/").post(vagas.create);
    // Obter todos vagas
    router.route("/").get(vagas.getAll);

    // Obter um vaga pelo id
    router.route("/:nvaga").get(vagas.getById);

    // Apagar vaga
   router.route("/:nvaga").delete(vagas.delete);

    // Atualizar vaga

    router.route("/:nvaga").put(vagas.updateById);

    app.use("/api/vagas", router);
};