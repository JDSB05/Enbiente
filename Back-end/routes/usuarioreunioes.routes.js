module.exports = app => {
    const usuarioreuniao = require("../controllers/usuarioreunioes.model");
    const router = require("express").Router();

    // router.route("/").post(localidades.create);
    // Obter todos tipos vagas
    router.route("/").get(usuarioreuniao.getAll);

    // Obter um tipo de vaga pelo id
    router.route("/").get(usuarioreuniao.getById);

    router.route("/").post(usuarioreuniao.create);

    router.route("/").delete(usuarioreuniao.delete);

    app.use("/api/usuarioreunioes", router);
};