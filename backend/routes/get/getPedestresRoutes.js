const express = require('express');
const router = express.Router();
const PedestreController = require('../../controllers/get/GetPedestreController');

router.get('/pedestres', PedestreController.getPedestres);

module.exports = router;
