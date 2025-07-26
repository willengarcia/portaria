const express = require('express');
const router = express.Router();
const MotoristaController = require('../../controllers/post/MotoristaController');

router.post('/motorista', MotoristaController.criar);

module.exports = router;
