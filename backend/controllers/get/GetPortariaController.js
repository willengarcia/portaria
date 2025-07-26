const portariaModel = require('../../models/get/GetPortariaModel');

exports.getEntradas = async (req, res) => {
  try {
    const entradas = await portariaModel.buscarEntradas();
    res.status(200).json(entradas);
  } catch (err) {
    console.error('Erro ao buscar entradas:', err);
    res.status(500).json({ erro: 'Erro ao buscar entradas' });
  }
};
