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

async function editExcel()
{

}

async function clearExcel()
{

}

async function writeCheckList(file, column, data)
{
    const firstColumn = 'J'
    file = file.split('/').pop();
    file = path.join(__dirname, pathToFolder, file);
    let workbook = null;
    try {
        workbook = await XlsxPopulate.fromFileAsync(file);
        const sheet = workbook.sheet('Checklist');
        if(column != firstColumn)
        {
            setValue(workbook, sheet, 1, column, 10, data.ORA1_1_1_2, null);
            setValue(workbook, sheet, 1, column, 56, data.ORA1_2_4_1, null);
            setValue(workbook, sheet, 1, column, 57, data.ORA1_2_4_2, null);
            setValue(workbook, sheet, 1, column, 58, data.ORA1_2_4_3, null);
            setValue(workbook, sheet, 1, column, 59, data.ORA1_2_4_4, null);
            setValue(workbook, sheet, 1, column, 70, data.ORA1_2_6_1, null, data.ORA1_2_6);
            setValue(workbook, sheet, 1, column, 71, data.ORA1_2_6_2, null, data.ORA1_2_6);
            setValue(workbook, sheet, 1, column, 72, data.ORA1_2_6_3, null, data.ORA1_2_6);
            setValue(workbook, sheet, 1, column, 73, data.ORA1_2_6_4, null, data.ORA1_2_6);
            setValue(workbook, sheet, 1, column, 74, data.ORA1_2_6_5, null, data.ORA1_2_6);
            setValue(workbook, sheet, 1, column, 75, data.ORA1_2_6_6, null, data.ORA1_2_6);
            setValue(workbook, sheet, 1, column, 110, data.UE2_1_4_1, null, data.UE2_1_4);
            setValue(workbook, sheet, 1, column, 111, data.UE2_1_4_2, null, data.UE2_1_4);
            setValue(workbook, sheet, 1, column, 112, data.UE2_1_4_3, null, data.UE2_1_4);
            setValue(workbook, sheet, 1, column, 113, data.UE2_1_4_4, null, data.UE2_1_4);
            setValue(workbook, sheet, 1, column, 117, data.UE2_2_1_1, null, data.UE2_2_1);
            setValue(workbook, sheet, 1, column, 118, data.UE2_2_1_2, null, data.UE2_2_1);
            setValue(workbook, sheet, 1, column, 119, data.UE2_2_1_3, null, data.UE2_2_1);
            setValue(workbook, sheet, 1, column, 120, data.UE2_2_1_4, null, data.UE2_2_1);
            setValue(workbook, sheet, 1, column, 121, data.UE2_2_1_5, null, data.UE2_2_1);
            setValue(workbook, sheet, 1, column, 123, data.UE2_2_2_1, null, data.UE2_2_2);
            setValue(workbook, sheet, 1, column, 124, data.UE2_2_2_2, null, data.UE2_2_2);
            setValue(workbook, sheet, 1, column, 125, data.UE2_2_2_3, null, data.UE2_2_2);
            setValue(workbook, sheet, 1, column, 126, data.UE2_2_2_4, null, data.UE2_2_2);
            setValue(workbook, sheet, 1, column, 128, data.UE2_2_3_1, null, data.UE2_2_3);
            setValue(workbook, sheet, 1, column, 129, data.UE2_2_3_2, null, data.UE2_2_3);
            setValue(workbook, sheet, 1, column, 130, data.UE2_2_3_3, null, data.UE2_2_3);
            setValue(workbook, sheet, 1, column, 131, data.UE2_2_3_4, null, data.UE2_2_3);
            setValue(workbook, sheet, 1, column, 132, data.UE2_2_3_5, null, data.UE2_2_3);
            setValue(workbook, sheet, 1, column, 210, data.UA4_1_1_1, null);
            setValue(workbook, sheet, 1, column, 211, data.UA4_1_1_2, null);
            setValue(workbook, sheet, 1, column, 212, data.UA4_1_1_3, null);
            setValue(workbook, sheet, 1, column, 213, data.UA4_1_1_4, null);
            setValue(workbook, sheet, 1, column, 214, data.UA4_1_1_5, null);
            setValue(workbook, sheet, 1, column, 215, data.UA4_1_1_6, null);
            setValue(workbook, sheet, 1, column, 216, data.UA4_1_1_7, null);
            setValue(workbook, sheet, 1, column, 218, data.UA4_1_2_1, null);
            setValue(workbook, sheet, 1, column, 219, data.UA4_1_2_2, null);
            setValue(workbook, sheet, 1, column, 220, data.UA4_1_2_3, null);
            setValue(workbook, sheet, 1, column, 221, data.UA4_1_2_4, null);
            setValue(workbook, sheet, 1, column, 222, data.UA4_1_2_5, null);
            setValue(workbook, sheet, 1, column, 224, data.UA4_1_3_1, null);
            setValue(workbook, sheet, 1, column, 225, data.UA4_1_3_2, null);
            setValue(workbook, sheet, 1, column, 226, data.UA4_1_3_3, null);
            setValue(workbook, sheet, 1, column, 227, data.UA4_1_3_4, null);
            setValue(workbook, sheet, 1, column, 229, data.UA4_1_4_1, null);
            setValue(workbook, sheet, 1, column, 230, data.UA4_1_4_2, null);
            setValue(workbook, sheet, 1, column, 231, data.UA4_1_4_3, null);
            setValue(workbook, sheet, 1, column, 232, data.UA4_1_4_4, null);
            setValue(workbook, sheet, 1, column, 234, data.UA4_1_5_1, null);
            setValue(workbook, sheet, 1, column, 235, data.UA4_1_5_2, null);
            setValue(workbook, sheet, 1, column, 236, data.UA4_1_5_3, null);
            setValue(workbook, sheet, 1, column, 241, data.UA4_2_1_1, null);
            setValue(workbook, sheet, 1, column, 242, data.UA4_2_1_2, null);
            setValue(workbook, sheet, 1, column, 243, data.UA4_2_1_3, null);
            setValue(workbook, sheet, 1, column, 244, data.UA4_2_1_4, null);
            setValue(workbook, sheet, 1, column, 245, data.UA4_2_1_5, null);
            setValue(workbook, sheet, 1, column, 246, data.UA4_2_1_6, null);
            setValue(workbook, sheet, 1, column, 247, data.UA4_2_1_7, null);
            setValue(workbook, sheet, 1, column, 249, data.UA4_2_2_1, null);
            setValue(workbook, sheet, 1, column, 250, data.UA4_2_2_2, null);
            setValue(workbook, sheet, 1, column, 251, data.UA4_2_2_3, null);
            setValue(workbook, sheet, 1, column, 252, data.UA4_2_2_4, null);
            setValue(workbook, sheet, 1, column, 253, data.UA4_2_2_5, null);
            setValue(workbook, sheet, 1, column, 255, data.UA4_2_3_1, null);
            setValue(workbook, sheet, 1, column, 256, data.UA4_2_3_2, null);
            setValue(workbook, sheet, 1, column, 257, data.UA4_2_3_3, null);
            setValue(workbook, sheet, 1, column, 258, data.UA4_2_3_4, null);
            setValue(workbook, sheet, 1, column, 260, data.UA4_2_4_1, null);
            setValue(workbook, sheet, 1, column, 261, data.UA4_2_4_2, null);
            setValue(workbook, sheet, 1, column, 262, data.UA4_2_4_3, null);
            setValue(workbook, sheet, 1, column, 263, data.UA4_2_4_4, null);
            setValue(workbook, sheet, 1, column, 267, data.UA4_3_1_1, null);
            setValue(workbook, sheet, 1, column, 268, data.UA4_3_1_2, null);
            setValue(workbook, sheet, 1, column, 269, data.UA4_3_1_3, null);
            setValue(workbook, sheet, 1, column, 270, data.UA4_3_1_4, null);
            setValue(workbook, sheet, 1, column, 271, data.UA4_3_1_5, null);
            setValue(workbook, sheet, 1, column, 272, data.UA4_3_1_6, null);
            setValue(workbook, sheet, 1, column, 273, data.UA4_3_1_7, null);
            setValue(workbook, sheet, 1, column, 275, data.UA4_3_2_1, null);
            setValue(workbook, sheet, 1, column, 276, data.UA4_3_2_2, null);
            setValue(workbook, sheet, 1, column, 277, data.UA4_3_2_3, null);
            setValue(workbook, sheet, 1, column, 278, data.UA4_3_2_4, null);
            setValue(workbook, sheet, 1, column, 280, data.UA4_3_3_1, null);
            setValue(workbook, sheet, 1, column, 281, data.UA4_3_3_2, null);
            setValue(workbook, sheet, 1, column, 282, data.UA4_3_3_3, null);
            setValue(workbook, sheet, 1, column, 283, data.UA4_3_3_4, null);
            setValue(workbook, sheet, 1, column, 285, data.UA4_3_4_1, null);
            setValue(workbook, sheet, 1, column, 286, data.UA4_3_4_2, null);
            setValue(workbook, sheet, 1, column, 287, data.UA4_3_4_3, null);
            setValue(workbook, sheet, 1, column, 288, data.UA4_3_4_4, null);
            setValue(workbook, sheet, 1, column, 297, data.UA4_4_1_1, null);
            setValue(workbook, sheet, 1, column, 298, data.UA4_4_1_2, null);
            setValue(workbook, sheet, 1, column, 299, data.UA4_4_1_3, null);
            setValue(workbook, sheet, 1, column, 300, data.UA4_4_1_4, null);
            setValue(workbook, sheet, 1, column, 301, data.UA4_4_1_5, null);
            setValue(workbook, sheet, 1, column, 303, data.UA4_4_2_1, null);
            setValue(workbook, sheet, 1, column, 304, data.UA4_4_2_2, null);
            setValue(workbook, sheet, 1, column, 305, data.UA4_4_2_3, null);
            setValue(workbook, sheet, 1, column, 306, data.UA4_4_2_4, null);
            setValue(workbook, sheet, 1, column, 308, data.UA4_4_3_1, null);
            setValue(workbook, sheet, 1, column, 309, data.UA4_4_3_2, null);
            setValue(workbook, sheet, 1, column, 310, data.UA4_4_3_3, null);
            setValue(workbook, sheet, 1, column, 311, data.UA4_4_3_4, null);
            setValue(workbook, sheet, 1, column, 313, data.UA4_4_4_1, null);
            setValue(workbook, sheet, 1, column, 314, data.UA4_4_4_2, null);
            setValue(workbook, sheet, 1, column, 315, data.UA4_4_4_3, null);
            setValue(workbook, sheet, 1, column, 316, data.UA4_4_4_4, null);
            setValue(workbook, sheet, 1, column, 320, data.UA4_5_1_1, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 321, data.UA4_5_1_2, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 322, data.UA4_5_1_3, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 323, data.UA4_5_1_4, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 324, data.UA4_5_1_5, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 325, data.UA4_5_1_6, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 326, data.UA4_5_1_7, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 328, data.UA4_5_2_1, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 329, data.UA4_5_2_2, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 330, data.UA4_5_2_3, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 331, data.UA4_5_2_4, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 333, data.UA4_5_3_1, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 334, data.UA4_5_3_2, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 335, data.UA4_5_3_3, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 336, data.UA4_5_3_4, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 338, data.UA4_5_4_1, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 339, data.UA4_5_4_2, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 340, data.UA4_5_4_3, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 341, data.UA4_5_4_4, null, data.UA4_5);
            setValue(workbook, sheet, 1, column, 357, data.UA4_6_2_1, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 358, data.UA4_6_2_2, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 359, data.UA4_6_2_3, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 360, data.UA4_6_2_4, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 361, data.UA4_6_2_5, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 363, data.UA4_6_3_1, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 364, data.UA4_6_3_2, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 365, data.UA4_6_3_3, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 366, data.UA4_6_3_4, null, data.UA4_6);
            setValue(workbook, sheet, 1, column, 378, data.UA4_7_2_1, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 379, data.UA4_7_2_2, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 380, data.UA4_7_2_3, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 381, data.UA4_7_2_4, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 382, data.UA4_7_2_5, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 384, data.UA4_7_3_1, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 385, data.UA4_7_3_2, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 386, data.UA4_7_3_3, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 387, data.UA4_7_3_4, null, data.UA4_7);
            setValue(workbook, sheet, 1, column, 393, data.UA5_1_1_1, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 394, data.UA5_1_1_2, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 395, data.UA5_1_1_3, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 396, data.UA5_1_1_4, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 397, data.UA5_1_1_5, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 398, data.UA5_1_1_6, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 399, data.UA5_1_1_7, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 401, data.UA5_1_2_1, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 402, data.UA5_1_2_2, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 403, data.UA5_1_2_3, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 404, data.UA5_1_2_4, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 405, data.UA5_1_2_5, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 407, data.UA5_1_3_1, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 408, data.UA5_1_3_2, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 409, data.UA5_1_3_3, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 410, data.UA5_1_3_4, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 412, data.UA5_1_4_1, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 413, data.UA5_1_4_2, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 414, data.UA5_1_4_3, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 415, data.UA5_1_4_4, null, data.UA5_1);
            setValue(workbook, sheet, 1, column, 419, data.UA5_2_1_1, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 420, data.UA5_2_1_2, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 421, data.UA5_2_1_3, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 422, data.UA5_2_1_4, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 423, data.UA5_2_1_5, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 424, data.UA5_2_1_6, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 426, data.UA5_2_2_1, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 427, data.UA5_2_2_2, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 428, data.UA5_2_2_3, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 429, data.UA5_2_2_4, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 430, data.UA5_2_2_5, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 432, data.UA5_2_3_1, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 433, data.UA5_2_3_2, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 434, data.UA5_2_3_3, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 435, data.UA5_2_3_4, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 437, data.UA5_2_4_1, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 438, data.UA5_2_4_2, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 439, data.UA5_2_4_3, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 440, data.UA5_2_4_4, null, data.UA5_2);
            setValue(workbook, sheet, 1, column, 444, data.UA5_3_1_1, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 445, data.UA5_3_1_2, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 446, data.UA5_3_1_3, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 447, data.UA5_3_1_4, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 448, data.UA5_3_1_5, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 449, data.UA5_3_1_6, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 450, data.UA5_3_1_7, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 452, data.UA5_3_2_1, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 453, data.UA5_3_2_2, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 454, data.UA5_3_2_3, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 455, data.UA5_3_2_4, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 457, data.UA5_3_3_1, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 458, data.UA5_3_3_2, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 459, data.UA5_3_3_3, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 460, data.UA5_3_3_4, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 462, data.UA5_3_4_1, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 463, data.UA5_3_4_2, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 464, data.UA5_3_4_3, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 465, data.UA5_3_4_4, null, data.UA5_3);
            setValue(workbook, sheet, 1, column, 469, data.UA5_4_1_1, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 470, data.UA5_4_1_2, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 471, data.UA5_4_1_3, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 472, data.UA5_4_1_4, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 473, data.UA5_4_1_5, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 474, data.UA5_4_1_6, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 475, data.UA5_4_1_7, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 477, data.UA5_4_2_1, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 478, data.UA5_4_2_2, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 479, data.UA5_4_2_3, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 480, data.UA5_4_2_4, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 481, data.UA5_4_2_5, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 483, data.UA5_4_3_1, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 484, data.UA5_4_3_2, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 485, data.UA5_4_3_3, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 486, data.UA5_4_3_4, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 488, data.UA5_4_4_1, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 489, data.UA5_4_4_2, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 490, data.UA5_4_4_3, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 491, data.UA5_4_4_4, null, data.UA5_4);
            setValue(workbook, sheet, 1, column, 497, data.CR6_1_1_1, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 498, data.CR6_1_1_2, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 499, data.CR6_1_1_3, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 500, data.CR6_1_1_4, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 501, data.CR6_1_1_5, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 502, data.CR6_1_1_6, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 504, data.CR6_1_2_1, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 505, data.CR6_1_2_2, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 506, data.CR6_1_2_3, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 507, data.CR6_1_2_4, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 509, data.CR6_1_3_1, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 510, data.CR6_1_3_2, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 511, data.CR6_1_3_3, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 512, data.CR6_1_3_4, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 514, data.CR6_1_4_1, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 515, data.CR6_1_4_2, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 516, data.CR6_1_4_3, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 517, data.CR6_1_4_4, null, data.CR6_1);
            setValue(workbook, sheet, 1, column, 521, data.CR6_2_1_1, null, data.CR6_2);
            setValue(workbook, sheet, 1, column, 522, data.CR6_2_1_2, null, data.CR6_2);
            setValue(workbook, sheet, 1, column, 523, data.CR6_2_1_3, null, data.CR6_2);
            setValue(workbook, sheet, 1, column, 524, data.CR6_2_1_4, null, data.CR6_2);
            setValue(workbook, sheet, 1, column, 526, data.CR6_2_2_1, null, data.CR6_2);
            setValue(workbook, sheet, 1, column, 527, data.CR6_2_2_2, null, data.CR6_2);
            setValue(workbook, sheet, 1, column, 528, data.CR6_2_2_3, null, data.CR6_2);
            setValue(workbook, sheet, 1, column, 529, data.CR6_2_2_4, null, data.CR6_2);
            setValue(workbook, sheet, 1, column, 545, data.LEC7_1_2_1, null);
            setValue(workbook, sheet, 1, column, 546, data.LEC7_1_2_2, null);
            setValue(workbook, sheet, 1, column, 547, data.LEC7_1_2_3, null);
            setValue(workbook, sheet, 1, column, 548, data.LEC7_1_2_4, null);
            setValue(workbook, sheet, 1, column, 589, data.G8_1_5_1, null, data.G8_1_5);
            setValue(workbook, sheet, 1, column, 590, data.G8_1_5_2, null, data.G8_1_5);
            setValue(workbook, sheet, 1, column, 591, data.G8_1_5_3, null, data.G8_1_5);
            setValue(workbook, sheet, 1, column, 592, data.G8_1_5_4, null, data.G8_1_5);
            setValue(workbook, sheet, 1, column, 593, data.G8_1_5_5, null, data.G8_1_5);
            setValue(workbook, sheet, 1, column, 594, data.G8_1_5_6, null, data.G8_1_5);
            setValue(workbook, sheet, 1, column, 595, data.G8_1_5_7, null, data.G8_1_5);
            setValue(workbook, sheet, 1, column, 629, data.G8_3_2_1, null);
            setValue(workbook, sheet, 1, column, 630, data.G8_3_2_2, null);
            setValue(workbook, sheet, 1, column, 631, data.G8_3_2_3, null);
            setValue(workbook, sheet, 1, column, 632, data.G8_3_2_4, null);
            setValue(workbook, sheet, 1, column, 633, data.G8_3_2_5, null);
            setValue(workbook, sheet, 1, column, 656, data.SPAQ9_1_4_1, null);
            setValue(workbook, sheet, 1, column, 657, data.SPAQ9_1_4_2, null);
            setValue(workbook, sheet, 1, column, 658, data.SPAQ9_1_4_3, null);
            setValue(workbook, sheet, 1, column, 659, data.SPAQ9_1_4_4, null);
        }
        setValue(workbook, sheet, 1, column, 11, data.ORA1_1_1_2, null);
        setValue(workbook, sheet, 1, column, 12, data.ORA1_1_1_3, null);
        setValue(workbook, sheet, 1, column, 13, data.ORA1_1_1_4, null);
        setValue(workbook, sheet, 1, column, 14, data.ORA1_1_1_5, null);
        setValue(workbook, sheet, 1, column, 15, data.ORA1_1_1_6, null);
        setValue(workbook, sheet, 1, column, 17, data.ORA1_1_2_1, null);
        setValue(workbook, sheet, 1, column, 18, data.ORA1_1_2_2, null);
        setValue(workbook, sheet, 1, column, 19, data.ORA1_1_2_3, null);
        setValue(workbook, sheet, 1, column, 20, data.ORA1_1_2_4, null);
        setValue(workbook, sheet, 1, column, 21, data.ORA1_1_2_5, null);
        setValue(workbook, sheet, 1, column, 22, data.ORA1_1_2_6, null);
        setValue(workbook, sheet, 1, column, 23, data.ORA1_1_2_7, null);
        setValue(workbook, sheet, 1, column, 25, data.ORA1_1_3_1, null);
        setValue(workbook, sheet, 1, column, 26, data.ORA1_1_3_2, null);
        setValue(workbook, sheet, 1, column, 27, data.ORA1_1_3_3, null);
        setValue(workbook, sheet, 1, column, 28, data.ORA1_1_3_4, null);
        setValue(workbook, sheet, 1, column, 29, data.ORA1_1_3_5, null);
        setValue(workbook, sheet, 1, column, 31, data.ORA1_1_4_1, null);
        setValue(workbook, sheet, 1, column, 32, data.ORA1_1_4_2, null);
        setValue(workbook, sheet, 1, column, 33, data.ORA1_1_4_3, null);
        setValue(workbook, sheet, 1, column, 34, data.ORA1_1_4_4, null);
        setValue(workbook, sheet, 1, column, 38, data.ORA1_2_1_1, null);
        setValue(workbook, sheet, 1, column, 39, data.ORA1_2_1_2, null);
        setValue(workbook, sheet, 1, column, 40, data.ORA1_2_1_3, null);
        setValue(workbook, sheet, 1, column, 41, data.ORA1_2_1_4, null);
        setValue(workbook, sheet, 1, column, 42, data.ORA1_2_1_5, null);
        setValue(workbook, sheet, 1, column, 43, data.ORA1_2_1_6, null);
        setValue(workbook, sheet, 1, column, 44, data.ORA1_2_1_7, null);
        setValue(workbook, sheet, 1, column, 46, data.ORA1_2_2_1, null);
        setValue(workbook, sheet, 1, column, 47, data.ORA1_2_2_2, null);
        setValue(workbook, sheet, 1, column, 48, data.ORA1_2_2_3, null);
        setValue(workbook, sheet, 1, column, 49, data.ORA1_2_2_4, null);
        setValue(workbook, sheet, 1, column, 51, data.ORA1_2_3_1, null);
        setValue(workbook, sheet, 1, column, 52, data.ORA1_2_3_2, null);
        setValue(workbook, sheet, 1, column, 53, data.ORA1_2_3_3, null);
        setValue(workbook, sheet, 1, column, 54, data.ORA1_2_3_4, null);
        setValue(workbook, sheet, 1, column, 61, data.ORA1_2_5_1, null);
        setValue(workbook, sheet, 1, column, 62, data.ORA1_2_5_2, null);
        setValue(workbook, sheet, 1, column, 63, data.ORA1_2_5_3, null);
        setValue(workbook, sheet, 1, column, 64, data.ORA1_2_5_4, null);
        setValue(workbook, sheet, 1, column, 65, data.ORA1_2_5_5, null);
        setValue(workbook, sheet, 1, column, 66, data.ORA1_2_5_6, null);
        setValue(workbook, sheet, 1, column, 67, data.ORA1_2_5_7, null);
        setValue(workbook, sheet, 1, column, 68, data.ORA1_2_5_8, null);
        setValue(workbook, sheet, 1, column, 77, data.ORA1_2_7_1, null);
        setValue(workbook, sheet, 1, column, 78, data.ORA1_2_7_2, null);
        setValue(workbook, sheet, 1, column, 79, data.ORA1_2_7_3, null);
        setValue(workbook, sheet, 1, column, 80, data.ORA1_2_7_4, null);
        setValue(workbook, sheet, 1, column, 81, data.ORA1_2_7_5, null);
        setValue(workbook, sheet, 1, column, 82, data.ORA1_2_7_6, null);
        setValue(workbook, sheet, 1, column, 83, data.ORA1_2_7_7, null);
        setValue(workbook, sheet, 1, column, 89, data.UE2_1_1_1, null, data.UE2_1_1);
        setValue(workbook, sheet, 1, column, 90, data.UE2_1_1_2, null, data.UE2_1_1);
        setValue(workbook, sheet, 1, column, 91, data.UE2_1_1_3, null, data.UE2_1_1);
        setValue(workbook, sheet, 1, column, 92, data.UE2_1_1_4, null, data.UE2_1_1);
        setValue(workbook, sheet, 1, column, 93, data.UE2_1_1_5, null, data.UE2_1_1);
        setValue(workbook, sheet, 1, column, 94, data.UE2_1_1_6, null, data.UE2_1_1);
        setValue(workbook, sheet, 1, column, 96, data.UE2_1_2_1, null, data.UE2_1_2);
        setValue(workbook, sheet, 1, column, 97, data.UE2_1_2_2, null, data.UE2_1_2);
        setValue(workbook, sheet, 1, column, 98, data.UE2_1_2_3, null, data.UE2_1_2);
        setValue(workbook, sheet, 1, column, 99, data.UE2_1_2_4, null, data.UE2_1_2);
        setValue(workbook, sheet, 1, column, 100, data.UE2_1_2_5, null, data.UE2_1_2);
        setValue(workbook, sheet, 1, column, 101, data.UE2_1_2_6, null, data.UE2_1_2);
        setValue(workbook, sheet, 1, column, 103, data.UE2_1_3_1, null, data.UE2_1_3);
        setValue(workbook, sheet, 1, column, 104, data.UE2_1_3_2, null, data.UE2_1_3);
        setValue(workbook, sheet, 1, column, 105, data.UE2_1_3_3, null, data.UE2_1_3);
        setValue(workbook, sheet, 1, column, 106, data.UE2_1_3_4, null, data.UE2_1_3);
        setValue(workbook, sheet, 1, column, 107, data.UE2_1_3_5, null, data.UE2_1_3);
        setValue(workbook, sheet, 1, column, 108, data.UE2_1_3_6, null, data.UE2_1_3);
        setValue(workbook, sheet, 1, column, 134, data.UE2_2_4_1, null, data.UE2_2_4);
        setValue(workbook, sheet, 1, column, 135, data.UE2_2_4_2, null, data.UE2_2_4);
        setValue(workbook, sheet, 1, column, 136, data.UE2_2_4_3, null, data.UE2_2_4);
        setValue(workbook, sheet, 1, column, 137, data.UE2_2_4_4, null, data.UE2_2_4);
        setValue(workbook, sheet, 1, column, 138, data.UE2_2_4_5, null, data.UE2_2_4);
        setValue(workbook, sheet, 1, column, 139, data.UE2_2_4_6, null, data.UE2_2_4);
        setValue(workbook, sheet, 1, column, 140, data.UE2_2_4_7, null, data.UE2_2_4);
        setValue(workbook, sheet, 1, column, 142, data.UE2_2_5_1, null, data.UE2_2_5);
        setValue(workbook, sheet, 1, column, 143, data.UE2_2_5_2, null, data.UE2_2_5);
        setValue(workbook, sheet, 1, column, 144, data.UE2_2_5_3, null, data.UE2_2_5);
        setValue(workbook, sheet, 1, column, 145, data.UE2_2_5_4, null, data.UE2_2_5);
        setValue(workbook, sheet, 1, column, 151, data.PSAPA3_1_1_1, null, data.PSPA3_1_1);
        setValue(workbook, sheet, 1, column, 152, data.PSAPA3_1_1_2, null, data.PSPA3_1_1);
        setValue(workbook, sheet, 1, column, 153, data.PSAPA3_1_1_3, null, data.PSPA3_1_1);
        setValue(workbook, sheet, 1, column, 154, data.PSAPA3_1_1_4, null, data.PSPA3_1_1);
        setValue(workbook, sheet, 1, column, 155, data.PSAPA3_1_1_5, null, data.PSPA3_1_1);
        setValue(workbook, sheet, 1, column, 156, data.PSAPA3_1_1_6, null, data.PSPA3_1_1);
        setValue(workbook, sheet, 1, column, 157, data.PSAPA3_1_1_7, null, data.PSPA3_1_1);
        setValue(workbook, sheet, 1, column, 158, data.PSAPA3_1_1_8, null, data.PSPA3_1_1);
        setValue(workbook, sheet, 1, column, 160, data.PSAPA3_1_2_1, null, data.PSAPA3_1_2);
        setValue(workbook, sheet, 1, column, 161, data.PSAPA3_1_2_2, null, data.PSAPA3_1_2);
        setValue(workbook, sheet, 1, column, 162, data.PSAPA3_1_2_3, null, data.PSAPA3_1_2);
        setValue(workbook, sheet, 1, column, 163, data.PSAPA3_1_2_4, null, data.PSAPA3_1_2);
        setValue(workbook, sheet, 1, column, 164, data.PSAPA3_1_2_5, null, data.PSAPA3_1_2);
        setValue(workbook, sheet, 1, column, 165, data.PSAPA3_1_2_6, null, data.PSAPA3_1_2);
        setValue(workbook, sheet, 1, column, 167, data.PSAPA3_1_3_1, null, data.PSAPA3_1_3);
        setValue(workbook, sheet, 1, column, 168, data.PSAPA3_1_3_2, null, data.PSAPA3_1_3);
        setValue(workbook, sheet, 1, column, 169, data.PSAPA3_1_3_3, null, data.PSAPA3_1_3);
        setValue(workbook, sheet, 1, column, 170, data.PSAPA3_1_3_4, null, data.PSAPA3_1_3);
        setValue(workbook, sheet, 1, column, 171, data.PSAPA3_1_3_5, null, data.PSAPA3_1_3);
        setValue(workbook, sheet, 1, column, 172, data.PSAPA3_1_3_6, null, data.PSAPA3_1_3);
        setValue(workbook, sheet, 1, column, 174, data.PSAPA3_1_4_1, null, data.PSAPA3_1_4);
        setValue(workbook, sheet, 1, column, 175, data.PSAPA3_1_4_2, null, data.PSAPA3_1_4);
        setValue(workbook, sheet, 1, column, 176, data.PSAPA3_1_4_3, null, data.PSAPA3_1_4);
        setValue(workbook, sheet, 1, column, 177, data.PSAPA3_1_4_4, null, data.PSAPA3_1_4);
        setValue(workbook, sheet, 1, column, 178, data.PSAPA3_1_4_5, null, data.PSAPA3_1_4);
        setValue(workbook, sheet, 1, column, 180, data.PSAPA3_1_5_1, null, data.PSAPA3_1_5);
        setValue(workbook, sheet, 1, column, 181, data.PSAPA3_1_5_2, null, data.PSAPA3_1_5);
        setValue(workbook, sheet, 1, column, 182, data.PSAPA3_1_5_3, null, data.PSAPA3_1_5);
        setValue(workbook, sheet, 1, column, 183, data.PSAPA3_1_5_4, null, data.PSAPA3_1_5);
        setValue(workbook, sheet, 1, column, 184, data.PSAPA3_1_5_5, null, data.PSAPA3_1_5);
        setValue(workbook, sheet, 1, column, 186, data.PSAPA3_1_6_1, null, data.PSAPA3_1_6);
        setValue(workbook, sheet, 1, column, 187, data.PSAPA3_1_6_2, null, data.PSAPA3_1_6);
        setValue(workbook, sheet, 1, column, 188, data.PSAPA3_1_6_3, null, data.PSAPA3_1_6);
        setValue(workbook, sheet, 1, column, 189, data.PSAPA3_1_6_4, null, data.PSAPA3_1_6);
        setValue(workbook, sheet, 1, column, 190, data.PSAPA3_1_6_5, null, data.PSAPA3_1_6);
        setValue(workbook, sheet, 1, column, 194, data.PSAPA3_2_1_1, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 195, data.PSAPA3_2_1_2, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 196, data.PSAPA3_2_1_3, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 197, data.PSAPA3_2_1_4, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 198, data.PSAPA3_2_1_5, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 200, data.PSAPA3_2_2_1, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 201, data.PSAPA3_2_2_2, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 202, data.PSAPA3_2_2_3, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 203, data.PSAPA3_2_2_4, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 204, data.PSAPA3_2_2_5, null, data.PSAPA3_2);
        setValue(workbook, sheet, 1, column, 237, data.UA4_1_5_4, null);
        setValue(workbook, sheet, 1, column, 290, data.UA4_3_5_1, null);
        setValue(workbook, sheet, 1, column, 291, data.UA4_3_5_2, null);
        setValue(workbook, sheet, 1, column, 292, data.UA4_3_5_3, null);
        setValue(workbook, sheet, 1, column, 293, data.UA4_3_5_4, null);
        setValue(workbook, sheet, 1, column, 343, data.UA4_5_5_1, null, data.UA4_5);
        setValue(workbook, sheet, 1, column, 344, data.UA4_5_5_2, null, data.UA4_5);
        setValue(workbook, sheet, 1, column, 345, data.UA4_5_5_3, null, data.UA4_5);
        setValue(workbook, sheet, 1, column, 346, data.UA4_5_5_4, null, data.UA4_5);
        setValue(workbook, sheet, 1, column, 350, data.UA4_6_1_1, null, data.UA4_6);
        setValue(workbook, sheet, 1, column, 351, data.UA4_6_1_2, null, data.UA4_6);
        setValue(workbook, sheet, 1, column, 352, data.UA4_6_1_3, null, data.UA4_6);
        setValue(workbook, sheet, 1, column, 353, data.UA4_6_1_4, null, data.UA4_6);
        setValue(workbook, sheet, 1, column, 354, data.UA4_6_1_5, null, data.UA4_6);
        setValue(workbook, sheet, 1, column, 355, data.UA4_6_1_6, null, data.UA4_6);
        setValue(workbook, sheet, 1, column, 370, data.UA4_7_1_1, null, data.UA4_7);
        setValue(workbook, sheet, 1, column, 371, data.UA4_7_1_2, null, data.UA4_7);
        setValue(workbook, sheet, 1, column, 372, data.UA4_7_1_3, null, data.UA4_7);
        setValue(workbook, sheet, 1, column, 373, data.UA4_7_1_4, null, data.UA4_7);
        setValue(workbook, sheet, 1, column, 374, data.UA4_7_1_5, null, data.UA4_7);
        setValue(workbook, sheet, 1, column, 375, data.UA4_7_1_6, null, data.UA4_7);
        setValue(workbook, sheet, 1, column, 376, data.UA4_7_1_7, null, data.UA4_7);
        setValue(workbook, sheet, 1, column, 535, data.LEC7_1_1_1, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 536, data.LEC7_1_1_2, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 537, data.LEC7_1_1_3, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 538, data.LEC7_1_1_4, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 539, data.LEC7_1_1_5, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 540, data.LEC7_1_1_6, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 541, data.LEC7_1_1_7, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 542, data.LEC7_1_1_8, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 543, data.LEC7_1_1_9, null, data.LEC7_1);
        setValue(workbook, sheet, 1, column, 552, data.LEC7_2_2_1, null);
        setValue(workbook, sheet, 1, column, 553, data.LEC7_2_2_2, null);
        setValue(workbook, sheet, 1, column, 554, data.LEC7_2_2_3, null);
        setValue(workbook, sheet, 1, column, 555, data.LEC7_2_2_4, null);
        setValue(workbook, sheet, 1, column, 556, data.LEC7_2_2_5, null);
        setValue(workbook, sheet, 1, column, 557, data.LEC7_2_2_6, null);
        setValue(workbook, sheet, 1, column, 563, data.G8_1_1_1, null, data.G8_1_1);
        setValue(workbook, sheet, 1, column, 564, data.G8_1_1_2, null, data.G8_1_1);
        setValue(workbook, sheet, 1, column, 565, data.G8_1_1_3, null, data.G8_1_1);
        setValue(workbook, sheet, 1, column, 566, data.G8_1_1_4, null, data.G8_1_1);
        setValue(workbook, sheet, 1, column, 567, data.G8_1_1_5, null, data.G8_1_1);
        setValue(workbook, sheet, 1, column, 568, data.G8_1_1_6, null, data.G8_1_1);
        setValue(workbook, sheet, 1, column, 570, data.G8_1_2_1, null, data.G8_1_2);
        setValue(workbook, sheet, 1, column, 571, data.G8_1_2_2, null, data.G8_1_2);
        setValue(workbook, sheet, 1, column, 572, data.G8_1_2_3, null, data.G8_1_2);
        setValue(workbook, sheet, 1, column, 573, data.G8_1_2_4, null, data.G8_1_2);
        setValue(workbook, sheet, 1, column, 574, data.G8_1_2_5, null, data.G8_1_2);
        setValue(workbook, sheet, 1, column, 576, data.G8_1_3_1, null, data.G8_1_3);
        setValue(workbook, sheet, 1, column, 577, data.G8_1_3_2, null, data.G8_1_3);
        setValue(workbook, sheet, 1, column, 578, data.G8_1_3_3, null, data.G8_1_3);
        setValue(workbook, sheet, 1, column, 579, data.G8_1_3_4, null, data.G8_1_3);
        setValue(workbook, sheet, 1, column, 580, data.G8_1_3_5, null, data.G8_1_3);
        setValue(workbook, sheet, 1, column, 581, data.G8_1_3_6, null, data.G8_1_3);
        setValue(workbook, sheet, 1, column, 582, data.G8_1_3_7, null, data.G8_1_3);
        setValue(workbook, sheet, 1, column, 584, data.G8_1_4_1, null, data.G8_1_4);
        setValue(workbook, sheet, 1, column, 585, data.G8_1_4_2, null, data.G8_1_4);
        setValue(workbook, sheet, 1, column, 586, data.G8_1_4_3, null, data.G8_1_4);
        setValue(workbook, sheet, 1, column, 587, data.G8_1_4_4, null, data.G8_1_4);
        setValue(workbook, sheet, 1, column, 599, data.G8_2_1_1, null, data.G8_2_1);
        setValue(workbook, sheet, 1, column, 600, data.G8_2_1_2, null, data.G8_2_1);
        setValue(workbook, sheet, 1, column, 601, data.G8_2_1_3, null, data.G8_2_1);
        setValue(workbook, sheet, 1, column, 602, data.G8_2_1_4, null, data.G8_2_1);
        setValue(workbook, sheet, 1, column, 603, data.G8_2_1_5, null, data.G8_2_1);
        setValue(workbook, sheet, 1, column, 604, data.G8_2_1_6, null, data.G8_2_1);
        setValue(workbook, sheet, 1, column, 607, data.G8_2_2_1, null, data.G8_2_2);
        setValue(workbook, sheet, 1, column, 608, data.G8_2_2_3, null, data.G8_2_2);
        setValue(workbook, sheet, 1, column, 609, data.G8_2_2_4, null, data.G8_2_2);
        setValue(workbook, sheet, 1, column, 610, data.G8_2_2_5, null, data.G8_2_2);
        setValue(workbook, sheet, 1, column, 611, data.G8_2_2_6, null, data.G8_2_2);
        setValue(workbook, sheet, 1, column, 613, data.G8_2_3_1, null, data.G8_2_3);
        setValue(workbook, sheet, 1, column, 614, data.G8_2_3_2, null, data.G8_2_3);
        setValue(workbook, sheet, 1, column, 615, data.G8_2_3_3, null, data.G8_2_3);
        setValue(workbook, sheet, 1, column, 616, data.G8_2_3_4, null, data.G8_2_3);
        setValue(workbook, sheet, 1, column, 617, data.G8_2_3_5, null, data.G8_2_3);
        setValue(workbook, sheet, 1, column, 618, data.G8_2_3_6, null, data.G8_2_3);
        setValue(workbook, sheet, 1, column, 622, data.G8_3_1_1, null, data.G8_3);
        setValue(workbook, sheet, 1, column, 623, data.G8_3_1_2, null, data.G8_3);
        setValue(workbook, sheet, 1, column, 624, data.G8_3_1_3, null, data.G8_3);
        setValue(workbook, sheet, 1, column, 625, data.G8_3_1_4, null, data.G8_3);
        setValue(workbook, sheet, 1, column, 626, data.G8_3_1_5, null, data.G8_3);
        setValue(workbook, sheet, 1, column, 627, data.G8_3_1_6, null, data.G8_3);
        setValue(workbook, sheet, 1, column, 639, data.SPAQ9_1_1_1, null);
        setValue(workbook, sheet, 1, column, 640, data.SPAQ9_1_1_2, null);
        setValue(workbook, sheet, 1, column, 641, data.SPAQ9_1_1_3, null);
        setValue(workbook, sheet, 1, column, 642, data.SPAQ9_1_1_4, null);
        setValue(workbook, sheet, 1, column, 643, data.SPAQ9_1_1_5, null);
        setValue(workbook, sheet, 1, column, 644, data.SPAQ9_1_1_6, null);
        setValue(workbook, sheet, 1, column, 646, data.SPAQ9_1_2_1, null);
        setValue(workbook, sheet, 1, column, 647, data.SPAQ9_1_2_2, null);
        setValue(workbook, sheet, 1, column, 648, data.SPAQ9_1_2_3, null);
        setValue(workbook, sheet, 1, column, 649, data.SPAQ9_1_2_4, null);
        setValue(workbook, sheet, 1, column, 651, data.SPAQ9_1_3_1, null);
        setValue(workbook, sheet, 1, column, 652, data.SPAQ9_1_3_2, null);
        setValue(workbook, sheet, 1, column, 653, data.SPAQ9_1_3_3, null);
        setValue(workbook, sheet, 1, column, 654, data.SPAQ9_1_3_4, null);
        setValue(workbook, sheet, 1, column, 661, data.SPAQ9_1_5_1, null);
        setValue(workbook, sheet, 1, column, 662, data.SPAQ9_1_5_2, null);
        setValue(workbook, sheet, 1, column, 663, data.SPAQ9_1_5_3, null);
        setValue(workbook, sheet, 1, column, 664, data.SPAQ9_1_5_4, null);
        setValue(workbook, sheet, 1, column, 668, data.SPAQ9_2_1_1, null);
        setValue(workbook, sheet, 1, column, 669, data.SPAQ9_2_1_2, null);
        setValue(workbook, sheet, 1, column, 670, data.SPAQ9_2_1_3, null);
        setValue(workbook, sheet, 1, column, 672, data.SPAQ9_2_2_1, null);
        setValue(workbook, sheet, 1, column, 673, data.SPAQ9_2_2_2, null);
        setValue(workbook, sheet, 1, column, 674, data.SPAQ9_2_2_3, null);
        setValue(workbook, sheet, 1, column, 675, data.SPAQ9_2_2_4, null);
        setValue(workbook, sheet, 1, column, 681, data.AEH10_1_1_1, null);
        setValue(workbook, sheet, 1, column, 682, data.AEH10_1_1_2, null);
        setValue(workbook, sheet, 1, column, 683, data.AEH10_1_1_3, null);
        setValue(workbook, sheet, 1, column, 684, data.AEH10_1_1_4, null);
        setValue(workbook, sheet, 1, column, 685, data.AEH10_1_1_5, null);
        setValue(workbook, sheet, 1, column, 686, data.AEH10_1_1_6, null);
        setValue(workbook, sheet, 1, column, 688, data.AEH10_1_2_1, null);
        setValue(workbook, sheet, 1, column, 689, data.AEH10_1_2_2, null);
        setValue(workbook, sheet, 1, column, 690, data.AEH10_1_2_3, null);
        setValue(workbook, sheet, 1, column, 691, data.AEH10_1_2_4, null);
        setValue(workbook, sheet, 1, column, 692, data.AEH10_1_2_5, null);
        setValue(workbook, sheet, 1, column, 693, data.AEH10_1_2_6, null);
        setValue(workbook, sheet, 1, column, 694, data.AEH10_1_2_7, null);
        setValue(workbook, sheet, 1, column, 696, data.AEH10_1_3_1, null);
        setValue(workbook, sheet, 1, column, 697, data.AEH10_1_3_2, null);
        setValue(workbook, sheet, 1, column, 698, data.AEH10_1_3_3, null);
        setValue(workbook, sheet, 1, column, 699, data.AEH10_1_3_4, null);
        setValue(workbook, sheet, 1, column, 700, data.AEH10_1_3_5, null);
        setValue(workbook, sheet, 1, column, 704, data.AEH10_2_1_1, null);
        setValue(workbook, sheet, 1, column, 705, data.AEH10_2_1_2, null);
        setValue(workbook, sheet, 1, column, 706, data.AEH10_2_1_3, null);
        setValue(workbook, sheet, 1, column, 707, data.AEH10_2_1_4, null);
        setValue(workbook, sheet, 1, column, 708, data.AEH10_2_1_5, null);
        setValue(workbook, sheet, 1, column, 710, data.AEH10_2_2_1, null);
        setValue(workbook, sheet, 1, column, 711, data.AEH10_2_2_2, null);
        setValue(workbook, sheet, 1, column, 712, data.AEH10_2_2_3, null);
        setValue(workbook, sheet, 1, column, 713, data.AEH10_2_2_4, null);
        setValue(workbook, sheet, 1, column, 714, data.AEH10_2_2_5, null);
        setValue(workbook, sheet, 1, column, 715, data.AEH10_2_2_6, null);
        setValue(workbook, sheet, 1, column, 716, data.AEH10_2_2_7, null);

    await workbook.toFileAsync(file);
    return true;
    } catch(error)
    {
        console.error('Ocorreu um erro:', error);
        return false;
    }
}

