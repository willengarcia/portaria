const db = require('../../config/db');

exports.buscarTodas = async () => {
  const resultado = await db.query('SELECT * FROM fabrica');
  return resultado.rows;
};
