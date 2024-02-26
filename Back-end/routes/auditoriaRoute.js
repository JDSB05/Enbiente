const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController')
router.get('/list', auditoriaController.list);
router.post('/create', auditoriaController.create);
router.get('/get/:id',auditoriaController.get);
router.post('/update/:id', auditoriaController.update);
router.delete('/delete/:id', auditoriaController.delete);
module.exports = router;