const Consumo = require('../models/consumos.model');
const Casa = require('../models/casa.model');
const sequelize  = require('sequelize'); // Add this line to import the Op object from Sequelize
// Controller actions
const getAllConsumos = async (req, res) => {
    const tipo = req.query.tipo;
    const casa = req.query.casa;
    try {
        let consumos;
        let consumoTotals = 0;
        let lastMonthConsumoTotal = 0;
        let penultimateMonthConsumoTotal = 0;
        let lastMonthWaterValue = 0;
        let penultimateMonthWaterValue = 0;

        // Verificar se há query de tipo
        if (tipo === 'ultimosconsumos') {
            // Se houver, buscar consumos com ordenação e limite
            consumos = await Consumo.findAll({
                order: [['casa_id', 'ASC'],['data_consumo', 'DESC']],
                include: {
                    model: Casa,
                    attributes: ['precopormetro'], // Incluir precopormetro da Casa
                },
                attributes: ['casa_id', 'data_consumo', 'volume_consumido'],
                raw: true,
            });

            // Calcular os totais de consumo e valor total da água
            consumos.forEach(consumo => {
                const casaPrecopormetro = consumo['Casa.precopormetro']; // Obter o precopormetro da casa
                consumoTotals += consumo.volume_consumido;
                const consumoMonth = new Date(consumo.data_consumo).getMonth();
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const lastMonth = currentMonth - 1;
                const penultimateMonth = currentMonth - 2;

                if (consumoMonth === lastMonth) {
                    lastMonthConsumoTotal += consumo.volume_consumido;
                    lastMonthWaterValue += consumo.volume_consumido * casaPrecopormetro;
                } else if (consumoMonth === penultimateMonth) {
                    penultimateMonthConsumoTotal += consumo.volume_consumido;
                    penultimateMonthWaterValue += consumo.volume_consumido * casaPrecopormetro;
                }
            });

            res.json({
                consumos,
                consumoTotals: consumoTotals.toFixed(2),
                lastMonthConsumoTotal: lastMonthConsumoTotal !== 0 ? lastMonthConsumoTotal.toFixed(2) : 'Sem dados',
                penultimateMonthConsumoTotal: penultimateMonthConsumoTotal !== 0 ? penultimateMonthConsumoTotal.toFixed(2) : 'Sem dados',
                lastMonthWaterValue: lastMonthWaterValue.toFixed(2),
                penultimateMonthWaterValue: penultimateMonthWaterValue.toFixed(2),
            });
        }else if (tipo === 'consumosanuais') {
            const consumosAnuais = await Consumo.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.literal('volume_consumido * "Casa"."precopormetro"')), 'preçovolumetotal'],
                    [sequelize.fn('SUM', sequelize.col('volume_consumido')), 'volumetotalconsumido'],
                    [sequelize.fn('TO_CHAR', sequelize.col('data_consumo'), 'YYYY-MM'), 'data']
                ],
                include: {
                    model: Casa,
                    attributes: []
                },
                group: [sequelize.fn('TO_CHAR', sequelize.col('data_consumo'), 'YYYY-MM')],
                raw: true
            });

            consumosAnuais.forEach(consumo => {
                consumo['preçovolumetotal'] = parseFloat(consumo['preçovolumetotal'].toFixed(2));
                consumo['volumetotalconsumido'] = parseFloat(consumo['volumetotalconsumido'].toFixed(2));
            });
        
            res.json(consumosAnuais);
        }
        
        else if (tipo === 'consumosporcasa' && casa) {
            consumos = await Consumo.findAll({
                where: {
                    casa_id: casa
                },
                attributes: ['casa_id', 'data_consumo', 'volume_consumido', 'valor'],
                raw: true,  
            });
            res.json(consumos);
        }else {
            // Caso contrário, buscar todos os consumos
            consumos = await Consumo.findAll();
            res.json(consumos);
        }

        console.log('consumos: ');
        console.log(consumos);
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
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
        console.log('Erro ao processar requisição:', error.message);
    }
};

const createConsumo = async (req, res) => {
    const { casa_id, data_consumo, volume_consumido, valor } = req.body;
    try {
        const consumo = await Consumo.create({ casa_id, data_consumo, volume_consumido, valor });
        res.status(201).json(consumo);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log('Erro ao processar requisição:', error.message);
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
        console.log('Erro ao processar requisição:', error.message);
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
        console.log('Erro ao processar requisição:', error.message);
    }
};


module.exports = {
    getAllConsumos,
    getConsumoById,
    createConsumo,
    updateConsumo,
    deleteConsumo,
};