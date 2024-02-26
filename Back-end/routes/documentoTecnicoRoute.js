const express = require('express');
const router = express.Router();

const documentoTecnicoController = require('../controllers/documentoTecnicoController')

router.post('/upload', documentoTecnicoController.uploadDoc);
router.post('/delete', documentoTecnicoController.deleteDoc);
router.use('/tecnico', express.static('public/documentosTecnicos'));
router.use('/excel', express.static('public/documentos'));

module.exports = router;