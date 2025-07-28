import React from 'react';

async function cadastrarFabrica(event) {
  event.preventDefault();
  const form = event.target;
  const dados = {
    nome: form.nomeFabrica.value.trim(),
    estado: form.estadoFabrica.value.trim().toUpperCase(),
  };

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/fabrica`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!res.ok) {
      const erro = await res.json();
      alert(erro?.erro || 'Erro ao cadastrar fábrica.');
      return;
    }

    const novaFabrica = await res.json();
    alert(`Fábrica "${novaFabrica.nome}" cadastrada com sucesso!`);
    form.reset();
  } catch (err) {
    console.error('Erro na requisição:', err);
    alert('Erro na conexão com o servidor.');
  }
}

function Fabrica() {
  return (
    <section id="fabrica">
      <h2>Cadastro de Fábrica</h2>
      <form onSubmit={cadastrarFabrica}>
        <label htmlFor="nomeFabrica">Nome da Fábrica:</label>
        <input type="text" name="nomeFabrica" id="nomeFabrica" required />

        <label htmlFor="estadoFabrica">Estado (UF):</label>
        <input type="text" name="estadoFabrica" id="estadoFabrica" maxLength="2" required />

        <button className="submit-btn" type="submit">Cadastrar</button>
      </form>
    </section>
  );
}

export default Fabrica;
