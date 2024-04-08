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
                let totalConsumoMesAtual = 0;
                let totalEurosPagarMesAtual = 0;
                let totalEurosPoupadosMesAnterior = 0;
                let lastMonthVolumes = new Map(); // Mapa para armazenar o volume consumido no último mês para cada casa
                let casaPrecosPorMetro = new Map(); // Mapa para armazenar o preço por metro de cada casa
                let lastMonthHasConsumption = false;
            
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
            
                console.log("Consumos vindos da base de dados:", consumos);
            
                // Iterar sobre os consumos para calcular as diferenças e os euros a pagar
                consumos.forEach(consumo => {
                  const casaId = consumo.casa_id; // Movendo a definição de casaId para dentro do escopo da iteração
                  const volumeConsumido = consumo.volume_consumido;
                  const precoPorMetro = consumo['Casa.precopormetro'];
                  const consumoMes = new Date(consumo.data_consumo).getMonth();
                  const currentDate = new Date();
                  const currentMonth = currentDate.getMonth();
                  const lastMonth = (currentMonth - 1 + 12) % 12; // Para lidar com o mês anterior quando o mês atual é janeiro
            
                  console.log('Mês atual:', currentMonth);
                  console.log('Mês anterior:', lastMonth);
                  console.log('Mês do consumo:', consumoMes);
            
                  // Inicializar o volume consumido no último mês para cada casa
                  if (!lastMonthVolumes.has(casaId)) {
                    lastMonthVolumes.set(casaId, 0);
                  }
            
                  // Atualizar o volume consumido no último mês para a casa atual
                  if (consumoMes === lastMonth) {
                    lastMonthVolumes.set(casaId, lastMonthVolumes.get(casaId) + volumeConsumido);
                    lastMonthHasConsumption = true;
                  }
            
                  // Atualizar o preço por metro da casa
                  casaPrecosPorMetro.set(casaId, precoPorMetro);
            
                  // Verificar se o consumo pertence ao mês atual
                  if (consumoMes === currentMonth) {
                    totalConsumoMesAtual += volumeConsumido;
                  }
                
            
                console.log("Volumes consumidos no último mês:", lastMonthVolumes);
                console.log("Preços por metro das casas:", casaPrecosPorMetro);
            
                // Calcular os euros a pagar no último mês para todas as casas
                if (lastMonthHasConsumption) {
                  for (const [casaId, volume] of lastMonthVolumes) {
                    const diferencaVolume = totalConsumoMesAtual - volume;
                    totalEurosPagarMesAtual += diferencaVolume * casaPrecosPorMetro.get(casaId);
                  }
                }
            
                console.log("Total de euros a pagar no mês atual:", totalEurosPagarMesAtual);
            
                // Calcular os euros poupados em relação ao mês anterior para todas as casas
                if (lastMonthHasConsumption && totalConsumoMesAtual < lastMonthVolumes.get(casaId)) {
                  for (const [casaId, volume] of lastMonthVolumes) {
                    const diferencaVolume = volume - totalConsumoMesAtual;
                    totalEurosPoupadosMesAnterior += diferencaVolume * casaPrecosPorMetro.get(casaId);
                  }
                }
            });
                console.log("Total de euros poupados no mês anterior:", totalEurosPoupadosMesAnterior);
            
                res.json({
                  totalConsumoMesAtual,
                  totalEurosPagarMesAtual,
                  totalEurosPoupadosMesAnterior
                });
            } catch (error) {
                console.error('Erro ao buscar os últimos consumos:', error);
                res.status(500).json({ error: 'Internal server error' });
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
