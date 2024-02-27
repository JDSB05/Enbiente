const Estagio = require('../models/estagios.model')

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
      const estagio = await Estagio.create(req.body);
      return res.send({ message: estagio, success: true});
    } catch (error) {
      return res.status(500).send({ message: "Erro ao criar estagio.", success: false });
    }
  
  };
  
  // Get all Indicações
  exports.getAll = async (req, res) => {
    try {
      const estagios = await Estagio.findAll();
  
      return res.send({ message: estagios, success: true, });
  
    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter estagios.", success: false });
    }
  };
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const estagio = await Estagio.findByPk(req.params.nestagio);
  
      if (estagio) {
        console.log("Indicação encontrada: ", estagio);
        return res.send({ message: estagio, success: true });
      } else {
        return res.status(404).send({ message: `Indicação não encontrada de id: ${req.params.nestagio}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar indicação: " + err, success: false });
    }
  };
  
  // Delete a Estagio by ID
  exports.delete = async (req, res) => {
    const nestagio = req.params.nestagio;
    try {
        const result = await Estagio.destroy({ where: { NEstagio: nestagio } });
        if (result === 0) {
            res.status(404).send({
                success: false,
                message: `Estagio não encontrada com o ID: ${nestagio}.`
            });
        } else {
            res.status(200).send({
                success: true,
                message: `Estagio excluída com sucesso. ID: ${nestagio}`
            });
        }
    } catch (err) {
        console.log("Erro na query: ", err);
        res.status(500).send({
            success: false,
            message: "Erro ao excluir Estagio."
        });
    }
  };
  
  // Update a Estagio by ID
  exports.updateById = async (req, res) => {
    const nestagio = req.params.nestagio;
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            success: false,
            message: "Conteúdo não pode estar vazio!"
        });
    }
    console.log(req.body);
    try {
        const result = await Estagio.update(req.body, { where: { NEstagio: nestagio } });
        if (result[0] === 0) {
            res.status(404).send({
                success: false,
                message: `Estagio não encontrada com o ID: ${nestagio}.`
            });
        } else {
            res.send({
                success: true,
                message: `Estagio atualizada com sucesso. ID: ${nestagio}`
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Erro ao atualizar Estagio: ${error}`
        });
    }
  };