const express = require('express');
const router = express.Router();
const emprendimentoController = require('../controllers/empreendimentoController')
router.get('/list', emprendimentoController.list);
router.post('/create', emprendimentoController.create);
router.get('/get/:id',emprendimentoController.get);
router.get('/getDetails/:id',emprendimentoController.getDetails);
router.post('/update/:id', emprendimentoController.update);
router.delete('/delete/:id', emprendimentoController.delete);
module.exports = router;