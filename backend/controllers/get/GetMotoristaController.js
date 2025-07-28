const MotoristaModel = require('../../models/get/GetMotoristaModel');

async function getTodosMotoristas(req, res) {
  try {
    const motoristas = await MotoristaModel.listarMotoristas();
    res.status(200).json(motoristas);
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    res.status(500).json({ mensagem: 'Erro interno ao buscar motoristas' });
  }
}

module.exports = {
  getTodosMotoristas,
};
