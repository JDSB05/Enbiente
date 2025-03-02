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
    const utilizador = req.query.utilizador_id;
    if (!utilizador) {
        console.log("Falta utilizador_id")
        return res.status(400).json({ message: 'Falta utilizador_id' });
      } else if (utilizador != req.user.utilizador_id && req.user.cargo_id != 1) {
        console.log("Não está autorizado para aceder a informações de outros utilizadores")
        return res.status(403).json({ message: 'Não está autorizado para aceder a informações de outros utilizadores' });
      }
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
                console.log('Consumos:', JSON.stringify(consumos, null, 2));

                // Separar os consumos por casa e por mês
                const consumosPorCasa = {};

                //tamanho do array
                const tamanho = consumos.length;
                console.log('Tamanho:', tamanho);
                // Iterar sobre cada consumo para organizar por casa, ano e mês
                consumos.forEach(consumo => {
                    const { casa_id, data_consumo } = consumo;
                    const ano = moment(data_consumo).year(); // Obter o ano do consumo
                    const mes = moment(data_consumo).month(); // Obter o mês do consumo

                    // Verificar se a casa já está no objeto consumosPorCasa
                    if (!consumosPorCasa[casa_id]) {
                        consumosPorCasa[casa_id] = {};
                    }

                    // Verificar se o ano já existe para essa casa
                    if (!consumosPorCasa[casa_id][ano]) {
                        // Se o ano não existir, criar um novo objeto para o ano atual
                        consumosPorCasa[casa_id][ano] = {};
                    }

                    // Verificar se o mês já existe para esse ano
                    if (!consumosPorCasa[casa_id][ano][mes]) {
                        // Se o mês não existir, criar um novo array para o mês atual
                        consumosPorCasa[casa_id][ano][mes] = [];
                    }

                    // Adicionar o consumo ao mês correspondente da casa e ano
                    consumosPorCasa[casa_id][ano][mes].push(consumo);
                });

                console.log('Consumos por casa, ano e mês:', JSON.stringify(consumosPorCasa, null, 2));

                // Função para calcular a diferença total no volume consumido entre o mês atual e o mês anterior para todas as casas
                const calcularDiferencaVolumeConsumido = (consumosPorCasa) => {
                    let totalConsumoMesAtual = 0;
                    let totalEurosPagarMesAtual = 0; // Inicializa como número
                    
                    // Se consumosPorCasa for um objeto vazio, retorne um objeto vazio
                    if (Object.keys(consumosPorCasa).length === 0) {
                        console.log('Não existem consumos para calcular a diferença de volume consumido');
                        return { totalConsumoMesAtual, totalEurosPagarMesAtual };
                    }
                    const anoAtual = moment().year().toString();
                    const mesAtual = (moment().month()).toString();
                    // Iterar sobre todas as casas
                    for (const casaId in consumosPorCasa) {
                        const consumosPorAno = consumosPorCasa[casaId];
                        // Verificar se existem consumos para o mês atual
                        if (consumosPorAno[anoAtual] && consumosPorAno[anoAtual][mesAtual]) {
                            // Obter os consumos do mês atual e do mês anterior
                            const consumosMesAtual = consumosPorAno[anoAtual][mesAtual];
                            console.log('Consumos do mês atual:', JSON.stringify(consumosMesAtual, null, 2));
                            const consumosMesAnterior = mesAtual === '0' ? (consumosPorAno[(moment().year() - 1).toString()]?.['11'] || []) : consumosPorAno[anoAtual][mesAtual - 1] || [];
                            console.log('Consumos do mês anterior:', JSON.stringify(consumosMesAnterior, null, 2));
                            // Verificar se existem consumos para o mês anterior
                            if (consumosMesAnterior && consumosMesAnterior.length > 0) {
                                totalConsumoMesAtual += consumosMesAtual[0].volume_consumido - consumosMesAnterior[0].volume_consumido; // Se for preciso, adicionar outros calculos aqui
                                // Calcula o preço total da diferença de volume consumido, adiciona o preco por cada casa
                                const precoDiferencaCasa = (consumosMesAtual[0].volume_consumido - consumosMesAnterior[0].volume_consumido) * consumosMesAtual[0].Casa.precopormetro;
                                totalEurosPagarMesAtual += precoDiferencaCasa;
                            } else {
                                // Se não houver consumos para o mês anterior, adicione o volume consumido do mês atual ao total
                                totalConsumoMesAtual += consumosMesAtual[0].volume_consumido; // Se for preciso, adicionar outros calculos aqui
                                // Calcula o preço total da diferença de volume consumido
                                const precoTotalCasa = consumosMesAtual[0].volume_consumido * consumosMesAtual[0].Casa.precopormetro;
                                totalEurosPagarMesAtual += precoTotalCasa;
                            }
                        } else {
                            // Se não houver consumos para o mês atual, não adicione nada ao total
                            console.log('Não existem consumos para o mês de', moment().month(parseInt(mesAtual)).locale('pt').format('MMMM'), 'da casa com id:', casaId);
                        }
                    }
                    return { totalConsumoMesAtual, totalEurosPagarMesAtual }; // Retorna ambos os valores
                };
                // Função para calcular a diferença total no volume consumido entre o mês atual e o mês anterior para todas as casas
                const calcularDiferencaVolumeConsumidoAnterior = (consumosPorCasa) => {
                    let totalConsumoMesAnterior = 0;
                    let totalEurosPoupadosMesAnterior = 0; // Inicializa como número
                    
                    // Se consumosPorCasa for um objeto vazio, retorne um objeto vazio
                    if (Object.keys(consumosPorCasa).length === 0) {
                        console.log('Não existem consumos para calcular a diferença de volume consumido');
                        return { totalConsumoMesAnterior, totalEurosPoupadosMesAnterior };
                    }
                    const anoAtual = moment().year().toString();
                    const mesAtual = (moment().month()-1).toString();
                    // Iterar sobre todas as casas
                    for (const casaId in consumosPorCasa) {
                        const consumosPorAno = consumosPorCasa[casaId];
                        // Verificar se existem consumos para o mês atual
                        if (consumosPorAno[anoAtual] && consumosPorAno[anoAtual][mesAtual]) {
                            // Obter os consumos do mês atual e do mês anterior
                            const consumosMesAtual = consumosPorAno[anoAtual][mesAtual];
                            console.log('Consumos do mês atual:', JSON.stringify(consumosMesAtual, null, 2));
                            const consumosMesAnterior = mesAtual === '0' ? (consumosPorAno[(moment().year() - 1).toString()]?.['11'] || []) : consumosPorAno[anoAtual][mesAtual - 1] || [];
                            console.log('Consumos do mês anterior:', JSON.stringify(consumosMesAnterior, null, 2));
                            // Verificar se existem consumos para o mês anterior
                            if (consumosMesAnterior && consumosMesAnterior.length > 0) {
                                totalConsumoMesAnterior += consumosMesAtual[0].volume_consumido - consumosMesAnterior[0].volume_consumido; // Se for preciso, adicionar outros calculos aqui
                                // Calcula o preço total da diferença de volume consumido, adiciona o preco por cada casa
                                const precoDiferencaCasa = (consumosMesAtual[0].volume_consumido - consumosMesAnterior[0].volume_consumido) * consumosMesAtual[0].Casa.precopormetro;
                                totalEurosPoupadosMesAnterior += precoDiferencaCasa;
                            } else {
                                // Se não houver consumos para o mês anterior, adicione o volume consumido do mês atual ao total
                                totalConsumoMesAnterior += consumosMesAtual[0].volume_consumido; // Se for preciso, adicionar outros calculos aqui
                                // Calcula o preço total da diferença de volume consumido
                                const precoTotalCasa = consumosMesAtual[0].volume_consumido * consumosMesAtual[0].Casa.precopormetro;
                                totalEurosPoupadosMesAnterior += precoTotalCasa;
                            }
                        } else {
                            // Se não houver consumos para o mês atual, não adicione nada ao total
                            console.log('Não existem consumos para o mês de', moment().month(parseInt(mesAtual)).locale('pt').format('MMMM'), 'da casa com id:', casaId);
                        }
                    }
                    return { totalConsumoMesAnterior, totalEurosPoupadosMesAnterior }; // Retorna ambos os valores
                };
                // Calcular o total de consumo do mês atual
                let {totalConsumoMesAtual,totalEurosPagarMesAtual} = calcularDiferencaVolumeConsumido(consumosPorCasa);
                let {totalConsumoMesAnterior,totalEurosPoupadosMesAnterior} = calcularDiferencaVolumeConsumidoAnterior(consumosPorCasa);
                           
                console.log('Total de consumo do mês atual:', totalConsumoMesAtual);
                console.log('Total de euros a pagar do mês atual:', totalEurosPagarMesAtual);
                console.log('Total de euros poupados do mês anterior:', totalEurosPoupadosMesAnterior);
                
                let poupadoPercentagem = 0;
                let poupadoEuros = 0;
                //Se tiver consumos no mês atual, calcular a percentagem poupada
                if (totalConsumoMesAtual && totalConsumoMesAnterior > 0) {
                    let valorMesAtual = parseFloat(totalEurosPagarMesAtual.toFixed(2));
                    let valorMesAnterior = parseFloat(totalEurosPoupadosMesAnterior.toFixed(2));
                    const percentagem = parseFloat((((valorMesAtual - valorMesAnterior) / valorMesAnterior) * 100).toFixed(2));
                    poupadoPercentagem = percentagem;
                    poupadoEuros = parseFloat((valorMesAnterior - valorMesAtual).toFixed(2));

                    console.log('Percentagem poupada:', poupadoPercentagem);
                    console.log('Euros poupados:', poupadoEuros);
                }
                
                res.status(200).json({ totalConsumoMesAtual: totalConsumoMesAtual.toFixed(3), totalEurosPagarMesAtual: totalEurosPagarMesAtual.toFixed(2), totalEurosPoupadosMesAnterior: totalEurosPoupadosMesAnterior.toFixed(2), poupadoPercentagem, poupadoEuros});
                
            } catch (error) {
                console.error('Erro ao buscar consumos:', error);
                res.status(500).send('Erro ao buscar consumos');
            }
        }
        
        else if (tipo === 'consumosporcasa') {
            console.log('Consumos por casa');
            // Buscar todos os consumos com ordenação e limite
            const consumos = await Consumo.findAll({
                order: [['casa_id', 'ASC'], ['data_consumo', 'DESC']],
                include: {
                    model: Casa,
                    attributes: ['nome','precopormetro'], 
                    where: {
                        utilizador_id: utilizador
                    }
                },
                attributes: ['casa_id', 'data_consumo', 'volume_consumido'],
            });

            const Casas = await Casa.findAll({
                where: {
                    utilizador_id: utilizador
                },
                attributes: ['casa_id', 'nome']
            });
            // Separar os consumos por casa e por mês
            const consumosPorCasa = {};

            // Iterar sobre cada consumo para organizar por casa, ano e mês
            consumos.forEach(consumo => {
                const { casa_id, data_consumo } = consumo;
                const ano = moment(data_consumo).year(); // Obter o ano do consumo
                const mes = moment(data_consumo).month(); // Obter o mês do consumo

                // Verificar se a casa já está no objeto consumosPorCasa
                if (!consumosPorCasa[casa_id]) {
                    consumosPorCasa[casa_id] = {};
                }

                // Verificar se o ano já existe para essa casa
                if (!consumosPorCasa[casa_id][ano]) {
                    // Se o ano não existir, criar um novo objeto para o ano atual
                    consumosPorCasa[casa_id][ano] = {};
                }

                // Verificar se o mês já existe para esse ano
                if (!consumosPorCasa[casa_id][ano][mes]) {
                    // Se o mês não existir, criar um novo array para o mês atual
                    consumosPorCasa[casa_id][ano][mes] = [];
                }

                // Adicionar o consumo ao mês correspondente da casa e ano
                consumosPorCasa[casa_id][ano][mes].push(consumo);
            });

            console.log('Consumos por casa, ano e mês:', JSON.stringify(consumosPorCasa, null, 2));

            // Função para calcular a diferença no volume consumido entre o mês atual e o mês anterior para todas as casas
            const calcularDiferencaVolumeConsumido = (consumosPorCasa) => {
                let totalConsumoMesAtual = {};
                // Se consumosPorCasa for um objeto vazio, retorne um objeto vazio
                if (Object.keys(consumosPorCasa).length === 0) {
                    console.log('Não existem consumos para calcular a diferença de volume consumido');
                    return totalConsumoMesAtual;
                }
                const anoAtual = moment().year().toString();
                const mesAtual = (moment().month()).toString();
                // Iterar sobre todas as casas
                for (const casaId in consumosPorCasa) {
                    const consumosPorAno = consumosPorCasa[casaId];
                    let nomeCasa = Casas.find(casa => casa.casa_id === parseInt(casaId))?.nome || null;
                    // Inicializar a 0
                    totalConsumoMesAtual[nomeCasa] = 0;
                        // Verificar se existem consumos para o mês atual
                        if (consumosPorAno[anoAtual] && consumosPorAno[anoAtual][mesAtual]) {
                            // Obter os consumos do mês atual e do mês anterior
                            const consumosMesAtual = consumosPorAno[anoAtual][mesAtual];
                            const consumosMesAnterior = mesAtual === '0' ? (consumosPorAno[(moment().year() - 1).toString()]?.['11'] || []) : consumosPorAno[anoAtual][mesAtual - 1] || [];
                            // Verificar se existem consumos para o mês anterior
                            if (consumosMesAnterior && consumosMesAnterior.length > 0) {
                                totalConsumoMesAtual[nomeCasa] += parseFloat((consumosMesAtual[0].volume_consumido - consumosMesAnterior[0].volume_consumido).toFixed(3)); // Se for preciso, adicionar outros calculos aqui
                            } else {
                                // Se não houver consumos para o mês anterior, adicione o volume consumido do mês atual ao total
                                totalConsumoMesAtual[nomeCasa] += parseFloat((consumosMesAtual[0].volume_consumido).toFixed(3)); // Se for preciso, adicionar outros calculos aqui
                            }

                        } else {
                            // Se não houver consumos para o mês atual, não adicione nada ao total
                            console.log('Não existem consumos para o mês de', moment().month(parseInt(mesAtual)).locale('pt').format('MMMM'), 'da casa com id:', casaId);
                        }
                }
                return totalConsumoMesAtual;
            };
            const totalConsumoMesAtual = calcularDiferencaVolumeConsumido(consumosPorCasa);
            console.log('Total de consumo do mês atual:', totalConsumoMesAtual);
            res.status(200).json({ totalConsumoMesAtual });
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
                console.log('Total consumido:', totalConsumido);
                console.log('Euros gastos:', eurosGastos);
                res.json({ totalConsumido: totalConsumido.toFixed(3), eurosGastos: eurosGastos.toFixed(2), quantidadeCasas });
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
                });

                // Separar os consumos por casa e por mês
                const consumosPorCasa = {};

                // Iterar sobre cada consumo para organizar por casa, ano e mês
                consumos.forEach(consumo => {
                    const { casa_id, data_consumo } = consumo;
                    const ano = moment(data_consumo).year(); // Obter o ano do consumo
                    const mes = moment(data_consumo).month(); // Obter o mês do consumo

                    // Verificar se a casa já está no objeto consumosPorCasa
                    if (!consumosPorCasa[casa_id]) {
                        consumosPorCasa[casa_id] = {};
                    }

                    // Verificar se o ano já existe para essa casa
                    if (!consumosPorCasa[casa_id][ano]) {
                        // Se o ano não existir, criar um novo objeto para o ano atual
                        consumosPorCasa[casa_id][ano] = {};
                    }

                    // Verificar se o mês já existe para esse ano
                    if (!consumosPorCasa[casa_id][ano][mes]) {
                        // Se o mês não existir, criar um novo array para o mês atual
                        consumosPorCasa[casa_id][ano][mes] = [];
                    }

                    // Adicionar o consumo ao mês correspondente da casa e ano
                    consumosPorCasa[casa_id][ano][mes].push(consumo);
                });
        
                const calcularDiferencaVolumeConsumidoAnual = (consumosPorCasa, mesesAnteriores = 12) => {
                    let totalConsumoMes = {};
                    let totalEurosPagarMes = {};
                
                    let mesAtual = moment().month();
                    let ano = moment().year();
                    // Se consumosPorCasa for um objeto vazio, retorne um objeto vazio
                    if (Object.keys(consumosPorCasa).length === 0) {
                        console.log('Não existem consumos para calcular a diferença de volume consumido');
                        return { totalConsumoMes, totalEurosPagarMes };
                    }
                    for (let i = 0; i < mesesAnteriores; i++) {
                        // Se o mês atual for janeiro, subtraia um ano e defina o mês como dezembro
                        if (mesAtual === 0) {
                            ano--;
                            mesAtual = 11; // Dezembro
                        }
                
                        const mesAtualStr = mesAtual.toString();
                        let dataconsumo = moment().subtract(i, 'months').format('MM/YYYY');
                
                        // Iterar sobre todas as casas
                        for (const casaId in consumosPorCasa) {
                            const consumosPorAno = consumosPorCasa[casaId];
                            const consumosMesAtual = consumosPorAno[ano.toString()]?.[mesAtualStr] || [];
                            const consumosMesAnterior = mesAtual === 0
                                ? (consumosPorAno[(ano - 1).toString()]?.['11'] || [])
                                : (consumosPorAno[ano.toString()]?.[(mesAtual - 1).toString()] || []);

                            // Verificar se existem consumos para o mês anterior
                            if (consumosMesAtual.length > 0 && consumosMesAnterior.length > 0) {
                                // Se houver consumos para o mês anterior, calcule a diferença de volume consumido
                                dataconsumo = moment(consumosMesAtual[0].data_consumo).format('MM/YYYY');
                                const diferencaVolumeConsumido = parseFloat((consumosMesAtual[0].volume_consumido - consumosMesAnterior[0].volume_consumido).toFixed(3));
                                totalConsumoMes[dataconsumo] = parseFloat((totalConsumoMes[dataconsumo] || 0) + diferencaVolumeConsumido.toFixed(3)); // Se for preciso, adicionar outros calculos aqui
                                totalEurosPagarMes[dataconsumo] = parseFloat((totalEurosPagarMes[dataconsumo] || 0) + (diferencaVolumeConsumido * consumosMesAtual[0].Casa.precopormetro).toFixed(2));
                            } else if (consumosMesAtual.length > 0) {
                                // Se não houver consumos para o mês anterior, adicione o volume consumido do mês atual ao total
                                dataconsumo = moment(consumosMesAtual[0].data_consumo).format('MM/YYYY');
                                //totalConsumoMes[dataconsumo] = parseFloat((totalConsumoMes[dataconsumo] || 0) + consumosMesAtual[0].volume_consumido.toFixed(3)); // Se for preciso, adicionar outros calculos aqui
                                //totalEurosPagarMes[dataconsumo] = 0; 
                            
                            } else {
                                // Se não houver consumos para o mês atual, não adicione nada ao total, mas deixe o valor como 0
                                const ultimaData = Object.keys(totalConsumoMes).pop();
                                dataconsumo = moment(ultimaData, 'MM/YYYY').subtract(1, 'months').format('MM/YYYY');
                                if (dataconsumo === 'Invalid date') dataconsumo = moment().format('MM/YYYY');
                                //totalConsumoMes[dataconsumo] = (totalConsumoMes[dataconsumo] || 0);
                                //totalEurosPagarMes[dataconsumo] = 0;
                            }
                        }
                        mesAtual--;
                    }

                    return { totalConsumoMes, totalEurosPagarMes }; // Retorna ambos os valores
                };
                

                let { totalConsumoMes, totalEurosPagarMes } = calcularDiferencaVolumeConsumidoAnual(consumosPorCasa);

                console.log('Total de consumo dos últimos 12 meses:', totalConsumoMes);
                console.log('Preço por mês:', totalEurosPagarMes);
        
                // Agora você pode usar a variável totalConsumoMesesAnteriores conforme necessário
                res.status(200).json({ totalConsumoMes, totalEurosPagarMes });
            } catch (error) {
                console.error('Erro ao buscar consumos mensais:', error);
                res.status(500).send('Erro ao buscar consumos mensais');
            }
        }
        else {
            console.log('Todos os consumos');
            // Caso contrário, buscar todos os consumos
            // Buscar todos os consumos com ordenação e limite
            const consumos = await Consumo.findAll({
                order: [['casa_id', 'ASC'], ['data_consumo', 'DESC']],
                include: {
                    model: Casa,
                    attributes: ['nome','precopormetro', 'pessoas'], 
                    where: {
                        utilizador_id: utilizador
                    },
                    include: {
                        model: TipoCasa,
                        attributes: ['fator'] // Incluir fator do TipoCasa
                    }
                },
                attributes: ['casa_id', 'data_consumo', 'volume_consumido'],
            });
            // Separar os consumos por casa
            const consumosPorCasa = {};
            //console.log('Consumos:', JSON.stringify(consumos, null, 2));
            // Iterar sobre cada consumo para organizar por casa
            consumos.forEach(consumo => {
                const { casa_id } = consumo;
            
                // Verificar se a casa já está no objeto consumosPorCasa
                if (!consumosPorCasa[casa_id]) {
                    consumosPorCasa[casa_id] = [];
                }
            
                // Adicionar o consumo à lista de consumos da casa
                consumosPorCasa[casa_id].push(consumo);
            });
            //console.log('Consumos por casa:', JSON.stringify(consumosPorCasa, null, 2));
        
            // Função para calcular a eficiência de cada consumo agrupado por casa
            async function calcularEficiencia(consumosPorCasa) {
                const consumosComEficiencia = [];

                // Iterar sobre cada casa
                for (const casaId in consumosPorCasa) {
                    const consumos = consumosPorCasa[casaId];
                    // Iterar sobre os consumos da casa
                    for (const consumo of consumos) {
                        console.log('Consumo:', consumo.toJSON());
                        const consumoAnterior = consumos.find(consumoAnt => moment(consumoAnt.data_consumo).isBefore(moment(consumo.data_consumo)));
                        if (consumoAnterior) {
                            console.log('Consumo anterior:', consumoAnterior.toJSON());
                            const diffDays = moment(consumo.data_consumo).diff(moment(consumoAnterior.data_consumo), 'days') || 1; // Se a diferença for 0, definir como 1
                            const consumoDiferenca = parseFloat((consumo.volume_consumido - consumoAnterior.volume_consumido).toFixed(3));
                            const consumoIdealDiario = process.env.LITROS_POR_PESSOA_IDEAL / 1000; // Consumo ideal diário por pessoa em m³
                            const consumoIdeal = consumoIdealDiario * consumo.Casa.pessoas * diffDays * consumo.Casa.TipoCasa.fator;
                            // Calcula a eficiência hídrica em porcentagem
                            let eficiencia = parseFloat(((consumoIdeal / consumoDiferenca) * 100).toFixed(2))
                            consumosComEficiencia.push({ ...consumo.toJSON(), eficiencia, dataconsumo: consumo.data_consumo });
                        } else {
                            // Se não houver consumo anterior, definir a eficiência como 0
                            console.log('Não há consumo anterior');
                            consumosComEficiencia.push({ ...consumo.toJSON(), eficiencia: 0.00, dataconsumo: consumo.data_consumo });
                        }
                    }
                }

                return consumosComEficiencia;
            }

            // Calcular a eficiência de cada consumo por casa, ano e mês
            const consumosComEficiencia = await calcularEficiencia(consumosPorCasa);

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
            console.log('Consumos com eficiência:', JSON.stringify(consumosPlain, null, 2));
            res.json(consumosPlain)
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
                    attributes: ['nome', 'endereco', 'pessoas', 'tipo_casa_id', 'precopormetro', 'utilizador_id'], // Incluir nome, endereco, pessoas, tipo_casa_id e precopormetro da Casa
                    include: {
                        model: TipoCasa,
                        attributes: ['tipo_casa'] // Incluir nome, email e telemovel do Utilizador
                    }
                }
            });
        // Se o consumo pertencer a um utilizador diferente, retorne um erro
        if (consumo.Casa.utilizador_id == req.user.utilizador_id || req.user.cargo_id == 1) {
            res.json(consumo);
        } else if (consumo.Casa.utilizador_id != req.user.utilizador && req.user.cargo != 1) {
            console.log('Não está autorizado para aceder a informações de outros utilizadores')
            res.status(403).json({ message: 'Não está autorizado para aceder a informações de outros utilizadores' });
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
        // Verificar se todos os campos obrigatórios foram preenchidos
        if (!casa_id || !data_consumo || !volume_consumido) {
            console.log('Preencha todos os campos obrigatórios');
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
        }
        // CALCULAR EFICIENCIA HIDRICA
        // Busca o último consumo da mesma casa, ordenado cronologicamente, anterior ao consumo atual
        const ultimoConsumo = await Consumo.findOne({
            where: { casa_id, data_consumo: { [Op.lt]: data_consumo } },
            include: {
                model: Casa,
                attributes: ['pessoas', 'tipo_casa_id', 'utilizador_id'], // Incluir pessoas e tipo_casa_id da Casa
                include: {
                    model: TipoCasa,
                    attributes: ['fator'] // Incluir fator do TipoCasa
                }
            },
            order: [['data_consumo', 'DESC']]
        });
        const consumoMaisRecente = await Consumo.findOne({
            where: { casa_id, data_consumo: { [Op.gt]: data_consumo } },
            include: {
                model: Casa,
                attributes: ['pessoas', 'tipo_casa_id', 'utilizador_id'], // Incluir pessoas e tipo_casa_id da Casa
                include: {
                    model: TipoCasa,
                    attributes: ['fator'] // Incluir fator do TipoCasa
                }
            },
            order: [['data_consumo', 'ASC']]
        });

        if (ultimoConsumo && (ultimoConsumo.Casa.utilizador_id != req.user.utilizador_id && req.user.cargo_id != 1)) {
            // Se o consumo anterior pertencer a outro utilizador, retorne um erro
            console.log('Não está autorizado para criar consumo a outros utilizadores');
            return res.status(403).json({ message: 'Não está autorizado para criar casa a outros utilizadores' });
        }
        // Se o valor_consumido for menor do que o valor_consumido do último consumo, retorne um erro
         else if (ultimoConsumo && volume_consumido < ultimoConsumo.volume_consumido) {
            console.log('O volume consumido não pode ser menor do que o volume consumido do último consumo');
            return res.status(400).json({ error: 'O volume consumido não pode ser menor do que o volume consumido do último consumo' });
        } 
        // Se o valor_consumido for maior ao valor_consumido do consumo mais recente, retorne um erro
         else if (consumoMaisRecente && volume_consumido > consumoMaisRecente.volume_consumido) {
            console.log('O volume consumido não pode ser maior do que o volume consumido do consumo mais recente');
            return res.status(400).json({ error: 'O volume consumido não pode ser maior do que o volume consumido do consumo mais recente' });
         }
         else {
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
        const consumo = await Consumo.findByPk(id, {
            include: {
                model: Casa,
                attributes: ['utilizador_id'], // Incluir utilizador_id da Casa
            }
        });
        // Verificar se o consumo pertence ao utilizador
        if (consumo && (consumo.Casa.utilizador_id == req.user.utilizador_id || req.user.cargo_id == 1)) {
            await consumo.update({ casa_id, data_consumo, volume_consumido });
            res.json(consumo);
        } else if (consumo && consumo.Casa.utilizador_id != req.user.utilizador_id && req.user.cargo_id != 1) {
            console.log('Não está autorizado para editar consumos de outros utilizadores');
            res.status(403).json({ message: 'Não está autorizado para editar consumos de outros utilizadores' });
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
