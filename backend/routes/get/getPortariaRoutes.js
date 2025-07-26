const express = require('express');
const router = express.Router();
const PortariaController = require('../../controllers/get/GetPortariaController');

router.get('/relatorio/status', PortariaController.getEntradas);

module.exports = router;
