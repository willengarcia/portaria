const db = require('../../config/db');

const CarroModel = {
  async criarCarro(placa, tipo) {
    const query = `
      INSERT INTO Carro (placa, tipo)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const valores = [placa, tipo];
    const resultado = await db.query(query, valores);
    return resultado.rows[0];
  }
};

module.exports = CarroModel;
