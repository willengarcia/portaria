const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const usuarioRoutes = require('./routes/post/usuarioRoutes');
const loginRoutes = require('./routes/post/loginRoutes');
const protegidaRoutes = require('./routes/post/protegidaRoutes');
const fabricaRoutes = require('./routes/post/fabricaRoutes');
const motoristaRoutes = require('./routes/post/motoristaRoutes');
const carroRoutes = require('./routes/post/carroRoutes');
const portariaRoutes = require('./routes/post/portariaRoutes');
const getfabricaRoutes = require('./routes/get/getFabricaRoutes');
const getportariaRoutes = require('./routes/get/getPortariaRoutes');
const getFindportariaRoutes = require('./routes/get/getFindPortariaRoutes');
const getmotoristaRoutes = require('./routes/get/getMotoristaRoutes');
const getCarrosRoutes = require('./routes/get/getCarrosRoutes');

app.use(cors({
  origin: '*' 
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', usuarioRoutes);
app.use('/api', loginRoutes);
app.use('/api', protegidaRoutes);
app.use('/api', fabricaRoutes);
app.use('/api', motoristaRoutes); 
app.use('/api', carroRoutes);
app.use('/api', portariaRoutes);
app.use('/api', getfabricaRoutes);
app.use('/api', getportariaRoutes);
app.use('/api', getFindportariaRoutes);
app.use('/api', getmotoristaRoutes);
app.use('/api', getCarrosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
