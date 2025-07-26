const express = require('express');
const router = express.Router();
const multer = require('multer');
const PortariaController = require('../../controllers/post/PortariaController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/portaria', upload.single('imagem'), PortariaController.criarRegistro);

module.exports = router;
