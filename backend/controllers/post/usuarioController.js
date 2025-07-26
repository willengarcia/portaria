const bcrypt = require('bcrypt');
const UsuarioModel = require('../../models/post/usuarioModel');

const UsuarioController = {
  async criar(req, res) {
    const { nome, email, senha, tipo } = req.body;

    if (!email || !senha || !nome) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, email, senha.' });
    }

    try {
      const senhaHash = await bcrypt.hash(senha, 10);
      const novoUsuario = await UsuarioModel.criarUsuario(
        nome,
        email,
        senhaHash,
        tipo || 'comum'
      );

      res.status(201).json({
        mensagem: 'Usuário criado com sucesso.',
        usuario: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          tipo: novoUsuario.tipo
        }
      });
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      res.status(500).json({ erro: 'Erro interno ao criar usuário.' });
    }
  }
};

module.exports = UsuarioController;
