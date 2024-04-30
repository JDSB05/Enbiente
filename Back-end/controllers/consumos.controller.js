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
                
                // Função para calcular o total de consumo para um conjunto de consumos de uma casa
                const calcularTotalConsumo = (consumosCasa) => {
                    if (consumosCasa.length === 1) {
                        return consumosCasa[0].volume_consumido; // Se houver apenas um consumo, retorna o volume consumido completo
                    } else {
                        const consumosPorMes = {};

                        // Agrupar os consumos por mês
                        consumosCasa.forEach(consumo => {
                            const mes = moment(consumo.data_consumo).month();
                            if (!consumosPorMes[mes]) {
                                consumosPorMes[mes] = [];
                            }
                            consumosPorMes[mes].push(consumo);
                        });

                        // Obter os últimos consumos de cada mês
                        const ultimosConsumosPorMes = Object.values(consumosPorMes).map(consumosDoMes => {
                            return consumosDoMes.reduce((ultimoConsumo, consumo) => {
                                return !ultimoConsumo || moment(consumo.data_consumo).isAfter(moment(ultimoConsumo.data_consumo)) ? consumo : ultimoConsumo;
                            }, null);
                        });

                        // Calcular a diferença entre o último consumo de um mês e o último consumo do mês anterior
                        let diferencaVolumeConsumido = 0;
                        for (let i = 0; i < ultimosConsumosPorMes.length - 1; i++) {
                            const ultimoConsumoMesAtual = ultimosConsumosPorMes[i];
                            const ultimoConsumoMesAnterior = ultimosConsumosPorMes[i + 1];
                            if (ultimoConsumoMesAtual && ultimoConsumoMesAnterior) {
                                diferencaVolumeConsumido += ultimoConsumoMesAtual.volume_consumido - ultimoConsumoMesAnterior.volume_consumido;
                            }
                        }

                        return diferencaVolumeConsumido;
                    }
                };
                
                
                
                // Calcular o total de consumo do mês atual
                let totalConsumoMesAtual = Object.values(consumosPorCasa).reduce((acc, consumosCasa) => {
                    return acc + calcularTotalConsumo(consumosCasa);
                }, 0);
                
                // Calcular o total de euros a pagar do mês atual e o total de euros poupados do mês anterior
                let totalEurosPagarMesAtual = Object.values(consumosPorCasa).reduce((acc, consumosCasa) => {
                    const precoPorMetro = consumosCasa[0].Casa.precopormetro; // Acessando o precopormetro da casa correspondente
                    return acc + (calcularTotalConsumo(consumosCasa) * precoPorMetro);
                }, 0);
                
                // Calcular o total de euros poupados do mês anterior
                let totalEurosPoupadosMesAnterior = Object.values(consumosPorCasa).reduce((acc, consumosCasa) => {
                    const precoPorMetro = consumosCasa[0].Casa.precopormetro; // Acessando o precopormetro da casa correspondente

                    // Verificar se há pelo menos dois consumos para calcular o total de euros poupados
                    if (consumosCasa.length >= 2) {
                        // Encontrar os consumos dos dois últimos meses
                        const ultimoConsumoMesAtual = consumosCasa.find(consumo => moment(consumo.data_consumo).month() === moment().month());
                        const penultimoConsumoMesAnterior = consumosCasa.find(consumo => moment(consumo.data_consumo).month() === (moment().month() - 1 + 12) % 12);

                        // Verificar se encontramos os consumos dos dois últimos meses
                        if (ultimoConsumoMesAtual && penultimoConsumoMesAnterior) {
                            // Calcular a diferença nos volumes de consumo entre os dois últimos meses
                            const diferencaVolumeConsumido = ultimoConsumoMesAtual.volume_consumido - penultimoConsumoMesAnterior.volume_consumido;

                            // Calcular o total de euros poupados multiplicando a diferença no volume de consumo pelo preço por metro
                            return acc + (diferencaVolumeConsumido * precoPorMetro);
                        }
                    }
                    // Se não houver mês anterior ou se os consumos dos dois últimos meses não forem encontrados,
                    // retorne o total de euros a pagar do mês atual
                    return acc + (calcularTotalConsumo(consumosCasa) * precoPorMetro);
                }, 0);
                // Converter tudo a posiitivo
                totalConsumoMesAtual = Math.abs(totalConsumoMesAtual);
                totalEurosPagarMesAtual = Math.abs(totalEurosPagarMesAtual);
                totalEurosPoupadosMesAnterior = Math.abs(totalEurosPoupadosMesAnterior);

                
                console.log('Total de consumo do mês atual:', totalConsumoMesAtual);
                console.log('Total de euros a pagar do mês atual:', totalEurosPagarMesAtual);
                console.log('Total de euros poupados do mês anterior:', totalEurosPoupadosMesAnterior);

                let valorMesAtual = parseFloat(totalEurosPagarMesAtual.toFixed(2));
                let valorMesAnterior = parseFloat(totalEurosPoupadosMesAnterior.toFixed(2));
                const percentagem = parseFloat((( (valorMesAtual - valorMesAnterior) / valorMesAnterior) * 100).toFixed(2));
                const poupadoPercentagem = percentagem;
                const poupadoEuros = parseFloat((valorMesAnterior-valorMesAtual).toFixed(2));

                console.log('Percentagem poupada:', poupadoPercentagem);
                console.log('Euros poupados:', poupadoEuros);
                // Agora você pode usar as variáveis conforme necessário
                res.status(200).json({ totalConsumoMesAtual: totalConsumoMesAtual.toFixed(3), totalEurosPagarMesAtual: totalEurosPagarMesAtual.toFixed(2), totalEurosPoupadosMesAnterior: totalEurosPoupadosMesAnterior.toFixed(2), poupadoPercentagem, poupadoEuros});
                
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
                    });

                    if (ultimoConsumo) {
                        totalConsumido += ultimoConsumo.volume_consumido; // Adicionamos o volume consumido ao total
                        eurosGastos += ultimoConsumo.volume_consumido * casa.precopormetro; // Calculamos os euros gastos
                    }
                }

                res.json({ totalConsumido, eurosGastos: eurosGastos.toFixed(2), quantidadeCasas });
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
                    attributes: ['casa_id', 'data_consumo', 'volume_consumido']
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
            consumos = await Consumo.findAll({
                include: {
                    model: Casa,
                    attributes: ['nome', 'precopormetro', 'pessoas'],
                    where: {
                        utilizador_id: utilizador
                    },
                    include: {
                        model: TipoCasa,
                        attributes: ['tipo_casa', 'fator']
                    }
                },
                attributes: ['casa_id', 'data_consumo', 'volume_consumido'],
            });
        
            // Calcular a eficiência de cada consumo
            const consumosComEficiencia = [];
            for (const consumo of consumos) {
                const consumoAnterior = await Consumo.findOne({
                    where: {
                        casa_id: consumo.casa_id,
                        data_consumo: { [Op.lt]: consumo.data_consumo } // Consumo anterior cronologicamente
                    },
                    include: { 
                        model: Casa,
                        attributes: ['pessoas', 'tipo_casa_id'], // Incluir pessoas e tipo_casa_id da Casa
                        include: {
                            model: TipoCasa,
                            attributes: ['fator'] // Incluir fator do TipoCasa
                        }
                    },
                    order: [['data_consumo', 'DESC']] // Ordenado do mais recente para o mais antigo
                });
        
                if (consumoAnterior) {
                    const diffDays = moment(consumo.data_consumo).diff(moment(consumoAnterior.data_consumo), 'days') || 1; // Se a diferença for 0, definir como 1
                    const consumoDiferenca = parseFloat((consumo.volume_consumido - consumoAnterior.volume_consumido).toFixed(3));
                    const consumoIdealDiario = process.env.LITROS_POR_PESSOA_IDEAL / 1000; // Consumo ideal diário por pessoa em m³
                    const consumoIdeal = consumoIdealDiario * consumoAnterior.Casa.pessoas * diffDays * consumoAnterior.Casa.TipoCasa.fator;
                    // Calcula a eficiência hídrica em porcentagem
                    let eficiencia = parseFloat(((consumoIdeal / consumoDiferenca) * 100).toFixed(2))
                    consumosComEficiencia.push({ ...consumo.toJSON(), eficiencia, dataconsumo: consumo.data_consumo });
                } else {
                    // Se não houver consumo anterior, definir a eficiência como 0
                    consumosComEficiencia.push({ ...consumo.toJSON(), eficiencia: 0.00, dataconsumo: consumo.data_consumo });
                }
            }
        
            // Função para converter os objetos Sequelize para objetos simples
            function convertToPlainObject(obj) {
                if (obj instanceof sequelize.Model) {
                    return obj.get({ plain: true });
                } else {
                    return obj;
                }
            }
        
            // Convertendo os consumos para objetos simples
            const consumosPlain = consumosComEficiencia.map(consumo => ({
                ...consumo,
                Casa: convertToPlainObject(consumo.Casa), // Convertendo o objeto Casa
            }));
        
            // Enviar a resposta JSON
            res.json(consumosPlain);
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
        let consumo = {
            casa_id,
            data_consumo,
            volume_consumido
        };
        // CALCULAR EFICIENCIA HIDRICA
        // Busca o último consumo da mesma casa, ordenado cronologicamente, anterior ao consumo atual
        const ultimoConsumo = await Consumo.findOne({
            where: { casa_id, data_consumo: { [Op.lt]: data_consumo } },
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
        // Se o valor_consumido for menor do que o valor_consumido do último consumo, retorne um erro
        if (ultimoConsumo && volume_consumido < ultimoConsumo.volume_consumido) {
            return res.status(400).json({ error: 'O volume consumido não pode ser menor do que o volume consumido do último consumo' });
        } else {
            // Se não houver consumo anterior, cria o novo consumo
            //Cria o novo consumo
            consumo = await Consumo.create({ casa_id, data_consumo, volume_consumido });
        }

        if (ultimoConsumo) {
            console.log('Último consumo:', JSON.stringify(ultimoConsumo));
            // Calcula a diferença em dias entre os dois consumos
            const diffDays = moment(data_consumo).diff(moment(ultimoConsumo.data_consumo), 'days') || 1; // Se a diferença for 0, definir como 1
            const consumoDiferenca = parseFloat((volume_consumido - ultimoConsumo.volume_consumido).toFixed(3));
            const consumoIdealDiario = process.env.LITROS_POR_PESSOA_IDEAL / 1000; // Consumo ideal diário por pessoa em m³
            const consumoIdeal = consumoIdealDiario * ultimoConsumo.Casa.pessoas * diffDays * ultimoConsumo.Casa.TipoCasa.fator;
            // Calcula a eficiência hídrica em porcentagem
            let eficiencia = parseFloat(((consumoIdeal / consumoDiferenca) * 100).toFixed(2));

            try {
                    // Verifica o range de eficiência e cria os alertas correspondentes
                    if (eficiencia < 20) {
                        await Alerta.create({
                            casa_id: casa_id,
                            tipo_alerta: 'Consumo muito acima do ideal',
                            mensagem_alerta: `O consumo com data ${moment(data_consumo).format('DD/MM/YYYY')} da casa está muito acima do ideal de ${consumoIdeal.toFixed(3)} m³. É crucial tomar medidas imediatas para reduzir o consumo.`,
                            data_alerta: new Date(),
                            estado: true // Defina o estado inicial do alerta como ativo
                        });
                    } else if (eficiencia >= 20 && eficiencia < 40) {
                        await Alerta.create({
                            casa_id: casa_id,
                            tipo_alerta: 'Consumo muito acima do ideal',
                            mensagem_alerta: `O consumo com data ${moment(data_consumo).format('DD/MM/YYYY')} da casa está consideravelmente acima do ideal de ${consumoIdeal.toFixed(3)} m³. Recomenda-se tomar medidas para reduzir o consumo.`,
                            data_alerta: new Date(),
                            estado: true // Defina o estado inicial do alerta como ativo
                        });
                    } else if (eficiencia >= 40 && eficiencia < 60) {
                        await Alerta.create({
                            casa_id: casa_id,
                            tipo_alerta: 'Consumo acima do ideal',
                            mensagem_alerta: `O consumo com data ${moment(data_consumo).format('DD/MM/YYYY')} da casa está acima do ideal de ${consumoIdeal.toFixed(3)} m³. Sugere-se buscar maneiras de reduzir o consumo de água.`,
                            data_alerta: new Date(),
                            estado: true // Defina o estado inicial do alerta como ativo
                        });
                    } else if (eficiencia >= 60 && eficiencia < 80) {
                        await Alerta.create({
                            casa_id: casa_id,
                            tipo_alerta: 'Consumo abaixo do ideal',
                            mensagem_alerta: `O consumo com data ${moment(data_consumo).format('DD/MM/YYYY')} da casa está ligeiramente acima do ideal de ${consumoIdeal.toFixed(3)} m³. Pode-se considerar maneiras de otimizar o consumo de água.`,
                            data_alerta: new Date(),
                            estado: true // Defina o estado inicial do alerta como ativo
                        });
                    }
            } catch (error) {
                console.error('Erro ao criar alertas:', error);
                res.status(500).send('Erro ao criar alertas');
            } finally {
                try {
                    // Verificar se há picos de consumo anormal
                    const historicoConsumo = await Consumo.findAll({
                        where: {
                            casa_id,
                            data_consumo: {
                                [Op.between]: [moment(data_consumo).subtract(6, 'months').toDate(), moment(data_consumo).toDate()]
                            }
                        },
                        order: [['data_consumo', 'DESC']]
                    });
                    // Se não houver histórico de consumo suficiente, não é possível verificar picos de consumo anormal
                    if (!historicoConsumo) {
                        console.log('Não há histórico de consumo suficiente para verificar picos de consumo anormal');
                        return res.status(201).json({ consumo, eficiencia: eficiencia.toFixed(2) });
                    }
                    // Calcular a média de consumo dos últimos 6 meses
                    const mediaConsumo = historicoConsumo.reduce((acc, consumo) => acc + consumo.volume_consumido, 0) / historicoConsumo.length;
                    // Calcular o desvio padrão do consumo dos últimos 6 meses
                    const desvioPadrao = Math.sqrt(historicoConsumo.reduce((acc, consumo) => acc + Math.pow(consumo.volume_consumido - mediaConsumo, 2), 0) / historicoConsumo.length);
                    // Verificar se o consumo atual é um pico anormal
                    const consumoAtual = volume_consumido;
                    // Calcular o Z-Score do consumo atual
                    const zScore = (consumoAtual - mediaConsumo) / desvioPadrao;
                    // Se o Z-Score for maior que 2, considera-se um pico de consumo anormal
                    if (zScore > 2) {
                        await Alerta.create({
                            casa_id: casa_id,
                            tipo_alerta: 'Pico de consumo anormal',
                            mensagem_alerta: `O consumo com data ${moment(data_consumo).format('DD/MM/YYYY')} da casa é um pico anormal em comparação com os últimos 6 meses. Verifique se há fugas ou uso excessivo de água.`,
                            data_alerta: new Date(),
                            estado: true // Defina o estado inicial do alerta como ativo
                        });
                }           
                res.status(201).json({ consumo, eficiencia: eficiencia });
                } catch (error) {
                    console.error('Erro ao buscar picos de consumo:', error);
                    res.status(500).send('Erro ao buscar picos de consumo');
                }
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
