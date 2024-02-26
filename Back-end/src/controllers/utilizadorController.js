const Utilizador = require('../model/Utilizador');
const Perfil = require('../model/Perfil');
const controllers = {};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pw = require('../pw');

controllers.list = async (req, res) => {
  try {
  
    const data = await Utilizador.findAll({
      order: [
        [Perfil, 'perms', 'DESC'],
        ['username', 'ASC'],
      ],
      include: [
        {
          model: Perfil,
          attributes: ['perfil', 'perms'],
        }
      ],
      attributes: { exclude: ['password'] },
    });
    res.status(200).json({
      success: true,
      message: "Lista de utilizadores obtida com sucesso.",
      data,
    });
  } catch (error) {
    console.log("Erro: " + error);
    res.status(404).json({ success: false, message: 'Ocorreu um erro a listar os utilizadores.'});
  }
};

controllers.create = async (req, res) => {
  const { username, password, primNome, ultNome, telemovel, email, nascimento, morada } = req.body;
  try {
    await Utilizador.create({
      username, password, primNome, ultNome, telemovel, email, nascimento, morada, estado: "Ativa", perfilId: 1, passwordAlteradaEm: new Date()
    });
    res.status(200).json({
      success: true,
      message: "Utilizador registado com sucesso.",
    });
  } catch (error) {
    console.log("Erro: " + error);
    res.json({ success: false, message: 'Ocorreu um erro a criar o utilizador.'});
  }
};

controllers.update = async (req, res) => { 
  const { id } = req.params;
  const { username, img, primNome, ultNome, telemovel, email, nascimento, morada, estado, perfil } = req.body;
  try {
      await Utilizador.update(
      {
        img,
        username, 
        primNome, 
        ultNome, 
        telemovel, 
        email, 
        nascimento, 
        morada,
        estado,
        perfil
      },
      { where: { id: id } });
      res.status(200).json({
        success: true,
        message: "Utilizador atualizado com sucesso.",
      });
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json({ success: false, message: 'Ocorreu um erro a atualizar o utilizador.'});
  }
};

controllers.updatePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  try {
    const utilizador = await Utilizador.findOne({
      where: { id },
      include: [{ model: Perfil, attributes: ['perfil','perms'] }]
    });

    const validOldPassword = await bcrypt.compare(oldPassword, utilizador.password);
    if (!utilizador || !validOldPassword) {
      return res.json({ success: false, message: "Password introduzida incorreta." });
    }

    // Atualiza a senha do usuário no banco de dados
    dataAtual = new Date();
    utilizador.password = await bcrypt.hash(newPassword, 10);
    utilizador.passwordAlteradaEm = dataAtual;
    await utilizador.save();

    // Gera um novo token JWT com a data da última alteração da senha
    const token = jwt.sign({ id: utilizador.id, email: utilizador.email, perfil: utilizador.perfil.perfil, senhaAlteradaEm: dataAtual}, pw.tokenPassword, { expiresIn: "1d"});      

    return res.status(200).json({ success: true, token, message: "Password alterada com sucesso." });
  } catch (error) {
    console.log("Error: " + error);
    return res.json({ success: false, message: "Ocorreu um erro." });
  }
};

controllers.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const utilizador = await Utilizador.findOne({
      where: { id },
    });
    if (!utilizador) {
      return res.json({ success: false, message: 'Utilizador não encontrado.' });
    }

    await utilizador.destroy();
    res.status(200).json({ success: true, message: 'Utilizador eliminado com sucesso.' });
  } catch (error) {
    console.log("Erro: " + error);
    res.json({ success: false, message: 'Erro ao eliminar utilizador.' });
  }
};

controllers.get = async (req, res) => {
  const { id } = req.params;
   try {
    const data = await Utilizador.findOne({
      where: { id: id },
      include: [{ model: Perfil, attributes: ['perfil','perms'] }],
      attributes: { exclude: ['password'] },
    });
    res.status(200).json({ success: true, data, message: 'Dados obtidos com sucesso.' });
  } catch (error) {
    console.log("Erro: " + error);
    res.status(404).json({ success: false, message: 'Erro ao procurar utilizador.' });
  }
};

controllers.login = async (req, res) => {
  const { email, password, remember } = req.body;
  try {
    const utilizador = await Utilizador.findOne({
      where: { email },
      include: [{ model: Perfil, attributes: ['perfil','perms'] }]
    });

    if (!utilizador) {
      return res.json({ success: false, message: 'Email ou Password inválidos.' });
    }
    const validPassword = bcrypt.compareSync(password, utilizador.password);    
    if(!validPassword)
      return res.json({ success: false, message: 'Email ou Password inválidos.' });

    if(utilizador.estado === "Por Verificar")
      return res.json({ success: false, message: 'Conta não se encontra verificada.' });
    if(utilizador.estado === "Bloqueada")
      return res.json({ success: false, message: "Esta conta está banida!" });
    if(utilizador.estado === "Inativa")
      return res.json({ success: false, message: "Esta conta está inativa, contacte o suporte!" });
    
    if(utilizador.primeiroLogin === null)
    {  
      utilizador.primeiroLogin = new Date();
    }
    utilizador.ultimoLogin = new Date();
    await utilizador.save();
    
    const expires = remember ? '31d' : '1d';
    const token = jwt.sign({ id: utilizador.id, email: utilizador.email, perfil: utilizador.perfil.perfil, senhaAlteradaEm: utilizador.passwordAlteradaEm}, pw.tokenPassword, { expiresIn: expires});      
    return res.status(200).json({ success: true, token, message: "Logado com sucesso."});
    }
   catch (error) {
    console.log("Erro: " + error);
    return res.json({ success: false, message: "Ocorreu um erro durante o login." });
  }
};

controllers.getUserData = async (req, res) => {
  try{
  const id = req.decoded.id;
    const utilizador = await Utilizador.findOne({
      where: { id },
      include: [
        { model: Perfil, attributes: ['perfil', 'perms'] }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!utilizador || utilizador.estado !== 'Ativa') {
      return res.json({ success: false, message: 'Ocorreu um erro na sua Conta.' });
    }
     
    utilizador.ultimoLogin = new Date();
    await utilizador.save();
    const data = {
      id: utilizador.id,
      email: utilizador.email,
      perfil: utilizador.perfil,
      username: utilizador.username,
      img: utilizador.img
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Erro: ", error);
    return res.json({ success: false, message: 'Ocorreu um erro a verificar os dados da conta logada!' });
  }
};

module.exports = controllers;