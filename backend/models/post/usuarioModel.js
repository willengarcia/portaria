const db = require('../../config/db');

const UsuarioModel = {
  async criarUsuario(nome, email, senhaHash, tipo) {
    const query = `
      INSERT INTO Usuario (nome, email, senha_hash, tipo, ativo)
      VALUES ($1, $2, $3, $4, TRUE)
      RETURNING id, nome, email, tipo
    `;
    const values = [nome, email, senhaHash, tipo];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async buscarPorEmail(email) {
    const query = `
      SELECT id, nome, email, senha_hash, tipo
      FROM Usuario
      WHERE email = $1 AND ativo = TRUE
      LIMIT 1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0];
  }
};

module.exports = UsuarioModel;
