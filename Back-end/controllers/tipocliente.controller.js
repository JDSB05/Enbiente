const TipoCliente = require('../models/tipocliente.model');

// Controller actions
const getAllTipoClientes = async (req, res) => {
    try {
        const tipoClientes = await TipoCliente.findAll();
        res.json(tipoClientes);
        console.log(tipoClientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createTipoCliente = async (req, res) => {
    if (req.user.cargo_id !== 1) {
        console.log("Não autorizado")
        return res.status(401).json({ error: 'Não autorizado' });}
    try {
        const { tipo_cliente } = req.body;
        const newTipoCliente = await TipoCliente.create({ tipo_cliente });
        res.status(201).json(newTipoCliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getTipoClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoCliente = await TipoCliente.findByPk(id);
        if (!tipoCliente) {
            return res.status(404).json({ message: 'TipoCliente not found' });
        }
        res.json(tipoCliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateTipoCliente = async (req, res) => {
    if (req.user.cargo_id !== 1) {
        console.log("Não autorizado")
        return res.status(401).json({ error: 'Não autorizado' });}
    try {
        const { id } = req.params;
        const { tipo_cliente } = req.body;
        const tipoCliente = await TipoCliente.findByPk(id);
        if (!tipoCliente) {
            return res.status(404).json({ message: 'TipoCliente not found' });
        }
        tipoCliente.tipo_cliente = tipo_cliente;
        await tipoCliente.save();
        res.json(tipoCliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteTipoCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoCliente = await TipoCliente.findByPk(id);
        if (!tipoCliente) {
            return res.status(404).json({ message: 'TipoCliente not found' });
        }
        await tipoCliente.destroy();
        res.json({ message: 'TipoCliente deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllTipoClientes,
    createTipoCliente,
    getTipoClienteById,
    updateTipoCliente,
    deleteTipoCliente,
};