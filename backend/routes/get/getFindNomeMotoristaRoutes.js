const express = require('express');
const router = express.Router();
const MotoristaController = require('../../controllers/get/GetFindNomeMotoristaController');

router.get('/findNomeMotorista', MotoristaController.buscarPorNome);

module.exports = router;
