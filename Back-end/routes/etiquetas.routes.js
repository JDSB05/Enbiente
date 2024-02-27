module.exports = app => {
    const etiquetas = require("../controllers/etiquetas.controller.js");
    const router = require("express").Router();

     // Criar Novo etiqueta
     router.route("/").post(etiquetas.create);
    // Obter todos etiquetas
    router.route("/").get(etiquetas.getAll);

    // Obter um etiqueta pelo id
    router.route("/:netiqueta").get(etiquetas.getById);

    // Apagar etiqueta
   router.route("/:netiqueta").delete(etiquetas.delete);

    // Atualizar etiqueta

    router.route("/:netiqueta").put(etiquetas.updateById);


    app.use("/api/etiquetas", router);
};