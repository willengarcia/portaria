const db = require('../../config/db');

async function verificarVinculo(carro_id, motorista_id) {
  const res = await db.query(
    'SELECT * FROM carro_motorista WHERE carro_id = $1 AND motorista_id = $2',
    [carro_id, motorista_id]
  );
  return res.rows[0];
}

module.exports = {
  verificarVinculo
};