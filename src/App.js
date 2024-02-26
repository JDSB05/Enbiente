const express = require('express');
const app = express();
const middleware = require('./middleware');
const cors=require("cors");
app.use(cors());
//Configurações
app.set("port", process.env.PORT || 3000);
//Middlewares
app.use(express.json())

// importação de rotas [1]
const utilizadorRouters = require('./routes/utilizadorRoute.js')
const perfilRouters = require('./routes/perfilRoute.js')
const empreendimentoRouters = require('./routes/empreendimentoRoute.js')
const documentoTecnicoRouters = require('./routes/documentoTecnicoRoute.js')

// sync database
const sequelize = require('./model/database');
sequelize.sync().then(() => { require('./model/defaultData.js')})

//Middlewares
app.use(express.json());
//Rotas
app.use('/utilizador',utilizadorRouters)
app.use('/perfil', middleware.checkToken, perfilRouters)
app.use('/empreendimento', middleware.checkToken, empreendimentoRouters)
app.use('/documento', middleware.checkToken, documentoTecnicoRouters);

app.listen(app.get("port"), () => {
  console.log("Start server on port " + app.get("port"));
  });