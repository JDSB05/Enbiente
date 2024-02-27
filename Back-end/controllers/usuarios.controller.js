const Usuario = require("../models/usuarios.model");
const bcrypt = require('bcryptjs');
const Joi = require('joi');


// Obter todos usuarios
exports.getAll = async (req, res) => {
  const estado = req.query.estado;
  try {
    const data = await Usuario.findAll(
     { where: estado === '1' ? { Estado: 1 } : {} }
    )
    res.send(
      {
        success: true,
        message: data
      })

  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Erro ao obter usuarios",
      success: false
    }
    );
  }
}

// obter usuario pelo NUsuario
exports.getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.nusuario);
    if (usuario) {
      console.log("Usuario encontrado: ", usuario);
      res.send(
        {
          message: usuario,
          success: true
        })
    } else {
      res.status(404).send(
        {
          success: false,
          message: "Usuario não encontrado de id: " + req.params.nusuario
        }
      )
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send(
      {
        message: "Erro ao encontrar usuario ",
        success: false
      }
    )
  }
};


// apagar usuario
exports.delete = async (req, res) => {
  const nusuario = req.params.nusuario;
  try {
    const result = await Usuario.destroy({ where: { NUsuario: nusuario } });
    if (result === 0) {
      res.status(404).send(
        {
          message: "Usuario não encontrado de id: " + nusuario,
          success: false
        }
      );
    } else {
      res.status(200).send(
        {
          message: `Usuario apagado de id: ${nusuario}`,
          success: true
        }
      );
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send(
      {
        message: "Erro ao apagar usuario",
        success: false
      }
    )

  }
};

exports.updateById = async (req, res) => {
  const nusuario = req.params.nusuario;
  const requestBody = req.body;
  // Validate Request
  if (!requestBody || Object.keys(requestBody).length === 0) {
    res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
    return;
  }

  console.log(requestBody);

  const allowedFields = ['Telefone', 'NCargo', 'Linkedin', 'CV', 'Foto', 'Genero', 'DataNascimento', 'Nome', 'Localidade'];
  const updates = Object.keys(requestBody).filter(field => allowedFields.includes(field));

  const usuario = await Usuario.findOne({ where: { NUsuario: nusuario } });
  if (!usuario) {
    res.status(404).send({
      success: false,
      message: `Impossível encontrar o usuário de id: ${nusuario}.`
    });
    return;
  }

  let isUpdated = false;
  const updatedFields = {};
  updates.forEach(field => {
    if (requestBody[field] !== usuario[field]) {
      isUpdated = true;
      updatedFields[field] = requestBody[field];
    }
  });

  if (!isUpdated) {
    res.send({
      success: true,
      message: "Nenhum campo atualizado!"
    });
    return;
  }

  try {
    const result = await Usuario.update(updatedFields, {
      where: { NUsuario: nusuario },
      fields: updates
    });
    if (result[0] === 0) {
      res.status(404).send({
        success: false,
        message: `Impossível encontrar o usuário de id: ${nusuario}.`
      });
    } else {
      res.send({
        success: true,
        message: "Usuário atualizado com sucesso!"
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Erro ao atualizar usuário: ${error} `
    })
  }
}

