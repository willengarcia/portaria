const db = require('../../config/db');

async function listarMotoristas(documento) {
  const res = await db.query('SELECT * FROM motorista WHERE documento = $1', [documento]);
  return res.rows[0];
}

module.exports = {
  listarMotoristas,
};
