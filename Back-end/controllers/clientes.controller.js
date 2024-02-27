const Cliente = require("../models/cliente.model");
//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Cliente
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Conteudo não pode estar vazio!"
      });
    }
    console.log(req.body);
    // Criar Novo Cliente

    // Criar novo cliente na base de dados
    try {
        const data = await Cliente.create(req.body);
        res.send(data);
        
    } catch (error) {
        res.status(500).send("erro: " + error);
    }
   
  };
// Get all Clientes
exports.getAll = async (req, res) => {

  try {
      const clientes = await Cliente.findAll();
     // console.log("Clientes: ", clientes);
      res.send(clientes);
  } catch (err) {
      console.log("error: ", err);
      res.status(500).send("Erro ao obter clientes");
  }
};

// Get a Cliente by ID
exports.getById = async (req, res) => {
  try {
      const cliente = await Cliente.findByPk(req.params.ncliente);
      if (cliente) {
          console.log("Cliente encontrado: ", cliente);
          res.send(cliente)
      } else {
        res.status(404).send("Cliente não encontrado de id: " + req.params.ncliente);
      }
  } catch (err) {
      console.log("erro na query: ", err);
      res.status(500).send("Erro ao encontrar cliente")
  }
};

// Delete a Cliente by ID
exports.delete = async (req, res) => {
    const ncliente = req.params.ncliente;
  try {
      const result = await Cliente.destroy({ where: { NCliente: ncliente } });
      if (result === 0) {
        res.status(404).send("Cliente não encontrado de id: " + ncliente);
      } else {
        res.status(200).send(`Cliente apagado de id: ${ncliente}`);
      }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send("Erro ao apagar cliente")
   
  }
};

// Update a Cliente by ID
exports.updateById = async (req, res) => {
    const ncliente = req.params.ncliente
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Conteúdo não pode estar vazio!"
      });
    }
    console.log(req.body);
    const result = await Cliente.update(req.body, {where: {NCliente : ncliente}});
  try {
    if (result[0] === 0) {
        res.status(404).send({
            message: `Impossível encontrar o cliente de id: ${ncliente}.`
        });
      } else {
        res.send({
           message: "Cliente atualizado com sucesso!"
        })
      }
  } catch (error) {
    res.status(500).send({
        message: `Erro ao atualizar cliente: ${error} ` 
    })
    
  }
}
  
