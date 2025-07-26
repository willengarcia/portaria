const express = require('express');
const router = express.Router();
const CarroController = require('../../controllers/post/CarroController');

router.post('/carro', CarroController.criar);

module.exports = router;
