const express = require('express');
const router = express.Router();

const PortariaController = require('../../controllers/get/GetFindPortariaController');

router.get('/portaria/filtro', PortariaController.getEntradasFiltradas);

module.exports = router;
