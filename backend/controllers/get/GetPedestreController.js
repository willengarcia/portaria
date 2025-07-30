const PedestreModel = require('../../models/get/GetPedestresModel');

async function getPedestres(req, res) {
  try {
    const dados = await PedestreModel.listarPedestres();
    res.json(dados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar pedestres || '+error });
  }
}

module.exports = {
  getPedestres
};