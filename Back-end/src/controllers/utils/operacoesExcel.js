const fs = require('fs');
const path = require('path');
const pathToFolder = '../../../public/documentos';
const folderName = 'documentos/';
const XlsxPopulate = require('xlsx-populate');

const VolumeAguaPluvial = 24;
const SistemaRega = 54;
const Areas = 82;
const LagosFontesDecorativas = 118;
const VolumesPiscinas = 122;
const Dispositivos = 153;
const InternosEspecificacoes = 184;
const InternoVolumes = 388;
const InternoLavagem = 592;
const ComumEspecificacoes = 797;
const ComumVolumes = 1001;
const ComumLavagem = 1205;
const Golfe = 1409;
const SistemaProducao = 1415;

const MaxSistemasRega = 25;
const MaxVolumesPiscinas = 25;
const AreaNaoAjardinada = Areas + 5 + MaxSistemasRega + 1;
const MaxInternoEspecificacoes = 200;
const MaxInternoVolumes = 200;
const MaxInternoLavagem = 200;
const MaxComumEspecificacoes = 200;
const MaxComumVolumes = 200;
const MaxComumLavagem = 200;
const MaxSistemasProducao = 25;

// TODO: Apagar


async function createExcel(arquivo, dados) {
    const res = duplicarArquivoComNovoNome(arquivo);
    const nomeArquivo = folderName + res.nomeArquivo;
    const novoCaminho = res.novoCaminho;
    try {
        const workbook = await XlsxPopulate.fromFileAsync(novoCaminho);
        const saveName = workbook.sheet('Checklist');
        saveName.cell("F2").value(dados.campNome || null);

        const sheet = workbook.sheet('Registo de informação');

        // Caracterização do empreendimento hoteleiro			
        sheet.cell("B3").value(dados.campDistrito || null);
        sheet.cell("B5").value(dados.campMunicipio || null);
        sheet.cell("B7").value(parseInt(dados.campNCertificadoEnergetico) || null);
        sheet.cell("B8").value(dados.campTipologia || null);
        sheet.cell("B9").value(dados.campFaseVida || null);
        sheet.cell("B10").value(parseInt(dados.campNUA) || null);
        sheet.cell("B12").value(parseFloat(dados.campTaxaOcupacao) || null);
        sheet.cell("B13").value(parseInt(dados.campOcupacaoMaxima) || null);
        sheet.cell("B14").value(parseFloat(dados.campConsumoAnual) || null);

        // Origens e redes de água	
        sheet.cell("C18").value(dados.campAPAutoclismos || null);
        sheet.cell("C19").value(dados.campAPLavarRoupa || null);
        sheet.cell("C20").value(dados.campAPRegaJardim || null);
        sheet.cell("C21").value(dados.campAPRegaCampoGolfe || null);
        sheet.cell("C22").value(dados.campAPLagosFontes || null);

        // Volumes Agua Pluvial
        sheet.cell("Z" + VolumeAguaPluvial).value(parseInt(dados.campIdadesRedeAgua.length));
        sheet.cell("B" + (VolumeAguaPluvial + 1)).value(parseFloat(dados.campVolumeDepositoAP) || null);
        for (let i = 0; i < dados.campIdadesRedeAgua.length; i++) {
            const data = parseFloat(dados.campIdadesRedeAgua[i].value) || null; // Acessa o valor dentro de cada objeto
            const rowIndex = VolumeAguaPluvial + 1 + 1 + i;
            sheet.cell("B" + rowIndex).value(data);
        }

        // Sistemas Rega
        sheet.cell("Z" + SistemaRega).value(parseInt(dados.campSistemaRega.length));
        for (let i = 0; i < dados.campSistemaRega.length; i++) {
            const data = dados.campSistemaRega[i].value || null; // Acessa o valor dentro de cada objeto
            const rowIndex = SistemaRega + 1 + i;
            sheet.cell("B" + rowIndex).value(data);
        }
        sheet.cell("B" + (SistemaRega + MaxSistemasRega + 1)).value(parseFloat(dados.campConsumoSistemaRega) || null);

        // Areas
        sheet.cell("B" + (Areas + 1)).value(parseFloat(dados.campAreaLote) || null);
        sheet.cell("B" + (Areas + 2)).value(parseFloat(dados.campAreaImplantacao) || null);
        sheet.cell("B" + (Areas + 3)).value(parseFloat(dados.campAreaPassivelCoberturaVerde) || null);
        sheet.cell("B" + (Areas + 4)).value(parseFloat(dados.campAreaCoberturaVerdeInstalada) || null);
        sheet.cell("B" + (Areas + 5)).value(parseFloat(dados.campAreaRelvada) || null);

        for (let i = 0; i < dados.campAreaRegadaComSistemaRega.length; i++) {
            const data = parseFloat(dados.campAreaRegadaComSistemaRega[i].value) || null; // Acessa o valor dentro de cada objeto
            const rowIndex = Areas + 5 + 1 + i;
            sheet.cell("B" + rowIndex).value(data);
        }

        sheet.cell("B" + (AreaNaoAjardinada + 1)).value(parseFloat(dados.campAreaPermeavelNaoAjardinada) || null);
        sheet.cell("B" + (AreaNaoAjardinada + 2)).value(parseFloat(dados.campAreaExteriorImpermeabilizada) || null);

        // Lagos Fontes Decorativas
        sheet.cell("B" + (LagosFontesDecorativas + 1)).value(parseInt(dados.campNLagosFontes) || null);

        // Volumes Piscinas 
        sheet.cell("Z" + VolumesPiscinas).value(parseInt(dados.campVolumePiscina.length));
        for (let i = 0; i < dados.campVolumePiscina.length; i++) {
            const data = parseFloat(dados.campVolumePiscina[i].value) || null; // Acessa o valor dentro de cada objeto
            const rowIndex = VolumesPiscinas + 1 + i;
            sheet.cell("B" + rowIndex).value(data);
        }
        sheet.cell("B" + (VolumesPiscinas + MaxVolumesPiscinas + 1)).value(parseInt(dados.campNJacuzzis) || null);

        // Dispositivos
        sheet.cell("Z" + Dispositivos).value(parseInt(dados.campDispositivos.length));
        
        for (let i = 0; i < dados.campDispositivos.length; i++) {
            const data = dados.campDispositivos[i];
            const rowIndex = Dispositivos + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const id = data.id || null;
            const quantidade = parseInt(data.quantidade) || null; // converte uma string para um número inteiro
            const lavatorios = parseInt(data.lavatorios) || null;
            const autoclismos = parseInt(data.autoclismos) || null;
            const bide = parseInt(data.bide) || null;
            const baseduche = parseInt(data.baseduche) || null;
            const banheira = parseInt(data.banheira) || null;
            const lavaloica = parseInt(data.lavaloica) || null;
            const maquinalavarloica = parseInt(data.maquinalavarloica) || null;
            const maquinalavarroupa = parseInt(data.maquinalavarroupa) || null;
        
            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("A" + rowIndex).value(id);
            sheet.cell("B" + rowIndex).value(quantidade);
            sheet.cell("C" + rowIndex).value(lavatorios);
            sheet.cell("D" + rowIndex).value(autoclismos);
            sheet.cell("E" + rowIndex).value(bide);
            sheet.cell("F" + rowIndex).value(baseduche);
            sheet.cell("G" + rowIndex).value(banheira);
            sheet.cell("H" + rowIndex).value(lavaloica);
            sheet.cell("I" + rowIndex).value(maquinalavarloica);
            sheet.cell("J" + rowIndex).value(maquinalavarroupa);
        }
        
        // Internos Especificacoes 

        sheet.cell("Z" + InternosEspecificacoes).value(parseInt(dados.campInternoEspecificacoes.length));
        
        for (let i = 0; i < dados.campInternoEspecificacoes.length; i++) {
            const data = dados.campInternoEspecificacoes[i];
            const rowIndex = InternosEspecificacoes + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const id = data.id || null;
            const tipo = data.tipo || null;
            const quantidade = parseInt(data.quantidade) || null;
            const caudalNominal = parseFloat(data.caudalNominal) || null;
            const caudalMedido = parseFloat(data.caudalMedido) || null;
            const idade = parseInt(data.idade) || null;
            const fugas = data.fugas || null;
            const classificacao = data.classificacao || null;
            const redutor = data.redutor || null;
            const posicoesfixas = data.posicoesfixas || null;
            const torneiramisturadora = data.torneiramisturadora || null;
            const torneiracomtemporizador = data.torneiracomtemporizador || null;
        
            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("A" + rowIndex).value(id);
            sheet.cell("B" + rowIndex).value(tipo);
            sheet.cell("C" + rowIndex).value(quantidade);
            sheet.cell("D" + rowIndex).value(caudalNominal);
            sheet.cell("E" + rowIndex).value(caudalMedido);
            sheet.cell("F" + rowIndex).value(idade);
            sheet.cell("G" + rowIndex).value(fugas);
            sheet.cell("H" + rowIndex).value(classificacao);
            sheet.cell("I" + rowIndex).value(redutor);
            sheet.cell("J" + rowIndex).value(posicoesfixas);
            sheet.cell("K" + rowIndex).value(torneiramisturadora);
            sheet.cell("L" + rowIndex).value(torneiracomtemporizador);
        }

        // Internos Volumes
        sheet.cell("Z" + InternoVolumes).value(parseInt(dados.campInternoAutoclismo.length));
        
        for (let i = 0; i < dados.campInternoAutoclismo.length; i++) {
            const data = dados.campInternoAutoclismo[i];
            const rowIndex = InternoVolumes + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const id = data.id || null;
            const observacoes = data.observacoes || null;
            const volumenominal = parseFloat(data.volumenominal) || null;
            const idade = parseInt(data.idade) || null;
            const quantidade = parseInt(data.quantidade) || null;
            const fugas = data.fugas || null;
            const classificacao = data.classificacao || null;
            const duploabastecimento = data.duploabastecimento || null;
            const dupladescarga = data.dupladescarga || null;
            const descargainterrompida = data.descargainterrompida || null;
            const valvularegulavel = data.valvularegulavel || null;
        
            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("A" + rowIndex).value(id);
            sheet.cell("B" + rowIndex).value(observacoes);
            sheet.cell("C" + rowIndex).value(quantidade);
            sheet.cell("D" + rowIndex).value(volumenominal);
            sheet.cell("E" + rowIndex).value(idade);
            sheet.cell("F" + rowIndex).value(fugas);
            sheet.cell("G" + rowIndex).value(classificacao);
            sheet.cell("H" + rowIndex).value(duploabastecimento);
            sheet.cell("I" + rowIndex).value(dupladescarga);
            sheet.cell("J" + rowIndex).value(descargainterrompida);
            sheet.cell("K" + rowIndex).value(valvularegulavel);
        }

        // Internos Lavagem
        sheet.cell("Z" + InternoLavagem).value(parseInt(dados.campInternoLavagem.length));

        for (let i = 0; i < dados.campInternoLavagem.length; i++) {
            const data = dados.campInternoLavagem[i];
            const rowIndex = InternoLavagem + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const tipo = data.tipo || null;
            const marca = data.marca || null;
            const idade = parseInt(data.idade) || null;
            const capacidade = parseInt(data.capacidade) || null;
            const consumoano = parseFloat(data.consumoano) || null;
            const consumociclo = parseFloat(data.consumociclo) || null;
            const consumo100ciclos = parseFloat(data.consumo100ciclos) || null;
            const observacoes = data.observacoes || null;
        
            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("A" + rowIndex).value(tipo);
            sheet.cell("B" + rowIndex).value(marca);
            sheet.cell("C" + rowIndex).value(idade);
            sheet.cell("D" + rowIndex).value(capacidade);
            sheet.cell("E" + rowIndex).value(consumoano);
            sheet.cell("F" + rowIndex).value(consumociclo);
            sheet.cell("G" + rowIndex).value(consumo100ciclos);
            sheet.cell("I" + rowIndex).value(observacoes);
        }

        // Comum Especificacoes
        sheet.cell("Z" + ComumEspecificacoes).value(parseInt(dados.campComunsEspecificacoes.length));

        for (let i = 0; i < dados.campComunsEspecificacoes.length; i++) {
            const data = dados.campComunsEspecificacoes[i];
            const rowIndex = ComumEspecificacoes + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const id = data.id || null;
            const tipo = data.tipo || null;
            const quantidade = parseInt(data.quantidade) || null;
            const caudalNominal = parseFloat(data.caudalNominal) || null;
            const caudalMedido = parseFloat(data.caudalMedido) || null;
            const idade = parseInt(data.idade) || null;
            const fugas = data.fugas || null;
            const classificacao = data.classificacao || null;
            const redutor = data.redutor || null;
            const posicoesfixas = data.posicoesfixas || null;
            const torneiramisturadora = data.torneiramisturadora || null;
            const torneiracomtemporizador = data.torneiracomtemporizador || null;
        
            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("A" + rowIndex).value(id);
            sheet.cell("B" + rowIndex).value(tipo);
            sheet.cell("C" + rowIndex).value(quantidade);
            sheet.cell("D" + rowIndex).value(caudalNominal);
            sheet.cell("E" + rowIndex).value(caudalMedido);
            sheet.cell("F" + rowIndex).value(idade);
            sheet.cell("G" + rowIndex).value(fugas);
            sheet.cell("H" + rowIndex).value(classificacao);
            sheet.cell("I" + rowIndex).value(redutor);
            sheet.cell("J" + rowIndex).value(posicoesfixas);
            sheet.cell("K" + rowIndex).value(torneiramisturadora);
            sheet.cell("L" + rowIndex).value(torneiracomtemporizador);
        }
        
        // Comum Volumes
        sheet.cell("Z" + ComumVolumes).value(parseInt(dados.campComunsVolumes.length));

        for (let i = 0; i < dados.campComunsVolumes.length; i++) {
            const data = dados.campComunsVolumes[i];
            const rowIndex = ComumVolumes + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const id = data.id || null;
            const tipo = data.tipo || null;
            const quantidade = parseInt(data.quantidade) || null;
            const volumeNominal = parseFloat(data.volumeNominal) || null;
            const idade = parseInt(data.idade) || null;
            const fugas = data.fugas || null;
            const classificacao = data.classificacao || null;
            const duploabastecimento = data.duploabastecimento || null;
            const dupladescarga = data.dupladescarga || null;
            const descargainterrompida = data.descargainterrompida || null;
            const valvularegulavel = data.valvularegulavel || null;
            const torneiracomtemporizador = data.torneiracomtemporizador || null;
            const caudaladaptado = data.caudaladaptado || null;
            const sistemasemconsumo = data.sistemasemconsumo || null;
        
            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("A" + rowIndex).value(id);
            sheet.cell("B" + rowIndex).value(tipo);
            sheet.cell("C" + rowIndex).value(quantidade);
            sheet.cell("D" + rowIndex).value(volumeNominal);
            sheet.cell("E" + rowIndex).value(idade);
            sheet.cell("F" + rowIndex).value(fugas);
            sheet.cell("G" + rowIndex).value(classificacao);
            sheet.cell("H" + rowIndex).value(duploabastecimento);
            sheet.cell("I" + rowIndex).value(dupladescarga);
            sheet.cell("J" + rowIndex).value(descargainterrompida);
            sheet.cell("K" + rowIndex).value(valvularegulavel);
            sheet.cell("L" + rowIndex).value(torneiracomtemporizador);
            sheet.cell("M" + rowIndex).value(caudaladaptado);
            sheet.cell("N" + rowIndex).value(sistemasemconsumo);     
        }
    
        // Comum Lavagem 
        sheet.cell("Z" + ComumLavagem).value(parseInt(dados.campComunsLavagem.length));

        for (let i = 0; i < dados.campComunsLavagem.length; i++) {
            const data = dados.campComunsLavagem[i];
            const rowIndex = ComumLavagem + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const id = data.tipo || null;
            const tipo = data.marca || null;
            const idade = parseInt(data.idade) || null;
            const consumociclo = parseFloat(data.consumociclo) || null;
            const observacoes = data.observacoes || null;
        
            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("A" + rowIndex).value(id);
            sheet.cell("B" + rowIndex).value(tipo);
            sheet.cell("C" + rowIndex).value(idade);
            sheet.cell("D" + rowIndex).value(consumociclo);
            sheet.cell("E" + rowIndex).value(observacoes);
        }

        // Golfe
        sheet.cell("B" + (Golfe + 1)).value(parseFloat(dados.campGolfeAreaTotalCampo) || null);
        sheet.cell("B" + (Golfe + 2)).value(parseFloat(dados.campGolfeAreaRelvadaComEspecies) || null);
        sheet.cell("B" + (Golfe + 3)).value(parseFloat(dados.campGolfeConsumoRega) || null);
        // Sistemas Produção

        sheet.cell("Z" + SistemaProducao).value(parseInt(dados.campSistemaProducaoAguaQuente.length));

        for (let i = 0; i < dados.campSistemaProducaoAguaQuente.length; i++) {
            const data = dados.campSistemaProducaoAguaQuente[i];
            const rowIndex = SistemaProducao + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const value = data.value || null;

            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("B" + rowIndex).value(value);
        }

        for (let i = 0; i < dados.campIdadeSistemaProducaoAguaQuente.length; i++) {
            const data = dados.campIdadeSistemaProducaoAguaQuente[i];
            const rowIndex = SistemaProducao + MaxSistemasProducao + 1 + i;
        
            // Armazenar os valores em variáveis antes de definir as células da planilha
            const value = parseInt(data.value) || null;

            // Definir as células da planilha com os valores armazenados nas variáveis
            sheet.cell("B" + rowIndex).value(value);
        }


        
        await workbook.toFileAsync(novoCaminho);

        return nomeArquivo;
    } catch (error) {
        console.error('Ocorreu um erro:', error);
        return null;
    }
}

