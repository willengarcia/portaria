import React, { useState } from 'react';

function Login({ onLogin }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  async function realizarLogin(event) {
    event.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: cpf.trim(), senha: senha.trim() })
    });
    const data = await res.json();
    if (data.sucesso) {
      if (onLogin) onLogin();
    } else {
      alert('Login inválido');
    }
  }

  return (
    <section id="login" className="active">
      <h2>Login</h2>
      <form onSubmit={realizarLogin}>
        <label>CPF:</label>
        <input
          type="text"
          name="cpf_login"
          id="cpf_login"
          required
          value={cpf}
          onChange={e => setCpf(e.target.value)}
        />
        <label>Senha:</label>
        <input
          type="password"
          name="senha_login"
          id="senha_login"
          required
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <button className="submit-btn" type="submit">Entrar</button>
      </form>
    </section>
  );
}

export default Login;