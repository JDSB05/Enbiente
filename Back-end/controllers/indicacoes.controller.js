const Indicacao = require("../models/indicacoes.model");
const Vaga = require('../models/vagas.model');
const Usuario = require('../models/usuarios.model')
const transporter = require("../config/nodemailer")

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

async function mandarEmailIndicacao(email, nomeCand, nomeUsuario, nomeVaga) {
  let mailOptions = {
    from: 'pint-2023@outlook.com',
    to: email,
    subject: 'Indicação à vaga',
    html: `
      <html>
        <head>
          <style>
            p {
              font-size: 16px;
              font-family: Arial, sans-serif;
            }
            .nome-candidato {
              font-weight: bold;
            }
            .vaga-indicada {
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <p>Olá <span class="nome-candidato">${nomeCand}</span>,</p>
          <p>Você foi indicado para a vaga <span class="vaga-indicada">${nomeVaga}</span> por ${nomeUsuario}.</p>
        </body>
      </html>
    `
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
     // res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
     // res.send('Email sent successfully!');
    }
  });
}

// Create a new Indicacao
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }

  console.log(req.body);

  // Criar Nova Indicação
  try {
    const indicacao = await Indicacao.create(req.body);
    const data = await indicacao.reload({ include: [Vaga, Usuario] });

    // Se tudo deu certo, vamos mandar o email
    try {
      await mandarEmailIndicacao(data.EmailCand, data.NomeCand, data.NomeUsuario, data.NomeVaga);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ sucess: false, message: "Erro ao enviar e-mail de indicação." });
    }

    return res.send({ message: data, success: true});

  } catch (error) {
    return res.status(500).send({ message: "Erro ao criar indicação.", success: false, error });
  }

};

// Get all Indicações
exports.getAll = async (req, res) => {
  try {
    const indicacoes = await Indicacao.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['Nome']
        },
        {
          model: Vaga,
          attributes: ['NomeVaga']
        }
      ]
    });

    return res.send({ message: indicacoes, success: true, });

  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({ message: "Erro ao obter indicações.", success: false});
  }
};

// Get a Indicação by ID
exports.getById = async (req, res) => {
  try {
    const indicacao = await Indicacao.findByPk(req.params.nindicacao, {
      include: [
        {
          model: Usuario,
          attributes: ['Nome']
        },
        {
          model: Vaga,
          attributes: ['NomeVaga']
        }
      ]
    });

    if (indicacao) {
      console.log("Indicação encontrada: ", indicacao);
      return res.send({ message: indicacao, success: true });
    } else {
      return res.status(404).send({ message: `Indicação não encontrada de id: ${req.params.nindicacao}`, success: false });
    }

  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send({ message: "Erro ao encontrar indicação: " + err, success: false });
  }
};

// Delete a Indicacao by ID
exports.delete = async (req, res) => {
  const nindicacao = req.params.nindicacao;
  try {
      const result = await Indicacao.destroy({ where: { NIndicacao: nindicacao } });
      if (result === 0) {
          res.status(404).send({
              success: false,
              message: `Indicacao não encontrada com o ID: ${nindicacao}.`
          });
      } else {
          res.status(200).send({
              success: true,
              message: `Indicacao excluída com sucesso. ID: ${nindicacao}`
          });
      }
  } catch (err) {
      console.log("Erro na query: ", err);
      res.status(500).send({
          success: false,
          message: "Erro ao excluir Indicacao."
      });
  }
};

// Update a Indicacao by ID
exports.updateById = async (req, res) => {
  const nindicacao = req.params.nindicacao;
  // Validate Request
  if (!req.body) {
      res.status(400).send({
          success: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
  console.log(req.body);
  try {
      const result = await Indicacao.update(req.body, { where: { NIndicacao: nindicacao } });
      if (result[0] === 0) {
          res.status(404).send({
              success: false,
              message: `Indicacao não encontrada com o ID: ${nindicacao}.`
          });
      } else {
          res.send({
              success: true,
              message: `Indicacao atualizada com sucesso. ID: ${nindicacao}`
          });
      }
  } catch (error) {
      res.status(500).send({
          success: false,
          message: `Erro ao atualizar Indicacao: ${error}`
      });
  }
};
