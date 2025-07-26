const db = require('../../config/db');

exports.criarRegistro = async ({
  status,
  data_hora_entrada,
  data_hora_saida,
  carro_id,
  motorista_id,
  fabrica_id,
  observacao,
  imagem_link
}) => {
  const query = `
    INSERT INTO portaria (
      status,
      data_hora_entrada,
      data_hora_saida,
      carro_id,
      motorista_id,
      fabrica_id,
      observacao,
      imagem_link
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const valores = [
    status,
    data_hora_entrada || null,
    data_hora_saida || null,
    carro_id,
    motorista_id,
    fabrica_id,
    observacao,
    imagem_link || null
  ];

  const resultado = await db.query(query, valores);
  return resultado.rows[0];
};
