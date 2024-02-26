const express = require('express');
const router = express.Router();
const utilizadorController = require('../controllers/utilizadorController')
const middleware = require('../middleware')

router.get('/list', middleware.checkToken, utilizadorController.list);
router.post('/create', middleware.checkToken, utilizadorController.create);
router.put('/update/:id', middleware.checkToken, utilizadorController.update);
router.post('/updatePassword', middleware.checkToken, utilizadorController.updatePassword);
router.delete('/delete/:id', middleware.checkToken, utilizadorController.delete);
router.get('/get/:id', middleware.checkToken, utilizadorController.get);
router.post('/login', utilizadorController.login);
router.get('/getUserData', middleware.checkToken, utilizadorController.getUserData);

module.exports = router;
