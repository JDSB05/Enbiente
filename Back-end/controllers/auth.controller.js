// Importar o modelo de usuário
const Utilizador = require('../models/utilizador.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const auth = require('../config/passport')

//const transporter = require("../config/nodemailer")
const email_sender = require("../config/email-body");
const { func } = require('joi');

  const website = process.env.WEBSITE || 'https://enbiente.netlify.app'

exports.login = async (req, res) => {

  let user;
  try {
    user = await Utilizador.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Email ou password incorretas"

      })
    }
  } catch (error) {
    res.status(500).send(
      {
        success: false,
        message: "Erro ao verificar email : " + error
      }
    )
  }


  // Usuário encontrado
  console.log("usuario encontrado: " + user.email);

  // Verifica se o usuário está ativado.
  if(user.estado === 0)
  {
    res.status(500).send(
      {
        success: false,
        message: "Utilizador desativado!"
      }
    )
  }

  // Verificiar password´

  try {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const payload =
      {
        email: user.email,
        id: user.utilizador_id
      }
      const token = jwt.sign(payload, "mudar", { expiresIn: "1d" })

      return res.status(200).send(
        {
          success: true,
          message: "Bearer " + token
        })
    }
    else {
      return res.status(401).send(
        {
          message: "Email ou password incorretas",
          success: false
        })
    }

  } catch (error) {
    res.status(500).send(
      {

        message: "Erro de autenticação: " + error,
        success: false

      }

    );
  }
}

exports.register = async (req, res) => {
  console.log("A registar");
  if (!req.body) {
    res.status(400).send({
      message: "Conteudo não pode estar vazio!",
      success: false
    });
  }
  // Criar novo Utilizador

  // Verificar se o email não está cadastrado
  try {
    const user = await Utilizador.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(500).send({
        success: false,
        message: "Email já está cadastrado: " + req.body.email

      })
    }
  } catch (error) {
    res.status(500).send(
      {
        success: false,
        message: "Erro ao verificar email do Usuário : " + error
      }
    )
  }
  // Define o estado = 0, até que verifique o email
    req.body.estado = 0;
    req.body.tipo_cliente_id = 1;
  // Encriptar password
  const salt = await bcrypt.genSalt();
  req.body.password = await bcrypt.hash(req.body.password, salt);

  console.log("password : " + req.body.password);

  // Criar token para validar email
  const payload =
  {
    email: req.body.email,
  }
  const token = jwt.sign(payload, "mudar", { expiresIn: "1m" })

  // Definir token de validação na BD
  req.body.TokenEmail = token

  // Mandar email de verificação
  email_sender.verificarEmail(req.body.email, token);

  // Define o cargo padrão como 1 "Utilizador externo"
  req.body.cargo_id = 1;

  req.body.Foto = 'https://res.cloudinary.com/dr2x19yhh/image/upload/v1681211694/foto-padrao.jpg.jpg'

  try {
    const data = await Utilizador.create(req.body);
    res.send({
      message: data,
      success: true

    });

  } catch (error) {
    res.status(500).send(
      {
        message: "Erro ao criar usuário: " + error,
        success: false
      })
  }
}

exports.validarEmail = async function (req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send(
      {
        message: "Código não fornecido",
        success: false
      }
    );
  }

  try {
    const user = await Utilizador.findOne({ where: { TokenEmail: code } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Código inválido"
      }
      );
    }

    // Marque o email do usuário como verificado
    try {
      user.TokenEmail = null;
      user.estado = 1;
      console.log("estado: " + user.estado);
      await user.save();
    } catch (error) {
      console.log("Erro ao atualizar usuário: " + error)
      return res.status(500).send({
        message: "Erro ao validar código: " + error,
        success: false
      });
    }


    return res.send({
      message: "Código validado com sucesso! Pode voltar à pagina de login e entrar com as suas credenciais.",
      success: true
    }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Erro ao validar código: " + error,
      success: false
    });
  }
};

exports.requestResetPassword = async function (req, res)  
{
  const email = req.body.email
  if (!email) {
    res.status(400).send({
      message: "É preciso o Email!",
      success: false
    });
  }
  try {
    const user = await Utilizador.findOne({ where: { email: email } });
    if(!user)
    {
      res.status(404).send(
        {
          success: false,
          message: "Não existe utilizador com esse e-mail"
        })
    }

    if(user.estado === 0)
    {
      res.status(400).send(
        {
          success: false,
          message: "Não é permitido redefinir a password de um usuário desativado."
        }
      )
    }
    const payload =
    {
      email: req.body.email,
    }
    const token = jwt.sign(payload, "mudar", { expiresIn: "15m" })
  // Definir token de validação na BD
    user.TokenEmail = token;

    user.save();
  
      
  // Mandar email de verificação
  try {
    email_sender.resetPassword(req.body.email, token);
  } catch (error) {
    console.log("erro no email :" + error)
    res.status(500).send(
      {
        success: false,
        message: "Erro ao enviar email "
      })
  }

  res.send(
    {
      success: true,
      message: "E-mail para redefinir a password foi enviado"
    }
  )

  } catch (error) {
    console.log("erro redefinir password " + error)
    res.status(500).send(
      {
        success: false,
        message: "Erro ao redefinir password"
      }
    )
  }
}


exports.resetPassword = async function (req, res) {
  const code = req.query.code;
  const password = req.body.password;

  if (!code) {
    console.log("Erro, código não fornecido")
    return res.status(400).send(
      {
        message: "Código não fornecido",
        success: false
      }
    );
  }

  if(!password)
  {
    console.log("Erro, Password não fornecida")
    return res.status(400).send(
      {
        message: "Password não fornecida",
        success: false
      }
    );
  }

  try {
    const user = await Utilizador.findOne({ where: { TokenEmail: code } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Código inválido"
      }
      );
    }

    // Marco o estado da conta como ativado e criptografa a password
    try {
      const salt = await bcrypt.genSalt();
      req.body.password = await bcrypt.hash(req.body.password, salt);
      user.password = req.body.password;
      // No caso de ser uma contra criada pela administração
      if(user.estado != 1)
      {
        user.estado = 1;
      }
     
      user.TokenEmail = null
      console.log("estado: " + user.estado);
      await user.save();
    } catch (error) {
      console.log("Erro ao atualizar usuário: " + error)
      return res.status(500).send({
        message: "Erro ao validar código: " + error,
        success: false
      });
    }

    return res.send({
      message: "Password resetada com sucesso!",
      success: true
    }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Erro ao validar código: " + error,
      success: false
    });
  }
};


exports.disableUser  =  async (req, res) =>
{
  const utilizador_id = req.params.utilizador_id;
  if(!utilizador_id)
  {
    req.status(400).send(
      {
        success: false,
        message: "utilizador_id não fornecido"
      }
    )
  }
  try {
    const allowedFields = ['estado']; // definir os campos permitidos
    user = await Utilizador.findOne({ where: { utilizador_id : utilizador_id } });
    const updates = Object.keys(req.body).filter(field => allowedFields.includes(field)); // filtra somente os campos permitidos
    const result = await Utilizador.update(req.body, {
      where: { utilizador_id: utilizador_id },
      fields: updates // utiliza apenas os campos permitidos
    });
      if (result[0] === 0) {
        res.status(404).send({
          success: false,
          message: `Impossível encontrar o usuário de id: ${utilizador_id}.`
        });
      } else {
        res.send({
          success: true,
          message: "Usuário mudado de estado com sucesso!"
        })
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: `Erro ao mudar estado do usuário: ${error} `
      })
    }

  }

