const TipoCasa = require('../models/tipocasa.model');

// Controller actions
const getAllTipoCasas = async (req, res) => {
    try {
        const tipoCasas = await TipoCasa.findAll();
        res.json(tipoCasas);
        console.log(tipoCasas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createTipoCasa = async (req, res) => {
    if (req.user.cargo_id !== 1) return res.status(401).json({ error: 'Não autorizado' });
    try {
        const { tipo_casa } = req.body;
        const newTipoCasa = await TipoCasa.create({ tipo_casa });
        res.status(201).json(newTipoCasa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getTipoCasaById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoCasa = await TipoCasa.findByPk(id);
        if (!tipoCasa) {
            return res.status(404).json({ message: 'TipoCasa not found' });
        }
        res.json(tipoCasa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateTipoCasa = async (req, res) => {
    if (req.user.cargo_id !== 1) return res.status(401).json({ error: 'Não autorizado' });
    try {
        const { id } = req.params;
        const { tipo_casa } = req.body;
        const tipoCasa = await TipoCasa.findByPk(id);
        if (!tipoCasa) {
            return res.status(404).json({ message: 'TipoCasa not found' });
        }
        tipoCasa.tipo_casa = tipo_casa;
        await tipoCasa.save();
        res.json(tipoCasa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteTipoCasa = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoCasa = await TipoCasa.findByPk(id);
        if (!tipoCasa) {
            return res.status(404).json({ message: 'TipoCasa not found' });
        }
        await tipoCasa.destroy();
        res.json({ message: 'TipoCasa deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllTipoCasas,
    createTipoCasa,
    getTipoCasaById,
    updateTipoCasa,
    deleteTipoCasa,
};