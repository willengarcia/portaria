const CarroModel = require('../../models/post/CarroModel');

const CarroController = {
  async criar(req, res) {
    const { placa, tipo } = req.body;

    if (!placa || !tipo) {
      return res.status(400).json({ erro: 'Placa e tipo são obrigatórios.' });
    }

    const tiposValidos = ['particular', 'corporativo'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ erro: 'Tipo deve ser "particular" ou "corporativo".' });
    }

    try {
      const novoCarro = await CarroModel.criarCarro(placa, tipo);
      res.status(201).json(novoCarro);
    } catch (erro) {
      console.error('Erro ao criar carro:', erro);
      if (erro.code === '23505') {
        return res.status(409).json({ erro: 'Placa já cadastrada.' });
      }
      res.status(500).json({ erro: 'Erro ao criar carro.' });
    }
  }
};

module.exports = CarroController;
