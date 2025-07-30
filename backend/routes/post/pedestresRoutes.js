const express = require('express');
const router = express.Router();
const PedestreController = require('../../controllers/post/PedestreController');

router.put('/pedestres/saida', PedestreController.putSaida);

module.exports = router;
