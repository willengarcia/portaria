const MotoristaModel = require('../../models/get/GetFindNomeMotoristaModel');
exports.buscarPorNome = async (req, res) => {
  const query = req.query.query;
  if (!query || query.trim().length < 3) {
    return res.status(400).json({ message: 'Parâmetro de busca inválido' });
  }

  try {
    const resultados = await MotoristaModel.buscarPorPlaca(query);
    res.json(resultados);
  } catch (error) {
    console.error('Erro ao buscar motorista por nome:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar motoristas' });
  }
};
