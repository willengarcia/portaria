const db = require('../../config/db');

exports.buscarEntradas = async () => {
  const query = `
    SELECT
      p.id AS portaria_id,
      p.data_hora_entrada,
      p.observacao,
      p.imagem_link,
      p.status,
      c.id AS carro_id,
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
    WHERE p.status = 1
    ORDER BY p.data_hora_entrada DESC
  `;

  const resultado = await db.query(query);
  return resultado.rows;
};
