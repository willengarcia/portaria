const PortariaModel = require('../../models/post/PortariaModel');

exports.criarRegistro = async (req, res) => {
  try {
    const {
      status,
      data_hora_entrada,
      data_hora_saida,
      carro_id,
      motorista_id,
      fabrica_id,
      observacao
    } = req.body;

    const imagem_link = req.file ? req.file.filename : null;

    const novoRegistro = await PortariaModel.criarRegistro({
      status,
      data_hora_entrada,
      data_hora_saida,
      carro_id,
      motorista_id,
      fabrica_id,
      observacao,
      imagem_link
    });

    res.status(201).json(novoRegistro);
  } catch (error) {
    console.error('Erro ao criar registro da portaria:', error);
    res.status(500).json({ erro: 'Erro interno ao criar registro da portaria' });
  }
};
