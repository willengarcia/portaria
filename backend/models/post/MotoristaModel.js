const db = require('../../config/db');

const MotoristaModel = {
  async criarMotorista(nome, tipo_documento, documento) {
    const query = `
      INSERT INTO Motorista (nome, tipo_documento, documento)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const valores = [nome, tipo_documento, documento];
    const resultado = await db.query(query, valores);
    return resultado.rows[0];
  }
};

module.exports = MotoristaModel;
