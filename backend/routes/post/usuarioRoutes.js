const express = require('express');
const router = express.Router();
const UsuarioController = require('../../controllers/post/usuarioController');

router.post('/usuarios', UsuarioController.criar);

module.exports = router;
