const TopicosdaIdeias = require("../models/topicosdaidea.model");
const Ideia = require("../models/ideias.model")
const TopicoIdeia = require("../models/topicoidea.model")


exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
      return res.status(400).send({
        success: false,
        message: "Conteúdo não pode estar vazio!"
      });
    }
    console.log(req.body);
  
    // Criar Nova Indicação
    try {
      const topicosdaideias = await TopicosdaIdeias.create(req.body);
      return res.send({ message: topicosdaideias, success: true});
    } catch (error) {
      return res.status(500).send({ message: "Erro ao criar topico ideia: " + error , success: false });
    }
  
  };

// Get all Indicações
exports.getAll = async (req, res) => {
    try {
      const nideia = req.query.nideia;
      const ntopico = req.query.ntopicoideia;
      let topicosdaIdeias;
      if(nideia && ntopico)
       topicosdaIdeias = await TopicosdaIdeias.findAll({ where : {NIdeia: nideia, NTopicoIdeia: ntopico}});
      else if(!nideia && ntopico)
      topicosdaIdeias = await TopicosdaIdeias.findAll({ where : {NTopicoIdeia: ntopico}});
      else if(nideia && !ntopico)
       topicosdaIdeias = await TopicosdaIdeias.findAll({ where : {NIdeia: nideia}});
       else
       topicosdaIdeias = await TopicosdaIdeias.findAll();

       if(topicosdaIdeias.length === 0)
       return res.status(404).send({success: false ,  message: 'Nada foi encontrado'});
      else
      return res.send({  success: true ,message: topicosdaIdeias});

    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter tipoIdeia.", success: false });
    }
  };
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const NIdeia = req.params.nideia;
      const NTopicoIdeia = req.params.ntopicoideia
      const topicosdaIdeias =  await TopicosdaIdeias.findOne({
        where: {
          NIdeia,
          NTopicoIdeia
        }
      });
  
      if (topicosdaIdeias) {
        console.log("Topicos da ideia encontrada: ", topicosdaIdeias);
        return res.send({ message: topicosdaIdeias, success: true });
      } else {
        return res.status(404).send({ message: `Tipo de ideia não encontrada de id: ${NTopicoIdeia}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar topico ideia: " + err, success: false });
    }
  };

  // Delete a TopicosdaIdeias by ID
  exports.delete = async (req, res) => {
    const ntopicoideia = req.query.ntopicoideia;
    const nideia = req.query.nideia;
    try {
        let whereCondition = {};

        if (ntopicoideia && nideia) {
            whereCondition = { NTopicoIdeia: ntopicoideia, NIdeia: nideia };
        } else if (ntopicoideia) {
            whereCondition = { NTopicoIdeia: ntopicoideia };
        } else if (nideia) {
            whereCondition = { NIdeia: nideia };
        } else {
            return res.status(400).send({
                success: false,
                message: "Por favor, forneça pelo menos um parâmetro de pesquisa válido (ntopicoideia, nideia)"
            });
        }

        const result = await TopicosdaIdeias.destroy({ where: whereCondition });

        if (result === 0) {
            res.status(404).send({
                success: false,
                message: "Nenhum registro encontrado para exclusão"
            });
        } else {
            res.status(200).send({
                success: true,
                message: `TopicosdaIdeias excluída(s) com sucesso`
            });
        }
    } catch (err) {
        console.log("Erro na query: ", err);
        res.status(500).send({
            success: false,
            message: "Erro ao excluir TopicosdaIdeias."
        });
    }
};