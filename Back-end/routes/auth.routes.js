module.exports = app => {
  const router = require("express").Router();

  const authController = require('../controllers/auth.controller');
  const passport = require("passport");

  // Middleware de tratamento de erro para "UnauthorizedError"
  router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ message: 'Token inválido', success: false });
    } else {
      next();
    }
  });

  // Rota de login
  router.route("/login").post(authController.login);
  // Rota de cadastro
  router.route("/register").post(authController.register);

  // Rota de validação de e-mail
  router.route("/validaremail").get(authController.validarEmail);

  router.route("/resetpassword").post(authController.resetPassword)

  router.route("/requestresetpassword").post(authController.requestResetPassword)

  router.route("/disableuser/:nusuario").put(authController.disableUser);

// Rota de verificação de token
router.get('/checktoken', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { utilizador_id, cargo_id, email, nome } = req.user.message;
  console.log(req.user.message);
  res.status(200).json({success: true,
    message:{ utilizador_id, cargo_id, email, nome, email}});
});
  app.use("/api/auth", router);
};