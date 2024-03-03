const Consumo = require('../models/consumos.model');
const Casa = require('../models/casa.model');

// Controller actions
const getAllConsumos = async (req, res) => {
    try {
        const consumos = await Consumo.findAll();
        res.json(consumos);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getConsumoById = async (req, res) => {
    const { id } = req.params;
    try {
        const consumo = await Consumo.findByPk(id);
        if (consumo) {
            res.json(consumo);
        } else {
            res.status(404).json({ error: 'Consumo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createConsumo = async (req, res) => {
    const { casa_id, data_consumo, volume_consumido } = req.body;
    try {
        const consumo = await Consumo.create({ casa_id, data_consumo, volume_consumido });
        res.status(201).json(consumo);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateConsumo = async (req, res) => {
    const { id } = req.params;
    const { casa_id, data_consumo, volume_consumido } = req.body;
    try {
        const consumo = await Consumo.findByPk(id);
        if (consumo) {
            await consumo.update({ casa_id, data_consumo, volume_consumido });
            res.json(consumo);
        } else {
            res.status(404).json({ error: 'Consumo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteConsumo = async (req, res) => {
    const { id } = req.params;
    try {
        const consumo = await Consumo.findByPk(id);
        if (consumo) {
            await consumo.destroy();
            res.json({ message: 'Consumo deleted successfully' });
        } else {
            res.status(404).json({ error: 'Consumo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllConsumos,
    getConsumoById,
    createConsumo,
    updateConsumo,
    deleteConsumo,
};