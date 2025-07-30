const PedestreModel = require('../../models/post/PedestresModel');


async function putSaida(req, res) {
  const { id, data_saida } = req.body;
  if (!id || !data_saida) {
    return res.status(400).json({ erro: 'ID e data de saída são obrigatórios' });
  }

  try {
    const resultado = await PedestreModel.concluirSaida(id, data_saida);
    console.log('Resultado da saída:', resultado);
    if (!resultado) {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
    res.json({ mensagem: 'Saída concluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao concluir saída' });
  }
}


module.exports = {
  putSaida,
};