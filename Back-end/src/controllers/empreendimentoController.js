const Empreendimento = require('../model/Empreendimento');
const Utilizador = require('../model/Utilizador');
const controllers = {};
const operacoesExcel = require('./utils/operacoesExcel');

controllers.list = async (req, res) => {
  try {
    const data = await Empreendimento.findAll({
      order: [['createdAt', 'DESC']]
    });    
    res.status(200).json({
      success: true,
      message: "Lista de empreendimentos obtida com sucesso.",
      data,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.json({ success: false, message: 'Ocorreu um erro ao listar os empreendimentos.'});
  } 
};

controllers.create = async (req, res) => {
  try {
  const utilizadorId = req.decoded.id;
  const dados = { 
    campNome,
    campMorada,
    documentoTecnico,
    campDistrito,
    campMunicipio,
    campNCertificadoEnergetico,
    campTipologia,
    campFaseVida,
    campNUA,
    campTaxaOcupacao,
    campOcupacaoMaxima,
    campConsumoAnual,
    campAPAutoclismos,
    campAPLavarRoupa,
    campAPRegaJardim,
    campAPRegaCampoGolfe,
    campAPLagosFontes,
    campVolumeDepositoAP,
    campIdadesRedeAgua,
    campSistemaRega,
    campConsumoSistemaRega,
    campAreaLote,
    campAreaImplantacao,
    campAreaPassivelCoberturaVerde,
    campAreaCoberturaVerdeInstalada,
    campAreaRelvada,
    campAreaRegadaComSistemaRega,
    campAreaPermeavelNaoAjardinada,
    campAreaExteriorImpermeabilizada,
    campNLagosFontes,
    campVolumePiscina,
    campNJacuzzis,
    campDispositivos,
    campInternoEspecificacoes,
    campInternoAutoclismo,
    campInternoLavagem,
    campComunsEspecificacoes,
    campComunsVolumes,
    campComunsLavagem,
    campGolfeAreaTotalCampo,
    campGolfeAreaRelvadaComEspecies,
    campGolfeConsumoRega,
    campSistemaProducaoAguaQuente,
    campIdadeSistemaProducaoAguaQuente } = req.body;

    const excel = await operacoesExcel.createExcel(utilizadorId, dados);
    if(!excel)
      throw new Error("Documento Excel falhou!");
    
      const data = await Empreendimento.create({
      nome: campNome,
      morada: campMorada,
      utilizadorId,
      excel,
      documentoTecnico
    }); 

    res.status(200).json({
      success: true,
      message: "Empreendimento criado com sucesso.",
      data: data.id,
    });
  } catch (error) {
    //TODO apagar documento tecnico e excel
    console.log("Error: " + error);
    res.json({ success: false, message: 'Ocorreu um erro ao criar o empreendimento.'});
  }
};

controllers.get = async (req, res) => {
  const { id } = req.params;
   try {
    const data = await Empreendimento.findAll({
      where: { utilizadorId: id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data, message: 'Dados obtidos com sucesso.' });
  } catch (error) {
    console.log("Error: " + error);
    res.json({ success: false, message: 'Ocorreu um erro ao obter os detalhes do empreedimento.' });
  }
};

controllers.getDetails = async (req, res) => {
  const { id } = req.params;
   try {
    const data = await Empreendimento.findOne({
      where: { id },
    });
    const dataExcel = await operacoesExcel.readExcel(data.excel);
    const dataDetails = { ...data.dataValues, ...dataExcel };
    res.status(200).json({ success: true, data: dataDetails, message: 'Detalhes obtidos com sucesso.' });
  } catch (error) {
    console.log("Error: " + error);
    res.json({ success: false, message: 'Ocorreu um erro ao obter os detalhes do empreendimento.' });
  }
};

controllers.update = async (req, res) => {
  const { id } = req.params;
  const { nome, morada, excel } = req.body;
  try {
    const data = await Empreendimento.update(
      {
        nome,
        morada,
        excel,
      },
      { where: { id } }
    );

    res.status(200).json({ success: true, data, message: 'Empreendimento atualizado com sucesso.' });
  } catch (error) {
    console.log('Error: ' + error);
    res.json({ success: false, message: 'Ocorreu um erro ao atualizar o Empreendimento.' });
  }
};

controllers.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await Empreendimento.destroy({
      where: { id },
    });
    res.status(200).json({ success: true, message: 'Empreendimento eliminado com sucesso.' });
  } catch (error) {
    console.log('Error: ' + error);
    res.json({ success: false, message: 'Ocorreu um erro ao eliminar o Empreendimento.' });
  }
};

module.exports = controllers;
