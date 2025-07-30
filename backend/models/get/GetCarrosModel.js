const db = require('../../config/db');

async function listarCarros(placa) {
  if (!placa) return null; // evita erro se placa for undefined

  const res = await db.query('SELECT * FROM carro WHERE placa = $1', [placa.toUpperCase()]);
  return res.rows[0];
}

module.exports = {
  listarCarros,
};
