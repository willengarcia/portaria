const express = require('express');
const router = express.Router();
const CarroController = require('../../controllers/get/GetCarrosController');

router.get('/carros', CarroController.getTodosCarros);

module.exports = router;
