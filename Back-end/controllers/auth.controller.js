// Importar o modelo de usuário
const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const auth = require('../config/passport')

//const transporter = require("../config/nodemailer")
const email_sender = require("../config/email-body");
const { func } = require('joi');

  const website = process.env.WEBSITE || 'https://pint-2023.netlify.app'

exports.login = async (req, res) => {

  let user;
  try {
    user = await Usuario.findOne({ where: { Email: req.body.Email } });
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
  console.log("usuario encontrado: " + user.Email);

  // Verifica se o usuário está ativado.
  if(user.Estado === 0)
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
    if (bcrypt.compareSync(req.body.Senha, user.Senha)) {
      const payload =
      {
        email: user.Email,
        id: user.NUsuario
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
  if (!req.body) {
    res.status(400).send({
      message: "Conteudo não pode estar vazio!",
      success: false
    });
  }
  // Criar novo Usuario

  // Verificar se o email não está cadastrado
  try {
    const user = await Usuario.findOne({ where: { Email: req.body.Email } });
    if (user) {
      return res.status(500).send({
        success: false,
        message: "Email já está cadastrado: " + req.body.Email

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
    req.body.Estado = 0;
  // Encriptar password
  const salt = await bcrypt.genSalt();
  req.body.Senha = await bcrypt.hash(req.body.Senha, salt);

  console.log("senha : " + req.body.Senha);

  // Criar token para validar email
  const payload =
  {
    email: req.body.Email,
  }
  const token = jwt.sign(payload, "mudar", { expiresIn: "1m" })

  // Definir token de validação na BD
  req.body.TokenEmail = token

  // Mandar email de verificação
  email_sender.verificarEmail(req.body.Email, token);

  // Define o cargo padrão como 1 "Utilizador externo"
  req.body.NCargo = 1;

  req.body.Foto = 'https://res.cloudinary.com/dr2x19yhh/image/upload/v1681211694/foto-padrao.jpg.jpg'

  try {
    const data = await Usuario.create(req.body);
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
    const user = await Usuario.findOne({ where: { TokenEmail: code } });

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
      user.Estado = 1;
      console.log("estado: " + user.Estado);
      await user.save();
    } catch (error) {
      console.log("Erro ao atualizar usuário: " + error)
      return res.status(500).send({
        message: "Erro ao validar código: " + error,
        success: false
      });
    }


    return res.send({
      message: "Código validado!",
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
  const email = req.body.Email
  if (!email) {
    res.status(400).send({
      message: "É preciso o Email!",
      success: false
    });
  }
  try {
    const user = await Usuario.findOne({ where: { Email: email } });
    if(!user)
    {
      res.status(404).send(
        {
          success: false,
          message: "Não existe usuário com esse e-mail"
        })
    }

    if(user.Estado === 0)
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
      email: req.body.Email,
    }
    const token = jwt.sign(payload, "mudar", { expiresIn: "15m" })
  // Definir token de validação na BD
    user.TokenEmail = token;

    user.save();
  
      
  // Mandar email de verificação
  try {
    email_sender.resetPassword(req.body.Email, token);
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
  const senha = req.body.Senha;

  if (!code) {
    console.log("Erro, código não fornecido")
    return res.status(400).send(
      {
        message: "Código não fornecido",
        success: false
      }
    );
  }

  if(!senha)
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
    const user = await Usuario.findOne({ where: { TokenEmail: code } });

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
      req.body.Senha = await bcrypt.hash(req.body.Senha, salt);
      user.Senha = req.body.Senha;
      // No caso de ser uma contra criada pela administração
      if(user.estado != 1)
      {
        user.Estado = 1;
      }
     
      user.TokenEmail = null
      console.log("estado: " + user.Estado);
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

// Criar contas através do administrador
exports.adminRegister = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Conteudo não pode estar vazio!",
      success: false
    });
  }
  // Criar novo Usuario

  // Verificar se o email não está cadastrado
  try {
    const user = await Usuario.findOne({ where: { Email: req.body.Email } });
    if (user) {
      return res.status(500).send({
        success: false,
        message: "Email já está cadastrado: " + req.body.Email
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

  // Definir a verificao de password como 0 (obriga o utilizador a resetar a password no primeiro login)
  req.body.Estado = 0;

  // Criar password aleatória, apenas para não ficar vazio
  var randompassword = Math.random().toString(36).slice(-8);
  console.log("Random pass: " + randompassword);
  // Encriptar password
  const salt = await bcrypt.genSalt();
  req.body.Senha = await bcrypt.hash(randompassword, salt);

  console.log("senha : " + req.body.Senha);

  // Criar token para validar email
  const payload =
  {
    email: req.body.Email,
  }
  const token = jwt.sign(payload, "mudar", { expiresIn: "100m" })

  // Definir token de validação na BD
  req.body.TokenEmail = token

  // Mandar email de verificação
  email_sender.contaCriadaPorAdmin(req.body.Email, token);

  try {
    const data = await Usuario.create(req.body);
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

exports.disableUser  =  async (req, res) =>
{
  const nusuario = req.params.nusuario;
  if(!nusuario)
  {
    req.status(400).send(
      {
        success: false,
        message: "NUsuario não fornecido"
      }
    )
  }
  try {
    const allowedFields = ['Estado']; // definir os campos permitidos
    user = await Usuario.findOne({ where: { NUsuario : nusuario } });
    const updates = Object.keys(req.body).filter(field => allowedFields.includes(field)); // filtra somente os campos permitidos
    const result = await Usuario.update(req.body, {
      where: { NUsuario: nusuario },
      fields: updates // utiliza apenas os campos permitidos
    });
      if (result[0] === 0) {
        res.status(404).send({
          success: false,
          message: `Impossível encontrar o usuário de id: ${nusuario}.`
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

  exports.googlecallback = (req, res) =>
  {
      // successful authentication, redirect home
   const user = req.user.message;
   if(!user)
   {

      return res.redirect('/api/google');
   }
   console.log("User: " + JSON.stringify(user))
   const payload =
   {
     email: user.Email,
     id: user.NUsuario
   }
   const token = jwt.sign(payload, "mudar", { expiresIn: "1d" })
  
   const bearerToken = "Bearer " + token;
   console.log(bearerToken);

   
   res.send(`<script>window.opener.postMessage({accessToken: '${bearerToken}'}, '${website}');window.close();</script>`);
    
  }