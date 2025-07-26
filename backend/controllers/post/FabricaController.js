const FabricaModel = require('../../models/post/FabricaModels');

const listarFabricas = {
  async criar(req, res) {
    const { nome, estado } = req.body;

    if (!nome || !estado) {
      return res.status(400).json({ erro: 'Nome e estado são obrigatórios.' });
    }

    try {
      const novaFabrica = await FabricaModel.criarFabrica(nome, estado);
      res.status(201).json(novaFabrica);
    } catch (erro) {
      console.error('Erro ao criar fábrica:', erro);
      res.status(500).json({ erro: 'Erro ao criar fábrica.' });
    }
  }
};

module.exports = listarFabricas;
