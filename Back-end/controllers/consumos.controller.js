const moment = require('moment');
const Consumo = require('../models/consumos.model');
const Casa = require('../models/casa.model');
const Alerta = require('../models/alerta.model');
const Utilizador = require('../models/utilizador.model');
const sequelize = require('sequelize'); // Add this line to import the Op object from Sequelize
const TipoCasa = require('../models/tipocasa.model');
const { Op } = require('sequelize');
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
                console.log('Ultimos consumos');
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
                        if (ultimoConsumoMesAtual) {
                            if (penultimoConsumoMesAnterior) {
                                diferencaVolumeConsumido[casa_id] = ultimoConsumoMesAtual.volume_consumido - penultimoConsumoMesAnterior.volume_consumido;
                            } else {
                                console.log("Penúltimo consumo do mês anterior não encontrado para casa_id:", casa_id);
                                diferencaVolumeConsumido[casa_id] = ultimoConsumoMesAtual.volume_consumido;
                            }
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
                        const penultimoConsumo = consumosCasa.find(consumo => moment(consumo.data_consumo).month() === moment().subtract(1, 'month').month());
                        const antepenultimoConsumo = consumosCasa.find(consumo => moment(consumo.data_consumo).month() === moment().subtract(2, 'month').month());
                        if (penultimoConsumo && antepenultimoConsumo) {
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
                res.status(200).json({ totalConsumoMesAtual: totalConsumoMesAtual.toFixed(3), totalEurosPagarMesAtual: totalEurosPagarMesAtual.toFixed(2), totalEurosPoupadosMesAnterior: totalEurosPoupadosMesAnterior.toFixed(2) });
            } catch (error) {
                console.error('Erro ao buscar consumos:', error);
                res.status(500).send('Erro ao buscar consumos');
            }
        }
        
        else if (tipo === 'consumosporcasa' && casa) {
            console.log('Consumos por casa');
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
        } else if (tipo === 'consumosmensais') {
            try {
                console.log('Consumos mensais');
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
        
                // Calcular a diferença entre os volumes consumidos do penúltimo e último consumo de cada casa, para os 12 meses anteriores
                const diferencaVolumeConsumido = {};
                for (const casa_id in consumosPorCasa) {
                    const consumosCasa = consumosPorCasa[casa_id];
                    if (consumosCasa.length >= 2) {
                        for (let i = 0; i < 12; i++) {
                            const mesAtual = moment().subtract(i, 'months').month();
                            const mesAnterior = moment().subtract(i + 1, 'months').month();
                            const ultimoConsumoMesAtual = consumosCasa.find(consumo => moment(consumo.data_consumo).month() === mesAtual);
                            const penultimoConsumoMesAnterior = consumosCasa.find(consumo => moment(consumo.data_consumo).month() === mesAnterior);
                            if (ultimoConsumoMesAtual && penultimoConsumoMesAnterior) {
                                if (!diferencaVolumeConsumido[casa_id]) {
                                    diferencaVolumeConsumido[casa_id] = [];
                                }
                                diferencaVolumeConsumido[casa_id].push({
                                    mes: moment(ultimoConsumoMesAtual.data_consumo).format('MMMM'),
                                    volumeconsumido: ultimoConsumoMesAtual.volume_consumido - penultimoConsumoMesAnterior.volume_consumido
                                });
                                const totalDiferencaVolumePorMes = {};
                                for (const casa_id in diferencaVolumeConsumido) {
                                    const diferencaArray = diferencaVolumeConsumido[casa_id];
                                    for (const diferencaObj of diferencaArray) {
                                        const { mes, diferenca } = diferencaObj;
                                        if (!totalDiferencaVolumePorMes[mes]) {
                                            totalDiferencaVolumePorMes[mes] = 0;
                                        }
                                        totalDiferencaVolumePorMes[mes] += diferenca;
                                    }
                                }
                                console.log('Total de diferenças de volume consumido por mês:', totalDiferencaVolumePorMes);
                            }
                        }
                    }
                }
        
                // Calcular a soma de todas as diferenças de volume consumido
                const totalConsumoMesesAnteriores = Object.values(diferencaVolumeConsumido).reduce((acc, diferencaArray) => acc + diferencaArray.reduce((sum, diferenca) => sum + diferenca, 0), 0);
        
                console.log('Total de consumo dos últimos 12 meses:', totalConsumoMesesAnteriores);
                console.log('Diferenças de volume consumido por mês:', diferencaVolumeConsumido);
        
                // Agora você pode usar a variável totalConsumoMesesAnteriores conforme necessário
                res.status(200).json({ totalConsumoMesesAnteriores, diferencaVolumeConsumido });
            } catch (error) {
                console.error('Erro ao buscar consumos mensais:', error);
                res.status(500).send('Erro ao buscar consumos mensais');
            }
        }
        else {
            console.log('Todos os consumos');
            // Caso contrário, buscar todos os consumos
            const consumos = await Consumo.findAll({
                include: {
                    model: Casa,
                    attributes: ['nome', 'precopormetro', 'pessoas'], // Incluir nome e precopormetro da Casa
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
        
            // Calcular a eficiência de cada consumo
            const consumosComEficiencia = [];
            for (const consumo of consumos) {
                const consumoAnterior = await Consumo.findOne({
                    where: {
                        casa_id: consumo.casa_id,
                        data_consumo: { [Op.lt]: consumo.data_consumo } // Consumo anterior cronologicamente
                    },
                    order: [['data_consumo', 'DESC']] // Ordenado do mais recente para o mais antigo
                });
        
                if (consumoAnterior) {
                    const diffDays = moment(consumo.data_consumo).diff(moment(consumoAnterior.data_consumo), 'days') || 1; // Evitar divisão por zero
                    const eficiencia = Math.min((consumo.volume_consumido / (consumo['Casa.pessoas'] * consumo['Casa.TipoCasa.fator'] * diffDays)) * 100, 100);
                    consumosComEficiencia.push({ ...consumo, eficiencia: eficiencia.toFixed(2) });
                } else {
                    // Se não houver consumo anterior, definir a eficiência como 0
                    consumosComEficiencia.push({ ...consumo, eficiencia: 0.00 });
                }
            }
        
            res.json(consumosComEficiencia);
            console.log(consumosComEficiencia);
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
        // Cria o novo consumo
        const consumo = await Consumo.create({ casa_id, data_consumo, volume_consumido });

        // Busca o último consumo da mesma casa, ordenado cronologicamente
        const ultimoConsumo = await Consumo.findOne({
            where: { casa_id },
            include: {
                model: Casa,
                attributes: ['pessoas', 'tipo_casa_id'], // Incluir pessoas e tipo_casa_id da Casa
                include: {
                    model: TipoCasa,
                    attributes: ['fator'] // Incluir fator do TipoCasa
                }
            },
            order: [['data_consumo', 'DESC']]
        });

        if (ultimoConsumo) {
            // Calcula a diferença em dias entre os dois consumos
            const diffDays = moment(data_consumo).diff(moment(ultimoConsumo.data_consumo), 'days');

            // Calcula a eficiência hídrica em porcentagem
            const consumoIdealDiario = process.env.LITROS_POR_PESSOA_IDEAL / 1000; // Consumo ideal diário por pessoa em m³
            let eficiencia = Math.min((volume_consumido / (ultimoConsumo.Casa.pessoas * consumoIdealDiario * diffDays)) * 100, 100);

            // Cria os alertas com base na eficiência, tipo de casa e consumo ideal diário
            const alertas = [];
            try {
                if (eficiencia < 100) {
                    // Calcula o consumo médio ideal de água por pessoa em m³
                    const consumoMedioIdeal = (110 * ultimoConsumo.Casa.pessoas) / 1000;

                    // Verifica o range de eficiência e cria os alertas correspondentes
                    if (eficiencia < 80) {
                        await Alerta.create({
                            casa_id: casa_id,
                            tipo_alerta: 'Consumo abaixo do ideal',
                            mensagem_alerta: `O consumo médio atual da casa está abaixo do ideal de ${consumoMedioIdeal.toFixed(3)} m³ por pessoa por mês.`,
                            data_alerta: new Date(),
                            estado: true // Defina o estado inicial do alerta como ativo
                        });
                    } else if (eficiencia >= 80 && eficiencia < 100) {
                        await Alerta.create({
                            casa_id: casa_id,
                            tipo_alerta: 'Consumo próximo do ideal',
                            mensagem_alerta: `O consumo médio atual da casa está próximo do ideal de ${consumoMedioIdeal.toFixed(3)} m³ por pessoa por mês.`,
                            data_alerta: new Date(),
                            estado: true // Defina o estado inicial do alerta como ativo
                        });
                    }
                } else {
                    eficiencia = 100; // Limita a eficiência a 100%
                    await Alerta.create({
                        casa_id: casa_id,
                        tipo_alerta: 'Consumo superior ao limite',
                        mensagem_alerta: 'O consumo atual excedeu o limite máximo permitido.',
                        data_alerta: new Date(),
                        estado: true // Defina o estado inicial do alerta como ativo
                    });
                }
            } catch (error) {
                console.error('Erro ao criar alertas:', error);
                res.status(500).send('Erro ao criar alertas');
            }

            // Verifica se existem alertas para criar
            if (alertas.length > 0) {
                // Cria os alertas no banco de dados
                const alertasCriados = await Alerta.bulkCreate(alertas);

                // Retorna o consumo criado juntamente com a eficiência hídrica e os alertas
                res.status(201).json({ consumo, eficiencia: eficiencia.toFixed(2), alertas: alertasCriados });
            } else {
                // Se não houver alertas para criar, retorna apenas o consumo
                res.status(201).json({ consumo, eficiencia: eficiencia.toFixed(2) });
            }
        } else {
            // Se não houver consumo anterior, retorna apenas o consumo criado
            res.status(201).json(consumo);
        }
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
