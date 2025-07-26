const db = require('../../config/db');

exports.buscarEntradasFiltradas = async (data_inicial, data_final, fabrica_id, motorista_id, placa) => {
  let query = `
    SELECT
      p.id AS portaria_id,
      p.status,
      p.data_hora_entrada,
      p.data_hora_saida,
      p.observacao,
      p.imagem_link,
      c.placa,
      c.tipo AS tipo_carro,
      m.nome AS nome_motorista,
      m.tipo_documento,
      m.documento,
      f.nome AS nome_fabrica,
      f.estado
    FROM portaria p
    JOIN carro c ON p.carro_id = c.id
    JOIN motorista m ON p.motorista_id = m.id
    JOIN fabrica f ON p.fabrica_id = f.id
    WHERE p.data_hora_entrada BETWEEN $1 AND $2
      AND f.id = $3
  `;

  const valores = [data_inicial, data_final, fabrica_id];
  let index = 4;

  if (motorista_id) {
    query += ` AND m.id = $${index++}`;
    valores.push(motorista_id);
  }

  if (placa) {
    query += ` AND c.placa ILIKE $${index++}`;
    valores.push(`%${placa}%`);
  }

  query += ` ORDER BY p.data_hora_entrada DESC`;

  const resultado = await db.query(query, valores);
  return resultado.rows;
};

