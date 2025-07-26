const MotoristaModel = require('../../models/post/MotoristaModel');

const MotoristaController = {
  async criar(req, res) {
    const { nome, tipo_documento, documento } = req.body;

    if (!nome || !tipo_documento || !documento) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    try {
      const novoMotorista = await MotoristaModel.criarMotorista(nome, tipo_documento, documento);
      res.status(201).json(novoMotorista);
    } catch (erro) {
      console.error('Erro ao criar motorista:', erro);
      if (erro.code === '23505') {
        return res.status(409).json({ erro: 'Documento já cadastrado.' });
      }
      res.status(500).json({ erro: 'Erro ao criar motorista.' });
    }
  }
};

module.exports = MotoristaController;
