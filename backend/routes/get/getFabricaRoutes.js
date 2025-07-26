const express = require('express');
const router = express.Router();
const FabricaController = require('../../controllers/get/GetFabricaController');

router.get('/allFabricas', FabricaController.listarFabricas);

module.exports = router;
