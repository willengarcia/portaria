const db = require('../../config/db');

async function listarPedestres() {
  const query = `
    SELECT
      p.id,
      p.data_hora_entrada,
      p.status,
      p.observacao,
      p.imagem_link,
      m.nome,
      m.documento,
      m.tipo_documento,
      f.nome AS nome_fabrica,
      f.estado,
      c.placa,
      c.tipo,
      CASE 
        WHEN p.carro_id IS NOT NULL THEN 'Motorizado'
        ELSE 'Pedestre'
      END AS tipo_entrada
    FROM portaria p
    JOIN motorista m ON p.motorista_id = m.id
    LEFT JOIN carro c ON p.carro_id = c.id
    LEFT JOIN fabrica f ON p.fabrica_id = f.id
    WHERE p.status = 0;

  `;
  const { rows } = await db.query(query);
  return rows;
}

module.exports = {
  listarPedestres
};