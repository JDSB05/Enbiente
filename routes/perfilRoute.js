const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController')
router.get('/list', perfilController.list);
router.post('/create', perfilController.create);
router.get('/get/:id', perfilController.get);
router.post('/update/:id', perfilController.update);
router.delete('/delete/:id', perfilController.delete);
module.exports = router;