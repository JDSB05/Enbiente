module.exports = app => {
    const entrevista = require("../controllers/entrevista.controller.js");
    const router = require("express").Router();

     // Criar Novo entrevista
     router.route("/").post(entrevista.create);
    // Obter todos entrevista
    router.route("/").get(entrevista.getAll);

    // Obter um entrevista pelo id
    router.route("/:nentrevista").get(entrevista.getById);

    // Apagar entrevista
   router.route("/:nentrevista").delete(entrevista.delete);

    // Atualizar entrevista

    router.route("/:nentrevista").put(entrevista.updateById);


    app.use("/api/entrevistas", router);
};