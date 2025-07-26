import React from 'react';

async function cadastrarFabrica(event) {
  event.preventDefault();
  const form = event.target;
  const dados = {
    nome: form.nomeFabrica.value,
    estado: form.estadoFabrica.value,
  };
  const res = await fetch(`${process.env.VITE_API_URL}/fabrica`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  const resposta = await res.json();
  alert(resposta.sucesso ? 'Fábrica cadastrada!' : 'Erro no cadastro');
}

function Fabrica() {
  return (
    <>
      <section id="fabrica">
        <h2>Cadastro de Fábrica</h2>
        <form onSubmit={cadastrarFabrica}>
          <label>Nome da Fábrica:</label>
          <input type="text" name="nomeFabrica" required />
          <label>Estado (UF):</label>
          <input type="text" name="estadoFabrica" required maxLength="2" />
          <button className="submit-btn" type="submit">Cadastrar</button>
        </form>
      </section>
    </>
  );
}

export default Fabrica;