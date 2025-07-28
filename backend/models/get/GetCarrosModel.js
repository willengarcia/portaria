const db = require('../../config/db');

async function listarCarros() {
  const query = 'SELECT * FROM Carro ORDER BY id';
  const result = await db.query(query);
  return result.rows;
}

module.exports = {
  listarCarros,
};
