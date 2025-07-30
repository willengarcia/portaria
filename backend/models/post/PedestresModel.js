const db = require('../../config/db');

async function concluirSaida(id, data_saida) {
  const query = `
    UPDATE portaria
    SET 
      status = 1,
      data_hora_saida = $2
    WHERE id = $1
    RETURNING id
  `;
  const { rows } = await db.query(query, [id, data_saida]);
  return rows[0];
}

module.exports = {
  concluirSaida,
};
