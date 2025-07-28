const express = require('express');
const router = express.Router();
const MotoristaController = require('../../controllers/get/GetMotoristaController');

router.get('/motoristas', MotoristaController.getTodosMotoristas);

module.exports = router;
