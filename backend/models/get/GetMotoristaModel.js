const db = require('../../config/db');

async function listarMotoristas() {
  const query = 'SELECT * FROM Motorista ORDER BY id';
  const result = await db.query(query);
  return result.rows;
}

module.exports = {
  listarMotoristas,
};
