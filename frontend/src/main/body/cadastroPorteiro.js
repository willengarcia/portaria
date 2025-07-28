import React from 'react';

async function cadastrarUsuario(event) {
  event.preventDefault();
  const form = event.target;
  const dados = {
    nome: form.nome_usuario.value,
    email: form.email_usuario.value,
    senha: form.senha_usuario.value,
    tipo: 'comum'
  };

  const res = await fetch(`${process.env.REACT_APP_API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  const resposta = await res.json();
  form.reset();
  alert(resposta.mensagem || 'Erro no cadastro');
}

function CadastroUsuario() {
  return (
    <section id="cadastroUsuario">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={cadastrarUsuario}>
        <label>Nome:</label>
        <input type="text" name="nome_usuario" required />

        <label>Email:</label>
        <input type="email" name="email_usuario" required />

        <label>Senha:</label>
        <input type="password" name="senha_usuario" required />

        <button className="submit-btn" type="submit">Cadastrar</button>
      </form>
    </section>
  );
}

export default CadastroUsuario;
