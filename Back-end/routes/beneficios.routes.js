module.exports = app => {
    const beneficios = require("../controllers/beneficios.controller.js");
    const router = require("express").Router();

     // Criar Novo beneficio
     router.route("/").post(beneficios.create);
    // Obter todos beneficios
    router.route("/").get(beneficios.getAll);

    // Obter um beneficio pelo id
    router.route("/:nbeneficio").get(beneficios.getById);

    // Apagar beneficio
    router.route("/:nbeneficio").delete(beneficios.delete);

    // Atualizar beneficio

    router.route("/:nbeneficio").put(beneficios.updateById);


    app.use("/api/beneficios", router);
};