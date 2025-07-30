const db = require('../../config/db');

exports.gerarRelatorio = async (dataInicio, dataFim, fabricaId) => {
  const query = `
  SELECT
    p.id,
    p.data_hora_entrada,
    p.data_hora_saida,
    p.observacao,
    p.imagem_link,
    c.placa AS placa_carro,
    c.tipo,
    m.nome AS nome_motorista,
    m.tipo_documento,
    m.documento,
    f.nome AS nome_fabrica,
    f.estado,
    p.status,
    CASE 
      WHEN p.carro_id IS NOT NULL THEN 'corporativo'
      ELSE 'visitante'
    END AS tipo_entrada
  FROM portaria p
  LEFT JOIN carro c ON p.carro_id = c.id
  LEFT JOIN motorista m ON p.motorista_id = m.id
  LEFT JOIN fabrica f ON p.fabrica_id = f.id
  WHERE p.data_hora_entrada BETWEEN $1 AND $2
    AND f.id = $3
  ORDER BY p.data_hora_entrada DESC;
  `;

  const valores = [dataInicio, dataFim, parseInt(fabricaId)];

  const resultado = await db.query(query, valores);
  return resultado.rows;
};
