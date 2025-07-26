const db = require('../../config/db');
const FabricaModel = {
  async criarFabrica(nome, estado) {
    const query = 'INSERT INTO Fabrica (nome, estado) VALUES ($1, $2) RETURNING *';
    const valores = [nome, estado];
    const resultado = await db.query(query, valores);
    return resultado.rows[0];
  }
};

module.exports = FabricaModel;
