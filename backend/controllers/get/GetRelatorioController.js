const model = require('../../models/get/GetRelatorioModel');

exports.getRelatorio = async (req, res) => {
  try {
    const { dataInicio, dataFim, fabricaId } = req.query;

    if (!dataInicio || !dataFim || !fabricaId) {
      return res.status(400).json({ erro: 'Parâmetros obrigatórios não enviados.' });
    }

    const resultado = await model.gerarRelatorio(dataInicio, dataFim, fabricaId);

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ erro: 'Erro ao gerar relatório' });
  }
};
