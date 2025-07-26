const express = require('express');
const router = express.Router();
const verificarToken = require('../../middlewares/authMiddleware');

router.get('/protegido', verificarToken, (req, res) => {
  res.json({
    mensagem: 'Você acessou uma rota protegida!',
    usuario: req.usuario
  });
});

module.exports = router;