async function readCheckList(file, column)
{
    file = file.split('/').pop();
    file = path.join(__dirname, pathToFolder, file);
    let workbook = null;
    try {
        workbook = await XlsxPopulate.fromFileAsync(file);
        const sheet = workbook.sheet('Checklist');
        const data = 
        {
            ORA1_1_1_1: await getValue(workbook, sheet,1,column, 10,''),
            ORA1_1_1_2: await getValue(workbook, sheet,1,column, 11,''),
            ORA1_1_1_3: await getValue(workbook, sheet,1,column, 12,''),
            ORA1_1_1_4: await getValue(workbook, sheet,1,column, 13,''),
            ORA1_1_1_5: await getValue(workbook, sheet,1,column, 14,''),
            ORA1_1_1_6: await getValue(workbook, sheet,1,column, 15,''),
            ORA1_1_2_1: await getValue(workbook, sheet,1,column, 17,''),
            ORA1_1_2_2: await getValue(workbook, sheet,1,column, 18,''),
            ORA1_1_2_3: await getValue(workbook, sheet,1,column, 19,''),
            ORA1_1_2_4: await getValue(workbook, sheet,1,column, 20,''),
            ORA1_1_2_5: await getValue(workbook, sheet,1,column, 21,''),
            ORA1_1_2_6: await getValue(workbook, sheet,1,column, 22,''),
            ORA1_1_2_7: await getValue(workbook, sheet,1,column, 23,''),
            ORA1_1_3_1: await getValue(workbook, sheet,1,column, 25,''),
            ORA1_1_3_2: await getValue(workbook, sheet,1,column, 26,''),
            ORA1_1_3_3: await  getValue(workbook, sheet,1,column, 27,''),
            ORA1_1_3_4: await  getValue(workbook, sheet,1,column, 28,''),
            ORA1_1_3_5: await  getValue(workbook, sheet,1,column, 29,''),
            ORA1_1_4_1: await  getValue(workbook, sheet,1,column, 31,''),
            ORA1_1_4_2: await  getValue(workbook, sheet,1,column, 32,''),
            ORA1_1_4_3: await  getValue(workbook, sheet,1,column, 33,''),
            ORA1_1_4_4: await  getValue(workbook, sheet,1,column, 34,''),
            ORA1_2_1_1: await  getValue(workbook, sheet,1,column, 38,''),
            ORA1_2_1_2: await  getValue(workbook, sheet,1,column, 39,''),
            ORA1_2_1_3: await  getValue(workbook, sheet,1,column, 40,''),
            ORA1_2_1_4: await  getValue(workbook, sheet,1,column, 41,''),
            ORA1_2_1_5: await  getValue(workbook, sheet,1,column, 42,''),
            ORA1_2_1_6: await  getValue(workbook, sheet,1,column, 43,''),
            ORA1_2_1_7: await  getValue(workbook, sheet,1,column, 44,''),
            ORA1_2_2_1: await  getValue(workbook, sheet,1,column, 46,''),
            ORA1_2_2_2: await  getValue(workbook, sheet,1,column, 47,''),
            ORA1_2_2_3: await  getValue(workbook, sheet,1,column, 48,''),
            ORA1_2_2_4: await  getValue(workbook, sheet,1,column, 49,''),
            ORA1_2_3_1: await  getValue(workbook, sheet,1,column, 51,''),
            ORA1_2_3_2: await  getValue(workbook, sheet,1,column, 52,''),
            ORA1_2_3_3: await  getValue(workbook, sheet,1,column, 53,''),
            ORA1_2_3_4: await  getValue(workbook, sheet,1,column, 54,''),
            ORA1_2_4_1: await  getValue(workbook, sheet,1,column, 56,''),
            ORA1_2_4_2: await  getValue(workbook, sheet,1,column, 57,''),
            ORA1_2_4_3: await  getValue(workbook, sheet,1,column, 58,''),
            ORA1_2_4_4: await  getValue(workbook, sheet,1,column, 59,''),
            ORA1_2_5_1: await  getValue(workbook, sheet,1,column, 61,''),
            ORA1_2_5_2: await  getValue(workbook, sheet,1,column, 62,''),
            ORA1_2_5_3: await  getValue(workbook, sheet,1,column, 63,''),
            ORA1_2_5_4: await  getValue(workbook, sheet,1,column, 64,''),
            ORA1_2_5_5: await  getValue(workbook, sheet,1,column, 65,''),
            ORA1_2_5_6: await  getValue(workbook, sheet,1,column, 66,''),
            ORA1_2_5_7: await  getValue(workbook, sheet,1,column, 67,''),
            ORA1_2_5_8: await  getValue(workbook, sheet,1,column, 68,''),
            ORA1_2_6: await  getValue(workbook, sheet,1,'B', 69,''),
            ORA1_2_6_1: await  getValue(workbook, sheet,1,column, 70,''),
            ORA1_2_6_2: await  getValue(workbook, sheet,1,column, 71,''),
            ORA1_2_6_3: await  getValue(workbook, sheet,1,column, 72,''),
            ORA1_2_6_4: await  getValue(workbook, sheet,1,column, 73,''),
            ORA1_2_6_5: await  getValue(workbook, sheet,1,column, 74,''),
            ORA1_2_6_6: await  getValue(workbook, sheet,1,column, 75,''),
            ORA1_2_7_1: await  getValue(workbook, sheet,1,column, 77,''),
            ORA1_2_7_2: await  getValue(workbook, sheet,1,column, 78,''),
            ORA1_2_7_3: await  getValue(workbook, sheet,1,column, 79,''),
            ORA1_2_7_4: await  getValue(workbook, sheet,1,column, 80,''),
            ORA1_2_7_5: await  getValue(workbook, sheet,1,column, 81,''),
            ORA1_2_7_6: await  getValue(workbook, sheet,1,column, 82,''),
            ORA1_2_7_7: await  getValue(workbook, sheet,1,column, 83,''),
            UE2_1_1: await  getValue(workbook, sheet,1,'B', 88,''),
            UE2_1_1_1: await  getValue(workbook, sheet,1,column, 89,''),
            UE2_1_1_2: await  getValue(workbook, sheet,1,column, 90,''),
            UE2_1_1_3: await  getValue(workbook, sheet,1,column, 91,''),
            UE2_1_1_4: await  getValue(workbook, sheet,1,column, 92,''),
            UE2_1_1_5: await  getValue(workbook, sheet,1,column, 93,''),
            UE2_1_1_6: await  getValue(workbook, sheet,1,column, 94,''),
            UE_2_1_2: await  getValue(workbook, sheet,1,'B',95,''),
            UE2_1_2_1: await  getValue(workbook, sheet,1,column, 96,''),
            UE2_1_2_2: await  getValue(workbook, sheet,1,column, 97,''),
            UE2_1_2_3: await  getValue(workbook, sheet,1,column, 98,''),
            UE2_1_2_4: await  getValue(workbook, sheet,1,column, 99,''),
            UE2_1_2_5: await  getValue(workbook, sheet,1,column, 100,''),
            UE2_1_2_6: await  getValue(workbook, sheet,1,column, 101,''),
            UE2_1_3: await  getValue(workbook, sheet,1,'B',102,''),
            UE2_1_3_1: await  getValue(workbook, sheet,1,column, 103,''),
            UE2_1_3_2: await  getValue(workbook, sheet,1,column, 104,''),
            UE2_1_3_3: await  getValue(workbook, sheet,1,column, 105,''),
            UE2_1_3_4: await  getValue(workbook, sheet,1,column, 106,''),
            UE2_1_3_5: await  getValue(workbook, sheet,1,column, 107,''),
            UE2_1_3_6: await  getValue(workbook, sheet,1,column, 108,''),
            UE2_1_4: await  getValue(workbook, sheet,1,'B', 109,''),
            UE2_1_4_1: await  getValue(workbook, sheet,1,column, 110,''),
            UE2_1_4_2: await  getValue(workbook, sheet,1,column, 111,''),
            UE2_1_4_3: await  getValue(workbook, sheet,1,column, 112,''),
            UE2_1_4_4: await  getValue(workbook, sheet,1,column, 113,''),
            UE2_2_1: await  getValue(workbook, sheet,1,'B', 116,''),
            UE2_2_1_1: await  getValue(workbook, sheet,1,column, 117,''),
            UE2_2_1_2: await  getValue(workbook, sheet,1,column, 118,''),
            UE2_2_1_3: await  getValue(workbook, sheet,1,column, 119,''),
            UE2_2_1_4: await  getValue(workbook, sheet,1,column, 120,''),
            UE2_2_1_5: await  getValue(workbook, sheet,1,column, 121,''),
            UE2_2_2: await  getValue(workbook, sheet,1,'B', 122,''),
            UE2_2_2_1: await  getValue(workbook, sheet,1,column, 123,''),
            UE2_2_2_2: await  getValue(workbook, sheet,1,column, 124,''),
            UE2_2_2_3: await  getValue(workbook, sheet,1,column, 125,''),
            UE2_2_2_4: await  getValue(workbook, sheet,1,column, 126,''),
            UE2_2_3: await  getValue(workbook, sheet,1,'B', 127,''),
            UE2_2_3_1: await  getValue(workbook, sheet,1,column, 128,''),
            UE2_2_3_2: await  getValue(workbook, sheet,1,column, 129,''),
            UE2_2_3_3: await  getValue(workbook, sheet,1,column, 130,''),
            UE2_2_3_4: await  getValue(workbook, sheet,1,column, 131,''),
            UE2_2_3_5: await  getValue(workbook, sheet,1,column, 132,''),
            UE2_2_4: await  getValue(workbook, sheet,1,'B', 133,''),
            UE2_2_4_1: await  getValue(workbook, sheet,1,column, 134,''),
            UE2_2_4_2: await  getValue(workbook, sheet,1,column, 135,''),
            UE2_2_4_3: await  getValue(workbook, sheet,1,column, 136,''),
            UE2_2_4_4: await  getValue(workbook, sheet,1,column, 137,''),
            UE2_2_4_5: await  getValue(workbook, sheet,1,column, 138,''),
            UE2_2_4_6: await  getValue(workbook, sheet,1,column, 139,''),
            UE2_2_4_7: await  getValue(workbook, sheet,1,column, 140,''),
            UE2_2_5: await  getValue(workbook, sheet,1,'B', 141,''),
            UE2_2_5_1: await  getValue(workbook, sheet,1,column, 142,''),
            UE2_2_5_2: await  getValue(workbook, sheet,1,column, 143,''),
            UE2_2_5_3: await  getValue(workbook, sheet,1,column, 144,''),
            UE2_2_5_4: await  getValue(workbook, sheet,1,column, 145,''),
            PSPA3_1_1: await  getValue(workbook, sheet,1,'B', 150 ,''),
            PSAPA3_1_1_1: await  getValue(workbook, sheet,1,column, 151,''),
            PSAPA3_1_1_2: await  getValue(workbook, sheet,1,column, 152,''),
            PSAPA3_1_1_3: await  getValue(workbook, sheet,1,column, 153,''),
            PSAPA3_1_1_4: await  getValue(workbook, sheet,1,column, 154,''),
            PSAPA3_1_1_5: await  getValue(workbook, sheet,1,column, 155,''),
            PSAPA3_1_1_6: await  getValue(workbook, sheet,1,column, 156,''),
            PSAPA3_1_1_7: await  getValue(workbook, sheet,1,column, 157,''),
            PSAPA3_1_1_8: await  getValue(workbook, sheet,1,column, 158,''),
            PSAPA3_1_2: await  getValue(workbook, sheet,1,'B', 159 ,''),
            PSAPA3_1_2_1: await  getValue(workbook, sheet,1,column, 160,''),
            PSAPA3_1_2_2: await  getValue(workbook, sheet,1,column, 161,''),
            PSAPA3_1_2_3: await  getValue(workbook, sheet,1,column, 162,''),
            PSAPA3_1_2_4: await  getValue(workbook, sheet,1,column, 163,''),
            PSAPA3_1_2_5: await  getValue(workbook, sheet,1,column, 164,''),
            PSAPA3_1_2_6: await  getValue(workbook, sheet,1,column, 165,''),
            PSAPA3_1_3: await  getValue(workbook, sheet,1,'B', 166,''),
            PSAPA3_1_3_1: await  getValue(workbook, sheet,1,column, 167,''),
            PSAPA3_1_3_2: await  getValue(workbook, sheet,1,column, 168,''),
            PSAPA3_1_3_3: await  getValue(workbook, sheet,1,column, 169,''),
            PSAPA3_1_3_4: await  getValue(workbook, sheet,1,column, 170,''),
            PSAPA3_1_3_5: await  getValue(workbook, sheet,1,column, 171,''),
            PSAPA3_1_3_6: await  getValue(workbook, sheet,1,column, 172,''),
            PSAPA3_1_4: await  getValue(workbook, sheet,1,'B', 173 ,''),
            PSAPA3_1_4_1: await  getValue(workbook, sheet,1,column, 174,''),
            PSAPA3_1_4_2: await  getValue(workbook, sheet,1,column, 175,''),
            PSAPA3_1_4_3: await  getValue(workbook, sheet,1,column, 176,''),
            PSAPA3_1_4_4: await  getValue(workbook, sheet,1,column, 177,''),
            PSAPA3_1_4_5: await  getValue(workbook, sheet,1,column, 178,''),
            PSAPA3_1_5: await  getValue(workbook, sheet,1,'B', 179 ,''),
            PSAPA3_1_5_1: await  getValue(workbook, sheet,1,column, 180,''),
            PSAPA3_1_5_2: await  getValue(workbook, sheet,1,column, 181,''),
            PSAPA3_1_5_3: await  getValue(workbook, sheet,1,column, 182,''),
            PSAPA3_1_5_4: await  getValue(workbook, sheet,1,column, 183,''),
            PSAPA3_1_5_5: await  getValue(workbook, sheet,1,column, 184,''),
            PSAPA3_1_6: await  getValue(workbook, sheet,1,'B', 185 ,''),
            PSAPA3_1_6_1: await  getValue(workbook, sheet,1,column, 186,''),
            PSAPA3_1_6_2: await  getValue(workbook, sheet,1,column, 187,''),
            PSAPA3_1_6_3: await  getValue(workbook, sheet,1,column, 188,''),
            PSAPA3_1_6_4: await  getValue(workbook, sheet,1,column, 189,''),
            PSAPA3_1_6_5: await  getValue(workbook, sheet,1,column, 190,''),
            PSAPA3_2: await  getValue(workbook, sheet,1,'B', 192,''),
            PSAPA3_2_1_1: await  getValue(workbook, sheet,1,column, 194,''),
            PSAPA3_2_1_2: await  getValue(workbook, sheet,1,column, 195,''),
            PSAPA3_2_1_3: await  getValue(workbook, sheet,1,column, 196,''),
            PSAPA3_2_1_4: await  getValue(workbook, sheet,1,column, 197,''),
            PSAPA3_2_1_5: await  getValue(workbook, sheet,1,column, 198,''),
            PSAPA3_2_2_1: await  getValue(workbook, sheet,1,column, 200,''),
            PSAPA3_2_2_2: await  getValue(workbook, sheet,1,column, 201,''),
            PSAPA3_2_2_3: await  getValue(workbook, sheet,1,column, 202,''),
            PSAPA3_2_2_4: await  getValue(workbook, sheet,1,column, 203,''),
            PSAPA3_2_2_5: await  getValue(workbook, sheet,1,column, 204,''),
            UA4_1_1_1: await  getValue(workbook, sheet,1,column, 210,''),
            UA4_1_1_2: await  getValue(workbook, sheet,1,column, 211,''),
            UA4_1_1_3: await  getValue(workbook, sheet,1,column, 212,''),
            UA4_1_1_4: await  getValue(workbook, sheet,1,column, 213,''),
            UA4_1_1_5: await  getValue(workbook, sheet,1,column, 214,''),
            UA4_1_1_6: await  getValue(workbook, sheet,1,column, 215,''),
            UA4_1_1_7: await  getValue(workbook, sheet,1,column, 216,''),
            UA4_1_2_1: await  getValue(workbook, sheet,1,column, 218,''),
            UA4_1_2_2: await  getValue(workbook, sheet,1,column, 219,''),
            UA4_1_2_3: await  getValue(workbook, sheet,1,column, 220,''),
            UA4_1_2_4: await  getValue(workbook, sheet,1,column, 221,''),
            UA4_1_2_5: await  getValue(workbook, sheet,1,column, 222,''),
            UA4_1_3_1: await  getValue(workbook, sheet,1,column, 224,''),
            UA4_1_3_2: await  getValue(workbook, sheet,1,column, 225,''),
            UA4_1_3_3: await  getValue(workbook, sheet,1,column, 226,''),
            UA4_1_3_4: await  getValue(workbook, sheet,1,column, 227,''),
            UA4_1_4_1: await  getValue(workbook, sheet,1,column, 229,''),
            UA4_1_4_2: await  getValue(workbook, sheet,1,column, 230,''),
            UA4_1_4_3: await  getValue(workbook, sheet,1,column, 231,''),
            UA4_1_4_4: await  getValue(workbook, sheet,1,column, 232,''),
            UA4_1_5_1: await  getValue(workbook, sheet,1,column, 234,''),
            UA4_1_5_2: await  getValue(workbook, sheet,1,column, 235,''),
            UA4_1_5_3: await  getValue(workbook, sheet,1,column, 236,''),
            UA4_1_5_4: await  getValue(workbook, sheet,1,column, 237,''),
            UA4_2_1_1: await  getValue(workbook, sheet,1,column, 241,''),
            UA4_2_1_2: await  getValue(workbook, sheet,1,column, 242,''),
            UA4_2_1_3: await  getValue(workbook, sheet,1,column, 243,''),
            UA4_2_1_4: await  getValue(workbook, sheet,1,column, 244,''),
            UA4_2_1_5: await  getValue(workbook, sheet,1,column, 245,''),
            UA4_2_1_6: await  getValue(workbook, sheet,1,column, 246,''),
            UA4_2_1_7: await  getValue(workbook, sheet,1,column, 247,''),
            UA4_2_2_1: await  getValue(workbook, sheet,1,column, 249,''),
            UA4_2_2_2: await  getValue(workbook, sheet,1,column, 250,''),
            UA4_2_2_3: await  getValue(workbook, sheet,1,column, 251,''),
            UA4_2_2_4: await  getValue(workbook, sheet,1,column, 252,''),
            UA4_2_2_5: await  getValue(workbook, sheet,1,column, 253,''),
            UA4_2_3_1: await  getValue(workbook, sheet,1,column, 255,''),
            UA4_2_3_2: await  getValue(workbook, sheet,1,column, 256,''),
            UA4_2_3_3: await  getValue(workbook, sheet,1,column, 257,''),
            UA4_2_3_4: await  getValue(workbook, sheet,1,column, 258,''),
            UA4_2_4_1: await  getValue(workbook, sheet,1,column, 260,''),
            UA4_2_4_2: await  getValue(workbook, sheet,1,column, 261,''),
            UA4_2_4_3: await  getValue(workbook, sheet,1,column, 262,''),
            UA4_2_4_4: await  getValue(workbook, sheet,1,column, 263,''),
            UA4_3_1_1: await  getValue(workbook, sheet,1,column, 267,''),
            UA4_3_1_2: await  getValue(workbook, sheet,1,column, 268,''),
            UA4_3_1_3: await  getValue(workbook, sheet,1,column, 269,''),
            UA4_3_1_4: await  getValue(workbook, sheet,1,column, 270,''),
            UA4_3_1_5: await  getValue(workbook, sheet,1,column, 271,''),
            UA4_3_1_6: await  getValue(workbook, sheet,1,column, 272,''),
            UA4_3_1_7: await  getValue(workbook, sheet,1,column, 273,''),
            UA4_3_2_1: await  getValue(workbook, sheet,1,column, 275,''),
            UA4_3_2_2: await  getValue(workbook, sheet,1,column, 276,''),
            UA4_3_2_3: await  getValue(workbook, sheet,1,column, 277,''),
            UA4_3_2_4: await  getValue(workbook, sheet,1,column, 278,''),
            UA4_3_3_1: await  getValue(workbook, sheet,1,column, 280,''),
            UA4_3_3_2: await  getValue(workbook, sheet,1,column, 281,''),
            UA4_3_3_3: await  getValue(workbook, sheet,1,column, 282,''),
            UA4_3_3_4: await  getValue(workbook, sheet,1,column, 283,''),
            UA4_3_4_1: await  getValue(workbook, sheet,1,column, 285,''),
            UA4_3_4_2: await  getValue(workbook, sheet,1,column, 286,''),
            UA4_3_4_3: await  getValue(workbook, sheet,1,column, 287,''),
            UA4_3_4_4: await  getValue(workbook, sheet,1,column, 288,''),
            UA4_3_5_1: await  getValue(workbook, sheet,1,column, 290,''),
            UA4_3_5_2: await  getValue(workbook, sheet,1,column, 291,''),
            UA4_3_5_3: await  getValue(workbook, sheet,1,column, 292,''),
            UA4_3_5_4: await  getValue(workbook, sheet,1,column, 293,''),
            UA4_4_1_1: await  getValue(workbook, sheet,1,column, 297,''),
            UA4_4_1_2: await  getValue(workbook, sheet,1,column, 298,''),
            UA4_4_1_3: await  getValue(workbook, sheet,1,column, 299,''),
            UA4_4_1_4: await  getValue(workbook, sheet,1,column, 300,''),
            UA4_4_1_5: await  getValue(workbook, sheet,1,column, 301,''),
            UA4_4_2_1: await  getValue(workbook, sheet,1,column, 303,''),
            UA4_4_2_2: await  getValue(workbook, sheet,1,column, 304,''),
            UA4_4_2_3: await  getValue(workbook, sheet,1,column, 305,''),
            UA4_4_2_4: await  getValue(workbook, sheet,1,column, 306,''),
            UA4_4_3_1: await  getValue(workbook, sheet,1,column, 308,''),
            UA4_4_3_2: await  getValue(workbook, sheet,1,column, 309,''),
            UA4_4_3_3: await  getValue(workbook, sheet,1,column, 310,''),
            UA4_4_3_4: await  getValue(workbook, sheet,1,column, 311,''),
            UA4_4_4_1: await  getValue(workbook, sheet,1,column, 313,''),
            UA4_4_4_2: await  getValue(workbook, sheet,1,column, 314,''),
            UA4_4_4_3: await  getValue(workbook, sheet,1,column, 315,''),
            UA4_4_4_4: await  getValue(workbook, sheet,1,column, 316,''),
            UA4_5: await  getValue(workbook, sheet,1,'B', 318,''),
            UA4_5_1_1: await  getValue(workbook, sheet,1,column,320,''), 
            UA4_5_1_2: await  getValue(workbook, sheet,1,column, 321,''),
            UA4_5_1_3: await  getValue(workbook, sheet,1,column, 322,''),
            UA4_5_1_4: await  getValue(workbook, sheet,1,column, 323,''),
            UA4_5_1_5: await  getValue(workbook, sheet,1,column, 324,''),
            UA4_5_1_6: await  getValue(workbook, sheet,1,column, 325,''),
            UA4_5_1_7: await  getValue(workbook, sheet,1,column, 326,''),
            UA4_5_2_1: await  getValue(workbook, sheet,1,column, 327,''),
            UA4_5_2_2: await  getValue(workbook, sheet,1,column, 328,''),
            UA4_5_2_3: await  getValue(workbook, sheet,1,column, 329,''),
            UA4_5_2_4: await  getValue(workbook, sheet,1,column, 330,''),
            UA4_5_3_1: await  getValue(workbook, sheet,1,column, 333,''),
            UA4_5_3_2: await  getValue(workbook, sheet,1,column, 334,''),
            UA4_5_3_3: await  getValue(workbook, sheet,1,column, 335,''),
            UA4_5_3_4: await  getValue(workbook, sheet,1,column, 336,''),
            UA4_5_4_1: await  getValue(workbook, sheet,1,column, 338,''),
            UA4_5_4_2: await  getValue(workbook, sheet,1,column, 339,''),
            UA4_5_4_3: await  getValue(workbook, sheet,1,column, 340,''),
            UA4_5_4_4: await  getValue(workbook, sheet,1,column, 341,''),
            UA4_5_5_1: await  getValue(workbook, sheet,1,column, 343,''),
            UA4_5_5_2: await  getValue(workbook, sheet,1,column, 344,''),
            UA4_5_5_3: await  getValue(workbook, sheet,1,column, 345,''),
            UA4_5_5_4: await  getValue(workbook, sheet,1,column, 346,''),
            UA4_6: await  getValue(workbook, sheet,1,'B', 348,''),
            UA4_6_1_1: await  getValue(workbook, sheet,1,column, 350,''),
            UA4_6_1_2: await  getValue(workbook, sheet,1,column, 351,''),
            UA4_6_1_3: await  getValue(workbook, sheet,1,column, 352,''),
            UA4_6_1_4: await  getValue(workbook, sheet,1,column, 353,''),
            UA4_6_1_5: await  getValue(workbook, sheet,1,column, 354,''),
            UA4_6_1_6: await  getValue(workbook, sheet,1,column, 355,''),
            UA4_6_2_1: await  getValue(workbook, sheet,1,column, 357,''),
            UA4_6_2_2: await  getValue(workbook, sheet,1,column, 358,''),
            UA4_6_2_3: await  getValue(workbook, sheet,1,column, 359,''),
            UA4_6_2_4: await  getValue(workbook, sheet,1,column, 360,''),
            UA4_6_2_5: await  getValue(workbook, sheet,1,column, 361,''),
            UA4_6_3_1: await  getValue(workbook, sheet,1,column, 363,''),
            UA4_6_3_2: await  getValue(workbook, sheet,1,column, 364,''),
            UA4_6_3_3: await  getValue(workbook, sheet,1,column, 365,''),
            UA4_6_3_4: await  getValue(workbook, sheet,1,column, 366,''),
            UA4_7: await  getValue(workbook, sheet,1,'B', 368,''),
            UA4_7_1_1: await  getValue(workbook, sheet,1,column,370,''), 
            UA4_7_1_2: await  getValue(workbook, sheet,1,column, 371,''),
            UA4_7_1_3: await  getValue(workbook, sheet,1,column, 372,''),
            UA4_7_1_4: await  getValue(workbook, sheet,1,column, 373,''),
            UA4_7_1_5: await  getValue(workbook, sheet,1,column, 374,''),
            UA4_7_1_6: await  getValue(workbook, sheet,1,column, 375,''),
            UA4_7_1_7: await  getValue(workbook, sheet,1,column, 376,''),
            UA4_7_2_1: await  getValue(workbook, sheet,1,column, 378,''),
            UA4_7_2_2: await  getValue(workbook, sheet,1,column, 379,''),
            UA4_7_2_3: await  getValue(workbook, sheet,1,column, 380,''),
            UA4_7_2_4: await  getValue(workbook, sheet,1,column, 381,''),
            UA4_7_2_5: await  getValue(workbook, sheet,1,column, 382,''),
            UA4_7_3_1: await  getValue(workbook, sheet,1,column, 384,''),
            UA4_7_3_2: await  getValue(workbook, sheet,1,column, 385,''),
            UA4_7_3_3: await  getValue(workbook, sheet,1,column, 386,''),
            UA4_7_3_4: await  getValue(workbook, sheet,1,column, 387,''),
            UA5_1: await  getValue(workbook, sheet,1,'B', 391,''),
            UA5_1_1_1: await  getValue(workbook, sheet,1,column, 393,''),
            UA5_1_1_2: await  getValue(workbook, sheet,1,column, 394,''),
            UA5_1_1_3: await  getValue(workbook, sheet,1,column, 395,''),
            UA5_1_1_4: await  getValue(workbook, sheet,1,column, 396,''),
            UA5_1_1_5: await  getValue(workbook, sheet,1,column, 397,''),
            UA5_1_1_6: await  getValue(workbook, sheet,1,column, 398,''),
            UA5_1_1_7: await  getValue(workbook, sheet,1,column, 399,''),
            UA5_1_2_1: await  getValue(workbook, sheet,1,column, 401,''),
            UA5_1_2_2: await  getValue(workbook, sheet,1,column, 402,''),
            UA5_1_2_3: await  getValue(workbook, sheet,1,column, 403,''),
            UA5_1_2_4: await  getValue(workbook, sheet,1,column, 404,''),
            UA5_1_2_5: await  getValue(workbook, sheet,1,column, 405,''),
            UA5_1_3_1: await  getValue(workbook, sheet,1,column, 407,''),
            UA5_1_3_2: await  getValue(workbook, sheet,1,column, 408,''),
            UA5_1_3_3: await  getValue(workbook, sheet,1,column, 409,''),
            UA5_1_3_4: await  getValue(workbook, sheet,1,column, 410,''),
            UA5_1_4_1: await  getValue(workbook, sheet,1,column, 412,''),
            UA5_1_4_2: await  getValue(workbook, sheet,1,column, 413,''),
            UA5_1_4_3: await  getValue(workbook, sheet,1,column, 414,''),
            UA5_1_4_4: await  getValue(workbook, sheet,1,column, 415,''),
            UA5_2: await  getValue(workbook, sheet,1,'B', 417,''),
            UA5_2_1_1: await  getValue(workbook, sheet,1,column, 419,''), 
            UA5_2_1_2: await  getValue(workbook, sheet,1,column, 420,''),
            UA5_2_1_3: await  getValue(workbook, sheet,1,column, 421,''),
            UA5_2_1_4: await  getValue(workbook, sheet,1,column, 422,''),
            UA5_2_1_5: await  getValue(workbook, sheet,1,column, 423,''),
            UA5_2_1_6: await  getValue(workbook, sheet,1,column, 424,''),
            UA5_2_2_1: await  getValue(workbook, sheet,1,column, 426,''),
            UA5_2_2_2: await  getValue(workbook, sheet,1,column, 427,''),
            UA5_2_2_3: await  getValue(workbook, sheet,1,column, 428,''),
            UA5_2_2_4: await  getValue(workbook, sheet,1,column, 429,''),
            UA5_2_2_5: await  getValue(workbook, sheet,1,column, 430,''),
            UA5_2_3_1: await  getValue(workbook, sheet,1,column, 432,''),
            UA5_2_3_2: await  getValue(workbook, sheet,1,column, 433,''),
            UA5_2_3_3: await  getValue(workbook, sheet,1,column, 434,''),
            UA5_2_3_4: await  getValue(workbook, sheet,1,column, 435,''),
            UA5_2_4_1: await  getValue(workbook, sheet,1,column, 437,''),
            UA5_2_4_2: await  getValue(workbook, sheet,1,column, 438,''),
            UA5_2_4_3: await  getValue(workbook, sheet,1,column, 439,''),
            UA5_2_4_4: await  getValue(workbook, sheet,1,column, 440,''),
            UA5_3: await  getValue(workbook, sheet,1,'B', 442,''),
            UA5_3_1_1: await  getValue(workbook, sheet,1,column, 444,''), 
            UA5_3_1_2: await  getValue(workbook, sheet,1,column, 445,''),
            UA5_3_1_3: await  getValue(workbook, sheet,1,column, 446,''),
            UA5_3_1_4: await  getValue(workbook, sheet,1,column, 447,''),
            UA5_3_1_5: await  getValue(workbook, sheet,1,column, 448,''),
            UA5_3_1_6: await  getValue(workbook, sheet,1,column, 449,''),
            UA5_3_1_7: await  getValue(workbook, sheet,1,column, 450,''),
            UA5_3_2_1: await  getValue(workbook, sheet,1,column, 452,''),
            UA5_3_2_2: await  getValue(workbook, sheet,1,column, 453,''),
            UA5_3_2_3: await  getValue(workbook, sheet,1,column, 454,''),
            UA5_3_2_4: await  getValue(workbook, sheet,1,column, 455,''),
            UA5_3_3_1: await  getValue(workbook, sheet,1,column, 457,''),
            UA5_3_3_2: await  getValue(workbook, sheet,1,column, 458,''),
            UA5_3_3_3: await  getValue(workbook, sheet,1,column, 459,''),
            UA5_3_3_4: await  getValue(workbook, sheet,1,column, 460,''),
            UA5_3_4_1: await  getValue(workbook, sheet,1,column, 462,''),
            UA5_3_4_2: await  getValue(workbook, sheet,1,column, 463,''),
            UA5_3_4_3: await  getValue(workbook, sheet,1,column, 464,''),
            UA5_3_4_4: await  getValue(workbook, sheet,1,column, 465,''),
            UA5_4: await  getValue(workbook, sheet,1,'B', 467,''),
            UA5_4_1_1: await  getValue(workbook, sheet,1,column, 469,''), 
            UA5_4_1_2: await  getValue(workbook, sheet,1,column, 470,''),
            UA5_4_1_3: await  getValue(workbook, sheet,1,column, 471,''),
            UA5_4_1_4: await  getValue(workbook, sheet,1,column, 472,''),
            UA5_4_1_5: await  getValue(workbook, sheet,1,column, 473,''),
            UA5_4_1_6: await  getValue(workbook, sheet,1,column, 474,''),
            UA5_4_1_7: await  getValue(workbook, sheet,1,column, 475,''),
            UA5_4_2_1: await  getValue(workbook, sheet,1,column, 477,''),
            UA5_4_2_2: await  getValue(workbook, sheet,1,column, 478,''),
            UA5_4_2_3: await  getValue(workbook, sheet,1,column, 479,''),
            UA5_4_2_4: await  getValue(workbook, sheet,1,column, 480,''),
            UA5_4_2_5: await  getValue(workbook, sheet,1,column, 481,''),
            UA5_4_3_1: await  getValue(workbook, sheet,1,column, 483,''),
            UA5_4_3_2: await  getValue(workbook, sheet,1,column, 484,''),
            UA5_4_3_3: await  getValue(workbook, sheet,1,column, 485,''),
            UA5_4_3_4: await  getValue(workbook, sheet,1,column, 486,''),
            UA5_4_4_1: await  getValue(workbook, sheet,1,column, 488,''),
            UA5_4_4_2: await  getValue(workbook, sheet,1,column, 489,''),
            UA5_4_4_3: await  getValue(workbook, sheet,1,column, 490,''),
            UA5_4_4_4: await  getValue(workbook, sheet,1,column, 491,''),
            CR6_1: await  getValue(workbook, sheet,1,'B', 495,''),
            CR6_1_1_1: await  getValue(workbook, sheet,1,column, 497,''),
            CR6_1_1_2: await  getValue(workbook, sheet,1,column, 498,''),
            CR6_1_1_3: await  getValue(workbook, sheet,1,column, 499,''),
            CR6_1_1_4: await  getValue(workbook, sheet,1,column, 500,''),
            CR6_1_1_5: await  getValue(workbook, sheet,1,column, 501,''),
            CR6_1_1_6: await  getValue(workbook, sheet,1,column, 502,''),
            CR6_1_2_1: await  getValue(workbook, sheet,1,column, 504,''),
            CR6_1_2_2: await  getValue(workbook, sheet,1,column, 505,''),
            CR6_1_2_3: await  getValue(workbook, sheet,1,column, 506,''),
            CR6_1_2_4: await  getValue(workbook, sheet,1,column, 507,''),
            CR6_1_3_1: await  getValue(workbook, sheet,1,column, 509,''),
            CR6_1_3_2: await  getValue(workbook, sheet,1,column, 510,''),
            CR6_1_3_3: await  getValue(workbook, sheet,1,column, 511,''),
            CR6_1_3_4: await  getValue(workbook, sheet,1,column, 512,''),
            CR6_1_4_1: await  getValue(workbook, sheet,1,column, 514,''),
            CR6_1_4_2: await  getValue(workbook, sheet,1,column, 515,''),
            CR6_1_4_3: await  getValue(workbook, sheet,1,column, 516,''),
            CR6_1_4_4: await  getValue(workbook, sheet,1,column, 517,''),
            CR6_2: await  getValue(workbook, sheet,1,'B', 519,''),
            CR6_2_1_1: await  getValue(workbook, sheet,1,column,521,''),
            CR6_2_1_2: await  getValue(workbook, sheet,1,column, 522,''),
            CR6_2_1_3: await  getValue(workbook, sheet,1,column, 523,''),
            CR6_2_1_4: await  getValue(workbook, sheet,1,column, 524,''),
            CR6_2_2_1: await  getValue(workbook, sheet,1,column, 526,''),
            CR6_2_2_2: await  getValue(workbook, sheet,1,column, 527,''),
            CR6_2_2_3: await  getValue(workbook, sheet,1,column, 528,''),
            CR6_2_2_4: await  getValue(workbook, sheet,1,column, 529,''),
            LEC7_1: await  getValue(workbook, sheet,1,'B', 533,''),
            LEC7_1_1_1: await  getValue(workbook, sheet,1,column, 535,''),
            LEC7_1_1_2: await  getValue(workbook, sheet,1,column, 536,''),
            LEC7_1_1_3: await  getValue(workbook, sheet,1,column, 537,''),
            LEC7_1_1_4: await  getValue(workbook, sheet,1,column, 538,''),
            LEC7_1_1_5: await  getValue(workbook, sheet,1,column, 539,''),
            LEC7_1_1_6: await  getValue(workbook, sheet,1,column, 540,''),
            LEC7_1_1_7: await  getValue(workbook, sheet,1,column, 541,''),
            LEC7_1_1_8: await  getValue(workbook, sheet,1,column, 542,''),
            LEC7_1_1_9: await  getValue(workbook, sheet,1,column, 543,''),
            LEC7_1_2_1: await  getValue(workbook, sheet,1,column, 545,''),
            LEC7_1_2_2: await  getValue(workbook, sheet,1,column, 546,''),
            LEC7_1_2_3: await  getValue(workbook, sheet,1,column, 547,''),
            LEC7_1_2_4: await  getValue(workbook, sheet,1,column, 548,''),
            LEC7_2_2_1: await  getValue(workbook, sheet,1,column, 552,''),
            LEC7_2_2_2: await  getValue(workbook, sheet,1,column, 553,''),
            LEC7_2_2_3: await  getValue(workbook, sheet,1,column, 554,''),
            LEC7_2_2_4: await  getValue(workbook, sheet,1,column, 555,''),
            LEC7_2_2_5: await  getValue(workbook, sheet,1,column, 556,''),
            LEC7_2_2_6: await  getValue(workbook, sheet,1,column, 557,''),
            G8_1_1: await  getValue(workbook, sheet,1,'B', 562,''),
            G8_1_1_1: await  getValue(workbook, sheet,1,column, 563,''),
            G8_1_1_2: await  getValue(workbook, sheet,1,column, 564,''),
            G8_1_1_3: await  getValue(workbook, sheet,1,column, 565,''),
            G8_1_1_4: await  getValue(workbook, sheet,1,column, 566,''),
            G8_1_1_5: await  getValue(workbook, sheet,1,column, 567,''),
            G8_1_1_6: await  getValue(workbook, sheet,1,column, 568,''),
            G8_1_2: await  getValue(workbook, sheet,1,'B', 569,''),
            G8_1_2_1: await  getValue(workbook, sheet,1,column, 570,''),
            G8_1_2_2: await  getValue(workbook, sheet,1,column, 571,''),
            G8_1_2_3: await  getValue(workbook, sheet,1,column, 572,''),
            G8_1_2_4: await  getValue(workbook, sheet,1,column, 573,''),
            G8_1_2_5: await  getValue(workbook, sheet,1,column, 574,''),
            G8_1_3: await  getValue(workbook, sheet,1,'B', 575,''),
            G8_1_3_1: await  getValue(workbook, sheet,1,column, 576,''),
            G8_1_3_2: await  getValue(workbook, sheet,1,column, 577,''),
            G8_1_3_3: await  getValue(workbook, sheet,1,column, 578,''),
            G8_1_3_4: await  getValue(workbook, sheet,1,column, 579,''),
            G8_1_3_5: await  getValue(workbook, sheet,1,column, 580,''),
            G8_1_3_6: await  getValue(workbook, sheet,1,column, 581,''),
            G8_1_3_7: await  getValue(workbook, sheet,1,column, 582,''),
            G8_1_4: await  getValue(workbook, sheet,1,'B', 583,''),
            G8_1_4_1: await  getValue(workbook, sheet,1,column, 584,''),
            G8_1_4_2: await  getValue(workbook, sheet,1,column, 585,''),
            G8_1_4_3: await  getValue(workbook, sheet,1,column, 586,''),
            G8_1_4_4: await  getValue(workbook, sheet,1,column, 587,''),
            G8_1_5: await  getValue(workbook, sheet,1,'B', 588,''),
            G8_1_5_1: await  getValue(workbook, sheet,1,column, 589,''),
            G8_1_5_2: await  getValue(workbook, sheet,1,column, 590,''),
            G8_1_5_3: await  getValue(workbook, sheet,1,column, 591,''),
            G8_1_5_4: await  getValue(workbook, sheet,1,column, 592,''),
            G8_1_5_5: await  getValue(workbook, sheet,1,column, 593,''),
            G8_1_5_6: await  getValue(workbook, sheet,1,column, 594,''),
            G8_1_5_7: await  getValue(workbook, sheet,1,column, 595,''),
            G8_2_1: await  getValue(workbook, sheet,1,'B', 598,''),
            G8_2_1_1: await  getValue(workbook, sheet,1,column, 599,''),
            G8_2_1_2: await  getValue(workbook, sheet,1,column, 600,''),
            G8_2_1_3: await  getValue(workbook, sheet,1,column, 601,''),
            G8_2_1_4: await  getValue(workbook, sheet,1,column, 602,''),
            G8_2_1_5: await  getValue(workbook, sheet,1,column, 603,''),
            G8_2_1_6: await  getValue(workbook, sheet,1,column, 604,''),
            G8_2_2: await  getValue(workbook, sheet,1,'B', 605,''),
            G8_2_2_1: await  getValue(workbook, sheet,1,column, 606,''),
            G8_2_2_2: await  getValue(workbook, sheet,1,column, 607,''),
            G8_2_2_3: await  getValue(workbook, sheet,1,column, 608,''),
            G8_2_2_4: await  getValue(workbook, sheet,1,column, 609,''),
            G8_2_2_5: await  getValue(workbook, sheet,1,column, 610,''),
            G8_2_2_6: await  getValue(workbook, sheet,1,column, 611,''),
            G8_2_3: await  getValue(workbook, sheet,1,'B', 612,''),
            G8_2_3_1: await  getValue(workbook, sheet,1,column, 613,''),
            G8_2_3_2: await  getValue(workbook, sheet,1,column, 614,''),
            G8_2_3_3: await  getValue(workbook, sheet,1,column, 615,''),
            G8_2_3_4: await  getValue(workbook, sheet,1,column, 616,''),
            G8_2_3_5: await  getValue(workbook, sheet,1,column, 617,''),
            G8_2_3_6: await  getValue(workbook, sheet,1,column, 618,''),
            G8_3: await  getValue(workbook, sheet,1,'B', 620,''),
            G8_3_1_1: await  getValue(workbook, sheet,1,column, 622,''),  
            G8_3_1_2: await  getValue(workbook, sheet,1,column, 623,''),
            G8_3_1_3: await  getValue(workbook, sheet,1,column, 624,''),
            G8_3_1_4: await  getValue(workbook, sheet,1,column, 625,''),
            G8_3_1_5: await  getValue(workbook, sheet,1,column, 626,''),
            G8_3_1_6: await  getValue(workbook, sheet,1,column, 627,''),
            G8_3_2_1: await  getValue(workbook, sheet,1,column, 629,''),
            G8_3_2_2: await  getValue(workbook, sheet,1,column, 630,''),
            G8_3_2_3: await  getValue(workbook, sheet,1,column, 631,''),
            G8_3_2_4: await  getValue(workbook, sheet,1,column, 632,''),
            G8_3_2_5: await  getValue(workbook, sheet,1,column, 633,''),
            SPAQ9_1_1_1: await  getValue(workbook, sheet,1,column, 639,''),
            SPAQ9_1_1_2: await  getValue(workbook, sheet,1,column, 640,''),
            SPAQ9_1_1_3: await  getValue(workbook, sheet,1,column, 641,''),
            SPAQ9_1_1_4: await  getValue(workbook, sheet,1,column, 642,''),
            SPAQ9_1_1_5: await  getValue(workbook, sheet,1,column, 643,''),
            SPAQ9_1_1_6: await  getValue(workbook, sheet,1,column, 644,''),
            SPAQ9_1_2_1: await  getValue(workbook, sheet,1,column, 646,''),
            SPAQ9_1_2_2: await  getValue(workbook, sheet,1,column, 647,''),
            SPAQ9_1_2_3: await  getValue(workbook, sheet,1,column, 648,''),
            SPAQ9_1_2_4: await  getValue(workbook, sheet,1,column, 649,''),
            SPAQ9_1_3_1: await  getValue(workbook, sheet,1,column, 651,''),
            SPAQ9_1_3_2: await  getValue(workbook, sheet,1,column, 652,''),
            SPAQ9_1_3_3: await  getValue(workbook, sheet,1,column, 653,''),
            SPAQ9_1_3_4: await  getValue(workbook, sheet,1,column, 654,''),
            SPAQ9_1_4_1: await  getValue(workbook, sheet,1,column, 656,''),
            SPAQ9_1_4_2: await  getValue(workbook, sheet,1,column, 657,''),
            SPAQ9_1_4_3: await  getValue(workbook, sheet,1,column, 658,''),
            SPAQ9_1_4_4: await  getValue(workbook, sheet,1,column, 659,''),
            SPAQ9_1_5_1: await  getValue(workbook, sheet,1,column, 661,''),
            SPAQ9_1_5_2: await  getValue(workbook, sheet,1,column, 662,''),
            SPAQ9_1_5_3: await  getValue(workbook, sheet,1,column, 663,''),
            SPAQ9_1_5_4: await  getValue(workbook, sheet,1,column, 664,''),
            SPAQ9_2_1_1: await  getValue(workbook, sheet,1,column, 668,''),
            SPAQ9_2_1_2: await  getValue(workbook, sheet,1,column, 669,''),
            SPAQ9_2_1_3: await  getValue(workbook, sheet,1,column, 670,''),
            SPAQ9_2_2_1: await  getValue(workbook, sheet,1,column, 672,''),
            SPAQ9_2_2_2: await  getValue(workbook, sheet,1,column, 673,''),
            SPAQ9_2_2_3: await  getValue(workbook, sheet,1,column, 674,''),
            SPAQ9_2_2_4: await  getValue(workbook, sheet,1,column, 675,''),
            AEH10_1_1_1: await  getValue(workbook, sheet,1,column, 681,''),
            AEH10_1_1_2: await  getValue(workbook, sheet,1,column, 682,''),
            AEH10_1_1_3: await  getValue(workbook, sheet,1,column, 683,''),
            AEH10_1_1_4: await  getValue(workbook, sheet,1,column, 684,''),
            AEH10_1_1_5: await  getValue(workbook, sheet,1,column, 685,''),
            AEH10_1_1_6: await  getValue(workbook, sheet,1,column, 686,''),
            AEH10_1_2_1: await  getValue(workbook, sheet,1,column, 688,''),
            AEH10_1_2_2: await  getValue(workbook, sheet,1,column, 689,''),
            AEH10_1_2_3: await  getValue(workbook, sheet,1,column, 690,''),
            AEH10_1_2_4: await  getValue(workbook, sheet,1,column, 691,''),
            AEH10_1_2_5: await  getValue(workbook, sheet,1,column, 692,''),
            AEH10_1_2_6: await  getValue(workbook, sheet,1,column, 693,''),
            AEH10_1_2_7: await  getValue(workbook, sheet,1,column, 694,''),
            AEH10_1_3_1: await  getValue(workbook, sheet,1,column, 696,''),
            AEH10_1_3_2: await  getValue(workbook, sheet,1,column, 697,''),
            AEH10_1_3_3: await  getValue(workbook, sheet,1,column, 698,''),
            AEH10_1_3_4: await  getValue(workbook, sheet,1,column, 699,''),
            AEH10_1_3_5: await  getValue(workbook, sheet,1,column, 700,''),
            AEH10_2_1_1: await  getValue(workbook, sheet,1,column, 704,''),
            AEH10_2_1_2: await  getValue(workbook, sheet,1,column, 705,''),
            AEH10_2_1_3: await  getValue(workbook, sheet,1,column, 706,''),
            AEH10_2_1_4: await  getValue(workbook, sheet,1,column, 707,''),
            AEH10_2_1_5: await  getValue(workbook, sheet,1,column, 708,''),
            AEH10_2_2_1: await  getValue(workbook, sheet,1,column, 710,''),
            AEH10_2_2_2: await  getValue(workbook, sheet,1,column, 711,''),
            AEH10_2_2_3: await  getValue(workbook, sheet,1,column, 712,''),
            AEH10_2_2_4: await  getValue(workbook, sheet,1,column, 713,''),
            AEH10_2_2_5: await  getValue(workbook, sheet,1,column, 714,''),
            AEH10_2_2_6: await  getValue(workbook, sheet,1,column, 715,''),
            AEH10_2_2_7: await  getValue(workbook, sheet,1,column, 716,''),
        }     
        workbook = null;
        return data;
    } catch(error)
    {
        console.error('Ocorreu um erro:', error);
        return null;
    }
}

async function clearCheckList(file, column)
{

}

async function editChecklist(file, column, data)
{

}

async function setValue(workbook, sheet, type, column, row, val, fail, condition = true)
{
    if(!condition)
        return;
    switch(type)
    {
        case 1:
            return sheet.cell(column + row).value(parseInt(val) || fail);
        break;
        case 2:
            return sheet.cell(column + row).value(parseFloat(val) || fail);
        break;
        default:
            return sheet.cell(column + row).value(val || fail);
        break;
    }
}

async function getValue(workbook, sheet, type, column, row, fail)
{
    switch(type)
    {
        case 1:
            return parseInt(sheet.cell(column + row).value()) || fail;
        break;
        case 2:
            return parseFloat(sheet.cell(column + row).value()) || fail;
        break;
        default:
            return sheet.cell(column + row).value() || fail;
        break;
    }
}

module.exports = {
    createExcel, readExcel, editExcel, clearExcel, writeCheckList, readCheckList, editChecklist, clearCheckList
};


