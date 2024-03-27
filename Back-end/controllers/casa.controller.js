const Casa = require('../models/casa.model');
const Utilizador = require('../models/utilizador.model');
const TipoCasa = require('../models/tipocasa.model');

// Controller actions
const getAllCasas = async (req, res) => {
    try {
        const casas = await Casa.findAll({
            include: {
                model: TipoCasa,
                attributes: ['tipo_casa']
            }
        });
        res.json(casas);
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
        if (casa) {
            res.json(casa);
        } else {
            res.status(404).json({ error: 'Casa not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve casa' });
    }
};

const createCasa = async (req, res) => {
    const { utilizador_id, nome, endereco, tipo_casa_id, precopormetro, pessoas, data_criacao, data_ultalteracao } = req.body;
    try {
        const casa = await Casa.create({
            utilizador_id,
            nome,
            endereco,
            tipo_casa_id,
            pessoas,
            precopormetro,
            data_criacao,
            data_ultalteracao
        });
        res.status(201).json(casa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: 'Failed to create casa'});
    }
};

const updateCasa = async (req, res) => {
    const { id } = req.params;
    const { utilizador_id, nome, endereco, tipo_casa_id, precopormetro, pessoas, data_criacao, data_ultalteracao } = req.body;
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
                data_criacao,
                data_ultalteracao
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