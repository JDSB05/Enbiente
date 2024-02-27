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

  router.route("/adminregister").post(authController.adminRegister);
  // Rota de validação de e-mail
  router.route("/validaremail").get(authController.validarEmail);

  router.route("/resetpassword").post(authController.resetPassword)

  router.route("/requestresetpassword").post(authController.requestResetPassword)

  router.route("/adminregister").post(authController.adminRegister);

  router.route("/disableuser/:nusuario").put(authController.disableUser);

// Rota de verificação de token
router.get('/checktoken', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { NUsuario, NCargo, Email, VerificacaoPass, Nome, Foto } = req.user.message;
  res.status(200).json({success: true,
    message:{ NUsuario, NCargo, Email, VerificacaoPass, Nome, Foto }});
});

// Autenticação do google

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google'), authController.googlecallback);
  // Aplica o roteador "/api" em todas as rotas
  app.use("/api", router);
};