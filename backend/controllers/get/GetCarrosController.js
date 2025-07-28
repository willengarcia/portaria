const CarroModel = require('../../models/get/GetCarrosModel');

async function getTodosCarros(req, res) {
  try {
    const carros = await CarroModel.listarCarros();
    res.status(200).json(carros);
  } catch (error) {
    console.error('Erro ao buscar carros:', error);
    res.status(500).json({ mensagem: 'Erro interno ao buscar carros' });
  }
}

module.exports = {
  getTodosCarros,
};