async function readExcel(arquivo) {
    const nomeArquivo = arquivo.split('/').pop();
    const novoCaminho = path.join(__dirname, pathToFolder, nomeArquivo);
    let workbook = null;
    try {
        workbook = await XlsxPopulate.fromFileAsync(novoCaminho);
        const sheet = workbook.sheet('Registo de informação');

        // Caracterização do empreendimento hoteleiro			
            const campDistrito = sheet.cell("B3").value() || '';
            const campMunicipio = sheet.cell("B5").value() || '';
            const campNCertificadoEnergetico = parseInt(sheet.cell("B7").value()) || '';
            const campTipologia = sheet.cell("B8").value() || '';
            const campFaseVida = sheet.cell("B9").value() || '';
            const campNUA = parseInt(sheet.cell("B10").value()) || '';
            const campTaxaOcupacao = parseFloat(sheet.cell("B12").value()) || '';
            const campOcupacaoMaxima = parseInt(sheet.cell("B13").value()) || '';
            const campConsumoAnual = parseFloat(sheet.cell("B14").value()) || '';
        // Origens e redes de água	
            const campAPAutoclismos = sheet.cell("C18").value() || '';
            const campAPLavarRoupa = sheet.cell("C19").value() || '';
            const campAPRegaJardim = sheet.cell("C20").value() || '';
            const campAPRegaCampoGolfe = sheet.cell("C21").value() || '';
            const campAPLagosFontes = sheet.cell("C22").value() || '' ;
        // Volumes Agua Pluvial
            const NcampIdadesRedeAgua = parseInt(sheet.cell("Z" + VolumeAguaPluvial).value()) || 0;
            const campVolumeDepositoAP = parseFloat(sheet.cell("B" + (VolumeAguaPluvial + 1)).value()) || '';
            const campIdadesRedeAgua = (() => {
                var campIdadesRedeAgua = [];
                for (let i = 0; i < NcampIdadesRedeAgua; i++) {
                    const rowIndex = VolumeAguaPluvial + 1 + 1 + i;
                    campIdadesRedeAgua.push({ value: parseFloat(sheet.cell("B" + rowIndex).value()) || '' });
                }
                return campIdadesRedeAgua;
            })();
        // Sistemas Rega
            const NcampSistemaRega = parseInt(sheet.cell("Z" + SistemaRega).value()) || 0;
            const campSistemaRega = (() => {
                var campSistemaRega = [];
                for (let i = 0; i < NcampSistemaRega; i++) {
                    const rowIndex = SistemaRega + 1 + i;
                    campSistemaRega.push({ value: parseFloat(sheet.cell("B" + rowIndex).value()) || '' });
                }
                return campSistemaRega;
            })();
            const campConsumoSistemaRega = parseFloat(sheet.cell("B" + (SistemaRega + MaxSistemasRega + 1)).value()) || '';
        // Areas
            const campAreaLote = parseFloat(sheet.cell("B" + (Areas + 1)).value()) || '';
            const campAreaImplantacao = parseFloat(sheet.cell("B" + (Areas + 2)).value()) || '';
            const campAreaPassivelCoberturaVerde = parseFloat(sheet.cell("B" + (Areas + 3)).value()) || '';
            const campAreaCoberturaVerdeInstalada = parseFloat(sheet.cell("B" + (Areas + 4)).value()) || '';
            const campAreaRelvada = parseFloat(sheet.cell("B" + (Areas + 5)).value()) || '';
            const campAreaRegadaComSistemaRega = (() => {
                var campAreaRegadaComSistemaRega = [];
                for (let i = 0; i < NcampSistemaRega; i++) {
                    const rowIndex = Areas + 5 + 1 + i;
                    campAreaRegadaComSistemaRega.push({ value: parseFloat(sheet.cell("B" + rowIndex).value()) || '' });
                }
                return campAreaRegadaComSistemaRega;
            })();
            const campAreaPermeavelNaoAjardinada = parseFloat(sheet.cell("B" + (AreaNaoAjardinada + 1)).value()) || '';
            const campAreaExteriorImpermeabilizada = parseFloat(sheet.cell("B" + (AreaNaoAjardinada + 2)).value()) || '';
        // Lagos Fontes Decorativas
            const campNLagosFontes = parseInt(sheet.cell("B" + (LagosFontesDecorativas + 1)).value()) || '';
        // Volumes Piscinas 
            const NcampVolumePiscina = parseInt(sheet.cell("Z" + VolumesPiscinas).value()) || 0;
            const campVolumePiscina = (() => {
                var campVolumePiscina = [];
                for (let i = 0; i < NcampVolumePiscina; i++) {
                    const rowIndex = VolumesPiscinas + 1 + i;
                    campVolumePiscina.push({ value: parseFloat(sheet.cell("B" + rowIndex).value()) || '' });
                }
                return campVolumePiscina;
            })();
            const campNJacuzzis = parseInt(sheet.cell("B" + (VolumesPiscinas + MaxVolumesPiscinas + 1)).value()) || '';
        // Dispositivos
            const NcampDispositivos = parseInt(sheet.cell("Z" + Dispositivos).value()) || 0;
            const campDispositivos = (() => {
                var campDispositivos = [];
                for (let i = 0; i < NcampDispositivos; i++) {
                    const rowIndex = Dispositivos + 1 + i;
                    campDispositivos.push({ 
                        id: sheet.cell("A" + rowIndex).value(id) || '',
                        quantidade: parseInt(sheet.cell("B" + rowIndex).value()) || '',
                        lavatorios: parseInt(sheet.cell("C" + rowIndex).value()) || '',
                        autoclismos: parseInt(sheet.cell("D" + rowIndex).value()) || '',
                        bide: parseInt(sheet.cell("E" + rowIndex).value()) || '',
                        baseduche: parseInt(sheet.cell("F" + rowIndex).value()) || '',
                        banheira: parseInt(sheet.cell("G" + rowIndex).value()) || '',
                        lavaloica: parseInt(sheet.cell("H" + rowIndex).value()),
                        maquinalavarloica: parseInt(sheet.cell("I" + rowIndex).value()),
                        maquinalavarroupa: parseInt(sheet.cell("J" + rowIndex).value())
                    
                    });
                }
                return campDispositivos;
            })();
        // Internos Especificacoes 
        const NcampInternoEspecificacoes = parseInt(sheet.cell("Z" + InternosEspecificacoes).value()) || 0;
        const campInternoEspecificacoes = (() => {
            var campInternoEspecificacoes = [];
            for (let i = 0; i < NcampInternoEspecificacoes; i++) {
                const rowIndex = InternosEspecificacoes + 1 + i;
                campInternoEspecificacoes.push({ 
                    id: sheet.cell("A" + rowIndex).value() || '',
                    tipo: sheet.cell("B" + rowIndex).value() || '',
                    quantidade: parseInt(sheet.cell("C" + rowIndex).value()) || '',
                    caudalNominal: parseFloat(sheet.cell("D" + rowIndex).value()) || '',
                    caudalMedido: parseFloat(sheet.cell("E" + rowIndex).value()) || '',
                    idade: parseInt(sheet.cell("F" + rowIndex).value()) || '',
                    fugas: sheet.cell("G" + rowIndex).value() || '',
                    classificacao: sheet.cell("H" + rowIndex).value() || '',
                    redutor: sheet.cell("I" + rowIndex).value() || '',
                    posicoesfixas: sheet.cell("J" + rowIndex).value() || '',
                    torneiramisturadora: sheet.cell("K" + rowIndex).value() || '',
                    torneiracomtemporizador: sheet.cell("L" + rowIndex).value() || ''
                });
            }
            return campInternoEspecificacoes;
        })();
        // Internos Volumes
        const NcampInternoAutoclismo = parseInt(sheet.cell("Z" + InternoVolumes).value()) || 0;
        const campInternoAutoclismo = (() => {
            var campInternoAutoclismo = [];
            for (let i = 0; i < NcampInternoAutoclismo; i++) {
                const rowIndex = InternoVolumes + 1 + i;
                campInternoAutoclismo.push({ 
                    id: sheet.cell("A" + rowIndex).value() || '',
                    observacoes: sheet.cell("B" + rowIndex).value() || '',
                    quantidade: parseInt(sheet.cell("C" + rowIndex).value()) || '',
                    volumenominal: parseFloat(sheet.cell("D" + rowIndex).value()) || '',
                    idade: parseInt(sheet.cell("E" + rowIndex).value()) || '',
                    fugas: sheet.cell("F" + rowIndex).value() || '',
                    classificacao: sheet.cell("G" + rowIndex).value() || '',
                    duploabastecimento: sheet.cell("H" + rowIndex).value() || '',
                    dupladescarga: sheet.cell("I" + rowIndex).value() || '',
                    descargainterrompida: sheet.cell("J" + rowIndex).value() || '',
                    valvularegulavel: sheet.cell("K" + rowIndex).value() || ''
                });
            }
            return campInternoAutoclismo;
        })();
        // Internos Lavagem
        const NcampInternoLavagem = parseInt(sheet.cell("Z" + InternoLavagem).value()) || 0;;
        const campInternoLavagem = (() => {
            var campInternoLavagem = [];
            for (let i = 0; i < NcampInternoLavagem; i++) {
                const rowIndex = InternoLavagem + 1 + i;
                campInternoLavagem.push({ 
                    tipo: sheet.cell("A" + rowIndex).value() || '',
                    marca: sheet.cell("B" + rowIndex).value() || '',
                    idade: parseInt(sheet.cell("C" + rowIndex).value()) || '',
                    capacidade: parseInt(sheet.cell("D" + rowIndex).value()) || '',
                    consumoano: parseFloat(sheet.cell("E" + rowIndex).value()) || '',
                    consumociclo: parseFloat(sheet.cell("F" + rowIndex).value()) || '',
                    consumo100ciclos: parseFloat(sheet.cell("G" + rowIndex).value()) || '',
                    observacoes: sheet.cell("I" + rowIndex).value()
                });
            }
            return campInternoLavagem;
        })();
        // Comum Especificacoes
        const NcampComunsEspecificacoes = parseInt(sheet.cell("Z" + ComumEspecificacoes).value()) || 0;;
        const campComunsEspecificacoes = (() => {
            var campComunsEspecificacoes = [];
            for (let i = 0; i < NcampComunsEspecificacoes; i++) {
                const rowIndex = ComumEspecificacoes + 1 + i;
                campComunsEspecificacoes.push({ 
                    id: sheet.cell("A" + rowIndex).value() || '',
                    tipo: sheet.cell("B" + rowIndex).value() || '',
                    quantidade: parseInt(sheet.cell("C" + rowIndex).value()) || '',
                    caudalNominal: parseFloat(sheet.cell("D" + rowIndex).value()) || '',
                    caudalMedido: parseFlota(sheet.cell("E" + rowIndex).value()) || '',
                    idade: parseInt(sheet.cell("F" + rowIndex).value()) || '',
                    fugas: sheet.cell("G" + rowIndex).value() || '',
                    classificacao: sheet.cell("H" + rowIndex).value() || '',
                    redutor: sheet.cell("I" + rowIndex).value() || '',
                    posicoesfixas: sheet.cell("J" + rowIndex).value() || '',
                    torneiramisturadora: sheet.cell("K" + rowIndex).value() || '',
                    torneiracomtemporizador: sheet.cell("L" + rowIndex).value() || ''
                });
            }
            return campComunsEspecificacoes;
        })();
        // Comum Volumes
        const NcampComunsVolumes = parseInt(sheet.cell("Z" + ComumVolumes).value()) || 0;;
        const campComunsVolumes = (() => {
            var campComunsVolumes = [];
            for (let i = 0; i < NcampComunsVolumes; i++) {
                const rowIndex = ComumVolumes + 1 + i;
                campComunsEspecificacoes.push({ 
                    id: sheet.cell("A" + rowIndex).value() || '',
                    tipo: sheet.cell("B" + rowIndex).value() || '',
                    quantidade: parseInt(sheet.cell("C" + rowIndex).value()) || '',
                    volumeNominal: parseFloat(sheet.cell("D" + rowIndex).value()) || '',
                    idade: parseInt(sheet.cell("E" + rowIndex).value()) || '',
                    fugas: sheet.cell("F" + rowIndex).value() || '', 
                    classificacao: sheet.cell("G" + rowIndex).value() || '',
                    duploabastecimento: sheet.cell("H" + rowIndex).value() || '',
                    dupladescarga: sheet.cell("I" + rowIndex).value() || '',
                    descargainterrompida: sheet.cell("J" + rowIndex).value() || '',
                    valvularegulavel: sheet.cell("K" + rowIndex).value() || '',
                    torneiracomtemporizador: sheet.cell("L" + rowIndex).value() || '',
                    caudaladaptado: sheet.cell("M" + rowIndex).value() || '',
                    sistemasemconsumo: sheet.cell("N" + rowIndex).value() || ''
                });
            }
            return campComunsVolumes;
        })();
        // Comum Lavagem 
        const NcampComunsLavagem = parseInt(sheet.cell("Z" + ComumLavagem).value()) || 0;;
        const campComunsLavagem = (() => {
            var campComunsLavagem = [];
            for (let i = 0; i < NcampComunsLavagem; i++) {
                const rowIndex = ComumLavagem + 1 + i;
                campComunsLavagem.push({ 
                    id: sheet.cell("A" + rowIndex).value() || '',
                    tipo: sheet.cell("B" + rowIndex).value() || '',
                    idade: parseInt(sheet.cell("C" + rowIndex).value()) || '',
                    consumociclo: parseFloat(sheet.cell("D" + rowIndex).value()) || '',
                    observacoes: sheet.cell("E" + rowIndex).value()
                });
            }
            return campComunsLavagem;
        })();
        // Golfe
        const campGolfeAreaTotalCampo = parseFloat(sheet.cell("B" + (Golfe + 1)).value()) || '';
        const campGolfeAreaRelvadaComEspecies = parseFloat(sheet.cell("B" + (Golfe + 2)).value()) || '';
        const campGolfeConsumoRega = parseFloat(sheet.cell("B" + (Golfe + 3)).value()) || '';
        // Sistemas Produção
        const NcampSistemaProducaoAguaQuente = parseInt(sheet.cell("Z" + SistemaProducao).value()) || 0;;
        const campSistemaProducaoAguaQuente = (() => {
            var campSistemaProducaoAguaQuente = [];
            for (let i = 0; i < NcampSistemaProducaoAguaQuente; i++) {
                const rowIndex = SistemaProducao + 1 + i;
                campSistemaProducaoAguaQuente.push({ 
                    value: sheet.cell("B" + rowIndex).value() || ''
                });
            }
            return campSistemaProducaoAguaQuente;
        })();
        const campIdadeSistemaProducaoAguaQuente = (() => {
            var campIdadeSistemaProducaoAguaQuente = [];
            for (let i = 0; i < NcampSistemaProducaoAguaQuente; i++) {
                const rowIndex = SistemaProducao + MaxSistemasProducao + 1 + i;
                campIdadeSistemaProducaoAguaQuente.push({ 
                    value: sheet.cell("B" + rowIndex).value() || ''
                });
            }
            return campIdadeSistemaProducaoAguaQuente;
        })();

        const data = {
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
            campIdadeSistemaProducaoAguaQuente
        }
        workbook = null;
        return data;
    } catch (error) {
        console.error('Ocorreu um erro:', error);
        return null;
    }
}

function duplicarArquivoComNovoNome(idExcel) {
    try {
    const caminhoOriginal = path.join(__dirname, pathToFolder, 'MatrizDefault.xlsx');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const nomeArquivo = `${idExcel}-${uniqueSuffix}.xlsx`;
    const novoCaminho = path.join(__dirname, pathToFolder, nomeArquivo);

        fs.copyFileSync(caminhoOriginal, novoCaminho);
        console.log('Arquivo duplicado com sucesso:', novoCaminho);
        return {nomeArquivo , novoCaminho};
    } catch (error) {
        console.error('Erro ao duplicar o arquivo:', error);
        return null;
    }
}

module.exports = {
    createExcel, readExcel
};


