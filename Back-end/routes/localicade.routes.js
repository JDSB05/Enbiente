module.exports = app => {
    const localidades = require("../controllers/localidades.controller.js");
    const router = require("express").Router();

     // Criar Novo localidade
     router.route("/").post(localidades.create);
    // Obter todos localidades
    router.route("/").get(localidades.getAll);

    // Obter um localidade pelo id
    router.route("/:nlocalidade").get(localidades.getById);

    // Apagar localidade
   router.route("/:nlocalidade").delete(localidades.delete);

    // Atualizar localidade

    router.route("/:nlocalidade").put(localidades.updateById);


    app.use("/api/localidades", router);
};