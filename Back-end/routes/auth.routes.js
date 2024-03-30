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
router.get('/checktoken', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error(err); // Log the error
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    if (!user) {
      console.error(info.message); // Log the authentication failure message
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const { utilizador_id, cargo_id, email, nome, foto } = user.message;
    console.log(user.message); // Log user details
    res.status(200).json({
      success: true,
      message: { utilizador_id, cargo_id, email, nome, email, foto }
    });
  })(req, res, next);
});
  app.use("/api/auth", router);
};