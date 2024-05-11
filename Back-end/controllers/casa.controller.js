const Casa = require('../models/casa.model');
const Utilizador = require('../models/utilizador.model');
const TipoCasa = require('../models/tipocasa.model');
const moment = require('moment');

// Controller actions
const getAllCasas = async (req, res) => {
    const { utilizador } = req.query;
    if (!utilizador) {
        console.log("Falta utilizador_id")
        return res.status(400).json({ message: 'Falta utilizador_id' });
      } else if (utilizador != req.user.utilizador_id && req.user.cargo_id != 1) {
        console.log("Não está autorizado para aceder a informações de outros utilizadores")
        return res.status(403).json({ message: 'Não está autorizado para aceder a informações de outros utilizadores' });
      }
    try {
        let casas;
        if (utilizador) {
            casas = await Casa.findAll({
                where: { utilizador_id: utilizador },
                include: {
                    model: TipoCasa,
                    attributes: ['tipo_casa', 'fator']
                }
            });
        } else {
            casas = await Casa.findAll({
                include: {
                    model: TipoCasa,
                    attributes: ['tipo_casa', 'fator']
                }
            });
        }
        res.json(casas);
        console.log(casas);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve casas' });
    }
};

const getCasaById = async (req, res) => {
    const { id } = req.params;
    try {
        const casa = await Casa.findByPk(id, {
            include: {
                model: TipoCasa,
                attributes: ['tipo_casa']
            }
        });
        //Verificar se as casas pertencem ao utilizador, se não pertencerem, não mostrar
        if (casa.utilizador_id == req.user.utilizador_id || req.user.cargo == 1) {
            res.json(casa);
        } else if (casa.utilizador_id != req.user.utilizador && req.user.cargo != 1) {
            console.log("Não está autorizado para aceder a informações de outros utilizadores")
            res.status(403).json({ message: 'Não está autorizado para aceder a informações de outros utilizadores' });
        } else {
            res.status(404).json({ error: 'Casa not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve casa' });
    }
};

const createCasa = async (req, res) => {
    const { utilizador_id, nome, endereco, tipo_casa_id, precopormetro, pessoas } = req.body;
    if (!utilizador_id) {
        console.log("Falta utilizador_id")
        return res.status(400).json({ message: 'Falta utilizador_id' });
      } else if (utilizador_id != req.user.utilizador_id && req.user.cargo_id != 1) {
        console.log("Não está autorizado para criar casa a outros utilizadores")
        return res.status(403).json({ message: 'Não está autorizado para criar casa a outros utilizadores' });
      }
    try {
        const casa = await Casa.create({
            utilizador_id,
            nome,
            endereco,
            tipo_casa_id,
            pessoas,
            precopormetro,
            data_criacao: moment(),
            data_ultalteracao: moment()
        });
        res.status(201).json(casa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: 'Failed to create casa'});
    }
};

const updateCasa = async (req, res) => {
    const { id } = req.params;
    const { utilizador_id, nome, endereco, tipo_casa_id, precopormetro, pessoas } = req.body;
    if (!utilizador_id) {
        console.log("Falta utilizador_id")
        return res.status(400).json({ message: 'Falta utilizador_id' });
      } else if (utilizador_id != req.user.utilizador_id && req.user.cargo_id != 1) {
        console.log("Não está autorizado para editar informações de outros utilizadores")
        return res.status(403).json({ message: 'Não está autorizado para editar informações de outros utilizadores' });
      }
    try {
        const casa = await Casa.findByPk(id, {
            include: {
                model: TipoCasa,
                attributes: ['tipo_casa']
            }
        });
        if (casa) {
            await casa.update({
                utilizador_id,
                nome,
                endereco,
                tipo_casa_id,
                pessoas,
                precopormetro,
                data_ultalteracao: moment()
            });
            res.json(casa);
        } else {
            res.status(404).json({ error: 'Casa not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update casa' });
    }
};


const deleteCasa = async (req, res) => {
    const { id } = req.params;
    try {
        const casa = await Casa.findByPk(id);
        if (casa) {
            await casa.destroy();
            res.json({ message: 'Casa deleted successfully' });
        } else {
            res.status(404).json({ error: 'Casa not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete casa' });
    }
};

module.exports = {
    getAllCasas,
    getCasaById,
    createCasa,
    updateCasa,
    deleteCasa
};