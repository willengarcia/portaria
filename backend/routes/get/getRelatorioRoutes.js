const express = require('express');
const router = express.Router();
const relatorioController = require('../../controllers/get/GetRelatorioController');

router.get('/relatorio', relatorioController.getRelatorio);

module.exports = router;
