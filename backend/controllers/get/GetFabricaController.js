const FabricaModel = require('../../models/get/GetFabricaModel');

exports.listarFabricas = async (req, res) => {
  try {
    const fabricas = await FabricaModel.buscarTodas();
    res.status(200).json(fabricas);
  } catch (error) {
    console.error('Erro ao buscar fábricas:', error);
    res.status(500).json({ erro: 'Erro ao buscar fábricas' });
  }
};
