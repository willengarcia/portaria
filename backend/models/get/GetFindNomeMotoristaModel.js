const db = require('../../config/db');

exports.buscarPorPlaca = async (placa) => {
  const query = `
    SELECT m.id AS motorista_id, m.nome, m.tipo_documento, m.documento, c.placa
    FROM carro c
    JOIN carro_motorista cm ON cm.carro_id = c.id
    JOIN motorista m ON m.id = cm.motorista_id
    WHERE LOWER(c.placa) LIKE LOWER($1)
    LIMIT 10;
  `;
  const { rows } = await db.query(query, [`%${placa}%`]);
  return rows;
};
