const db = require('../../config/db');

async function criarVinculo(carro_id, motorista_id) {
  await db.query(
    'INSERT INTO carro_motorista (carro_id, motorista_id, ativo) VALUES ($1, $2, true)',
    [carro_id, motorista_id]
  );
}

module.exports = {
  criarVinculo
};