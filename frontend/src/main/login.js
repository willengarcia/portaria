import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function realizarLogin(event) {
    event.preventDefault();
    setErro('');
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), senha: senha.trim() })
      });

      if (!res.ok) {
        setErro('Erro na comunicação com o servidor');
        return;
      }

      const data = await res.json();

      if (data.mensagem === 'Login realizado com sucesso.') {
        localStorage.setItem('token', data.token);
        if (onLogin) onLogin(data.usuario);
      } else {
        setErro('Email ou senha inválidos');
      }
    } catch (error) {
      setErro('Erro ao conectar com o servidor');
    }
  }

  return (
    <section id="login" className="active">
      <h2>Login</h2>
      <form onSubmit={realizarLogin}>
        <label htmlFor="email_login">Email:</label>
        <input
          type="email"
          name="email_login"
          id="email_login"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="senha_login">Senha:</label>
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
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </section>
  );
}

export default Login;
