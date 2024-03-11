const Consumo = require('../models/consumos.model');
const Casa = require('../models/casa.model');
const { Op } = require('sequelize'); // Add this line to import the Op object from Sequelize

// Controller actions
const getAllConsumos = async (req, res) => {
    const organiza = req.query.orderby;
    const top = req.query.top;
    try {
        let consumos;
        let consumoTotals = 0;
        let lastMonthConsumoTotal = 0;
        let penultimateMonthConsumoTotal = 0;
        if (organiza && top) {
            consumos = await Consumo.findAll({
                order: [['data_consumo', organiza]],
                limit: top ? parseInt(top) : 10,
                include: {
                    model: Casa,
                    attributes: [],
                },
                attributes: ['casa_id', 'data_consumo', 'volume_consumido'],
                raw: true,
            });

            console.log('consumos: ');
            console.log(consumos);

            // Calculate the total volume_consumido for the last and penultimate month
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const lastMonth = currentMonth - 1;
            const penultimateMonth = currentMonth - 2;

            consumos.forEach(consumo => {
                const consumoMonth = new Date(consumo.data_consumo).getMonth();
                if (consumoMonth === lastMonth) {
                    lastMonthConsumoTotal += consumo.volume_consumido;
                } else if (consumoMonth === penultimateMonth) {
                    penultimateMonthConsumoTotal += consumo.volume_consumido;
                }
                consumoTotals += consumo.volume_consumido;
            });

            res.json({
                consumos,
                consumoTotals,
                lastMonthConsumoTotal: lastMonthConsumoTotal !== 0 ? lastMonthConsumoTotal : 'Não existe',
                penultimateMonthConsumoTotal: penultimateMonthConsumoTotal !== 0 ? penultimateMonthConsumoTotal : 'Não existe',
            });
        } else {
            consumos = await Consumo.findAll();
            res.json(consumos);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getConsumoById = async (req, res) => {
    const { id } = req.params;
    try {
        const consumo = await Consumo.findByPk(id);
        if (consumo) {
            res.json(consumo);
            console.log(consumo);
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