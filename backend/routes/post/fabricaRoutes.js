const express = require('express');
const router = express.Router();
const FabricaController = require('../../controllers/post/FabricaController');

router.post('/fabrica', FabricaController.criar);

module.exports = router;
