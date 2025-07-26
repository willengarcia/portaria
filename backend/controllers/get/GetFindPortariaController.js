const PortariaModel = require('../../models/get/GetFindPortariaModel');

exports.getEntradasFiltradas = async (req, res) => {
  try {
    const {
      data_inicial,
      data_final,
      motorista_id,
      fabrica_id,
      placa
    } = req.query;

    if (!data_inicial || !data_final || !fabrica_id) {
      return res.status(400).json({ erro: 'data_inicial, data_final e fabrica_id são obrigatórios' });
    }

    const resultados = await PortariaModel.buscarEntradasFiltradas(
      data_inicial,
      data_final,
      fabrica_id,
      motorista_id,
      placa
    );

    res.json(resultados);
  } catch (err) {
    console.error('Erro ao buscar entradas filtradas:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
