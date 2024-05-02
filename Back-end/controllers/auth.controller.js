// Importar o modelo de usuário
const Utilizador = require('../models/utilizador.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const auth = require('../config/passport')
const Joi = require('joi');

//const transporter = require("../config/nodemailer")
const email_sender = require("../config/email-body");
const { func } = require('joi');


exports.login = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      success: false,
      message: "O email está vazio."
    })
  }

  if (!req.body.password) {
    return res.status(400).send({
      success: false,
      message: "A password está vazia."
    })
  }

  let user;
  try {
    user = await Utilizador.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "O email ou a password estão incorretos."

      })
    }
  } catch (error) {
    res.status(500).send(
      {
        success: false,
        message: "Erro ao verificar o email: " + error
      }
    )
  }

  // Verifica se o usuário está ativado.
  if (user.estado === 0) {
    res.status(401).send(
      {
        success: false,
        message: "A conta está desativada. Por favor, verifique o seu email ou contacte a adminstração."
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
      // Check if it's the first login
      if (!user.primeiroLogin) {
        user.primeiroLogin = new Date();
      }

      // Update last login
      user.ultimoLogin = new Date();

      await user.save();
      return res.status(200).send(
        {
          success: true,
          message: "Bearer " + token
        })
    }
    else {
      return res.status(401).send(
        {
          message: "O email ou a password estão incorretos.",
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

  const schema = Joi.object({
    nome: Joi.string().min(3).required().messages({
      'string.base': 'O nome deve ser uma string válida',
      'string.empty': 'O nome não pode estar vazio',
      'string.min': 'O nome deve ter no mínimo {#limit} caracteres'
    }),
    email: Joi.string().email().required().messages({
      'string.base': 'O e-mail deve ser uma string válida',
      'string.empty': 'O e-mail não pode estar vazio',
      'string.email': 'O e-mail deve ser um endereço de e-mail válido'
    }),
    password: Joi.string().min(6).regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/).required().messages({
      'string.base': 'A palavra-passe deve ser uma string válida',
      'string.empty': 'A palavra-passe não pode estar vazia',
      'string.min': 'A palavra-passe deve ter no mínimo {#limit} caracteres',
      'string.pattern.base': 'A palavra-passe deve conter pelo menos uma letra e um número'
    })
  });
  
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    // Se houver erros de validação, mapear as mensagens de erro e retornar uma resposta com os erros
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).send({
      message: errorMessages[0],
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
        message: "O email já está registado."

      })
    }
  } catch (error) {
    res.status(500).send(
      {
        success: false,
        message: "Erro ao verificar o email do utilizador: " + error
      }
    )
  }
  // Define o estado = 0, até que verifique o email
  req.body.estado = 0;
  // Encriptar password
  const salt = await bcrypt.genSalt();
  req.body.password = await bcrypt.hash(req.body.password, salt);


  // Criar token para validar email
  const payload =
  {
    email: req.body.email,
  }
  const token = jwt.sign(payload, "mudar", { expiresIn: "15m" })

  // Definir token de validação na BD
  req.body.TokenEmail = token

  // Mandar email de verificação
  email_sender.verificarEmail(req.body.email, token);

  // Define o cargo padrão como 1 "Admin" (Mudar depois para 2 "Utilizador normal")
  req.body.cargo_id = 2;

  //Define o tipo de cliente padrão como 1 "Particular"
  req.body.tipo_cliente_id = 1;

  try {
    const data = await Utilizador.create(req.body);
    res.send({
      message: data,
      success: true

    });

  } catch (error) {
    res.status(500).send(
      {
        message: "Erro ao criar o utilizador: " + error,
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


    return res.redirect(process.env.WEBSITE + "/#/login");
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


exports.disableUser = async (req, res) => {
  const utilizador_id = req.params.utilizador_id;
  if (!utilizador_id) {
    return res.status(400).json({ message: 'Falta utilizador_id' });
  } else if (req.user.cargo_id != 1) {
    return res.status(409).json({ message: 'Não está autorizado para editar informações de outros utilizadores' });
  }
  try {
    const allowedFields = ['estado']; // definir os campos permitidos
    const user = await Utilizador.findOne({ where: { utilizador_id: utilizador_id } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: `Impossível encontrar o usuário de id: ${utilizador_id}.`
      });
    }
    const updates = Object.keys(req.body).filter(field => allowedFields.includes(field)); // filtra somente os campos permitidos
    const result = await Utilizador.update(req.body, {
      where: { utilizador_id: utilizador_id },
      fields: updates // utiliza apenas os campos permitidos
    });
    if (result[0] === 0) {
      return res.status(404).send({
        success: false,
        message: `Impossível encontrar o usuário de id: ${utilizador_id}.`
      });
    }
    return res.send({
      success: true,
      message: "Usuário mudado de estado com sucesso!"
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Erro ao mudar estado do usuário: ${error}`
    });
  }
}

