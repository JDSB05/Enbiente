const moment = require('moment');
const Consumo = require('../models/consumos.model');
const Casa = require('../models/casa.model');
const Utilizador = require('../models/utilizador.model');
const sequelize = require('sequelize'); // Add this line to import the Op object from Sequelize
const TipoCasa = require('../models/tipocasa.model');
// Controller actions
const getAllConsumos = async (req, res) => {
    const tipo = req.query.tipo;
    const casa = req.query.casa;
    const utilizador = req.query.utilizador_id;
    try {
        let consumos;

        // Verificar se há query de tipo
        if (tipo === 'ultimosconsumos') {
            try {
                // Buscar todos os consumos com ordenação e limite
                const consumos = await Consumo.findAll({
                    order: [['casa_id', 'ASC'], ['data_consumo', 'DESC']],
                    include: {
                        model: Casa,
                        attributes: ['precopormetro'], // Incluir precopormetro da Casa
                        where: {
                            utilizador_id: utilizador
                        }
                    },
                    attributes: ['casa_id', 'data_consumo', 'volume_consumido'],
                    raw: true,
                });
        
                // Separar os consumos por casa
                const consumosPorCasa = consumos.reduce((acc, consumo) => {
                    const { casa_id } = consumo;
                    if (!acc[casa_id]) {
                        acc[casa_id] = [];
                    }
                    acc[casa_id].push(consumo);
                    return acc;
                }, {});
        
                // Calcular a diferença entre os volumes consumidos do penúltimo e último consumo de cada casa
                const diferencaVolumeConsumido = {};
                for (const casa_id in consumosPorCasa) {
                    const consumosCasa = consumosPorCasa[casa_id];
                    if (consumosCasa.length >= 2) {
                        const ultimoConsumoMesAtual = consumosCasa.find(consumo => moment(consumo.data_consumo).month() === moment().month());
                        console.log("Mes do ultimo consumo" + moment(ultimoConsumoMesAtual.data_consumo).month())
                        console.log('Ultimo consumo do mês atual:', ultimoConsumoMesAtual);
                        const penultimoConsumoMesAnterior = consumosCasa.find(consumo => moment(consumo.data_consumo).month() === (moment().month() - 1 + 12) % 12);
                        console.log("Mes do penultimo consumo" + moment(penultimoConsumoMesAnterior.data_consumo).month())
                        console.log('Penultimo consumo do mês anterior:', penultimoConsumoMesAnterior);
                        if (ultimoConsumoMesAtual && penultimoConsumoMesAnterior) {
                            diferencaVolumeConsumido[casa_id] = ultimoConsumoMesAtual.volume_consumido - penultimoConsumoMesAnterior.volume_consumido;
                        }
                    }
                }
        
                // Calcular a soma de todas as diferenças de volume consumido
                const totalConsumoMesAtual = Object.values(diferencaVolumeConsumido).reduce((acc, diferenca) => acc + diferenca, 0);
                const totalEurosPagarMesAtual = Object.entries(diferencaVolumeConsumido).reduce((acc, [casa_id, diferencaVolume]) => {
                    const precoPorMetro = consumosPorCasa[casa_id][0]['Casa.precopormetro']; // Acessando o precopormetro da casa correspondente
                    const precoTotal = diferencaVolume * precoPorMetro;
                    return acc + precoTotal;
                }, 0);

                // Calcular a diferença entre os volumes consumidos do antepenúltimo e penúltimo consumo de cada casa
                const diferencaVolumeConsumidoAnterior = {};
                for (const casa_id in consumosPorCasa) {
                    const consumosCasa = consumosPorCasa[casa_id];
                    if (consumosCasa.length >= 3) { // Considerar apenas se houver pelo menos três consumos
                        const penultimoConsumo = consumosCasa[1];
                        const antepenultimoConsumo = consumosCasa[2];
                        const penultimoMes = new Date(penultimoConsumo.data_consumo).getMonth();
                        const antepenultimoMes = new Date(antepenultimoConsumo.data_consumo).getMonth();
                        if (penultimoMes === (antepenultimoMes + 1)) {
                            diferencaVolumeConsumidoAnterior[casa_id] = penultimoConsumo.volume_consumido - antepenultimoConsumo.volume_consumido;
                        }
                    }
                }
                // Calcular o total de euros poupados do mês anterior
                const totalEurosPoupadosMesAnterior = Object.entries(diferencaVolumeConsumidoAnterior).reduce((acc, [casa_id, diferencaVolume]) => {
                    const precoPorMetro = consumosPorCasa[casa_id][0]['Casa.precopormetro']; // Acessando o precopormetro da casa correspondente
                    const precoTotal = diferencaVolume * precoPorMetro;
                    return acc + precoTotal;
                }, 0);

                console.log('Total de consumo do mês atual:', totalConsumoMesAtual);
                console.log('Total de euros a pagar do mês atual:', totalEurosPagarMesAtual);
                console.log('Total de euros poupados do mês anterior:', totalEurosPoupadosMesAnterior);
        
                // Agora você pode usar a variável totalConsumoMesAtual conforme necessário
                res.status(200).json({ totalConsumoMesAtual, totalEurosPagarMesAtual: totalEurosPagarMesAtual.toFixed(2), totalEurosPoupadosMesAnterior: totalEurosPoupadosMesAnterior.toFixed(2) });
            } catch (error) {
                console.error('Erro ao buscar consumos:', error);
                res.status(500).send('Erro ao buscar consumos');
            }
        }
        
        else if (tipo === 'consumosporcasa' && casa) {

            consumos = await Consumo.findAll({
                include: {
                    model: Casa,
                    attributes: ['nome', 'precopormetro'], // Incluir nome e precopormetro da Casa
                    where: {
                        utilizador_id: utilizador
                    }
                },
                where: {
                    casa_id: casa
                },
                attributes: ['casa_id', 'data_consumo', 'volume_consumido'],
                raw: true,
            });
            res.json(consumos);
        } else if (tipo === 'consumototal') {
            try {
                // Encontrar todas as casas pertencentes ao utilizador
                const casas = await Casa.findAll({
                    attributes: ['casa_id', 'precopormetro'], // Adicionamos 'precopormetro' para poder calcular os euros gastos
                    where: {
                        utilizador_id: utilizador
                    },
                    raw: true
                });

                // Verificar se existem casas associadas ao utilizador
                if (casas.length === 0) {
                    return res.json({ totalConsumido: 0, eurosGastos: 0, quantidadeCasas: 0 });
                }

                // Contar a quantidade de casas
                const quantidadeCasas = casas.length;

                let totalConsumido = 0;
                let eurosGastos = 0;

                // Iterar sobre todas as casas
                for (const casa of casas) {
                    // Encontrar o último consumo da casa atual
                    const ultimoConsumo = await Consumo.findOne({
                        where: {
                            casa_id: casa.casa_id
                        },
                        order: [['data_consumo', 'DESC']], // Ordenamos por data descendentemente para obter o último consumo
                        raw: true
                    });

                    if (ultimoConsumo) {
                        totalConsumido += ultimoConsumo.volume_consumido; // Adicionamos o volume consumido ao total
                        eurosGastos += ultimoConsumo.volume_consumido * casa.precopormetro; // Calculamos os euros gastos
                    }
                }

                res.json({ totalConsumido, eurosGastos, quantidadeCasas });
            } catch (error) {
                console.error('Erro ao calcular consumo total:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
        else {
            // Caso contrário, buscar todos os consumos
            consumos = await Consumo.findAll({
                include: {
                    model: Casa,
                    attributes: ['nome', 'precopormetro'], // Incluir nome e precopormetro da Casa
                    where: {
                        utilizador_id: utilizador // Filtrar casas pelo utilizador_id
                    },
                    include: {
                        model: TipoCasa,
                        attributes: ['tipo_casa', 'fator'] // Incluir tipo_casa e fator do TipoCasa
                    }
                },
                attributes: ['casa_id', 'data_consumo', 'volume_consumido'],
                raw: true,
            });
            res.json(consumos);
            console.log(consumos);
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getConsumoById = async (req, res) => {
    const { id } = req.params;
    try {
        const consumo = await Consumo.findByPk(id,
            {
                include: {
                    model: Casa,
                    attributes: ['nome', 'endereco', 'pessoas', 'tipo_casa_id', 'precopormetro'], // Incluir nome, endereco, pessoas, tipo_casa_id e precopormetro da Casa
                    include: {
                        model: TipoCasa,
                        attributes: ['tipo_casa'] // Incluir nome, email e telemovel do Utilizador
                    }
                }
            });
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
    const { casa_id, data_consumo, volume_consumido } = req.body;
    try {
        const consumo = await Consumo.create({ casa_id, data_consumo, volume_consumido });
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
