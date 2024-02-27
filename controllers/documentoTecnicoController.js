const fs = require('fs'); 
const multer = require('multer');
const path = require('path');
const { backendIP } = require('../apiConfig');
const folderName = "documentosTecnicos/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/documentosTecnicos/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const savefile = multer({
    storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 50, // Limite de 50MB
  }, fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Somente documentos (pdf) são aceites!'));
    }
    cb(null, true);
  }
}).single('file');

const controllers = {};

controllers.uploadDoc = async (req, res) => {
  try {
    savefile(req, res, (err) => {
      if (!err) {
        const url = folderName + req.file.filename;
        return res.status(200).json({ success:true, message:"Documento guardado com sucesso. ", url });
      }
      return res.json({ success: false, err });
    });
  } catch (error) {
    console.error(`Erro ao guardar o documento: ${error}`);
    return res.json({ success: false, error });
  }
};


//TODO apagar
controllers.deleteDoc = async (req, res) => {
  try {
    const { nome } = req.body; 
    
      if (nome == null || nome == undefined) 
        return res.json({ success: false, message: "O nome do documento não foi especificado" });
      const nomeFich = nome.split('/').pop();
      const caminhoArquivo = path.join(__dirname, '../../public/documentosTecnicos', nomeFich);
      await fs.promises.access(caminhoArquivo, fs.constants.F_OK);
      await fs.promises.unlink(caminhoArquivo); 
      return res.json({ success: true, message: "O ficheiro foi apagado com sucesso!" });
    } catch (error) {
    console.error(error);
    return res.json({ success: false, error });
  }
};

module.exports = controllers;