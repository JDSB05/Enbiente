// index.js
require('dotenv').config()
const express = require('express')
//const sequelize = require('./config/sequelize')
const app = express()
const PORT = process.env.PORT || 4000
const bodyParser = require('body-parser');
const passport = require("passport");
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(passport.initialize());

// Middleware de log de solicitações
app.use((req, res, next) => {
  console.log(`[${new Date()}] ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});
// suporte as sessões
const session = require('express-session');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  }));
// Obtenção de todas os rotas
app.use(passport.authenticate('session'))
require("./routes/cargos.routes")(app)
require("./routes/alerta.routes")(app)
require("./routes/casa.routes")(app)
require("./routes/consumos.routes")(app)
require("./routes/tipocliente.routes")(app)
require("./routes/utilizador.routes")(app)
require("./routes/auth.routes")(app)
require("./routes/tipocasa.routes")(app)
require("./routes/upload.routes")(app)
//const transporter = require("./config/nodemailer")


app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Atenção, os endpoints desta api estão em /api/, por exemplo /api/clientes')
})



// Teste da autenticação por tokens
app.get('/protegido', passport.authenticate('jwt', { session: false }), function(req, res) {
  // o usuário autenticado está disponível no objeto req.user
  res.status(200).json(req.user);
});



// Export the Express API
module.exports = app
