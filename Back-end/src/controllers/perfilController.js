const Perfil = require('../model/Perfil');
const controllers = {};

controllers.list = async (req, res) => {
  try {
    const data = await Perfil.findAll({
      order: [['id', 'ASC'],['perms', 'DESC']]
    });    
    res.status(200).json({
      success: true,
      message: "Lista de perfis obtida com sucesso.",
      data,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json({ success: false, message: 'Ocorreu um erro ao listar os perfis.'});
  }
};

controllers.create = async (req, res) => {
  const { perfil, perms } = req.body;
  try {
    const data = await Perfil.create({
      perfil,
      perms
    });
    res.status(200).json({
      success: true,
      message: "Perfil criado com sucesso.",
      data,
    });
  } catch (error) {
    console.log("Erro: " + error);
    res.status(404).json({ success: false, message: 'Ocorreu um erro ao criar o perfil.'});
  }
};

controllers.get = async (req, res) => {
  const { id } = req.params;
   try {
    const data = await Perfil.findOne({
      where: { id },
    });
    res.status(200).json({ success: true, data, message: 'Dados obtidos com sucesso.' });
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json({ success: false, message: 'Ocorreu um erro ao procurar perfil.' });
  }
};

controllers.update = async (req, res) => {
  const { id } = req.params;
  const { perfil, perms } = req.body;
  try {
    const data = await Perfil.update(
      {
        perfil,
        perms
      },
      { where: { id } }
    );

    res.status(200).json({ success: true, data, message: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    console.log('Error: ' + error);
    res.status(404).json({ success: false, message: 'Ocorreu um erro ao atualizar o perfil.' });
  }
};

controllers.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await Perfil.destroy({
      where: { id },
    });
    res.status(200).json({ success: true, message: 'Perfil eliminado com sucesso.' });
  } catch (error) {
    console.log('Error: ' + error);
    res.status(404).json({ success: false, message: 'Ocorreu um erro ao eliminar o perfil.' });
  }
};

module.exports = controllers;
