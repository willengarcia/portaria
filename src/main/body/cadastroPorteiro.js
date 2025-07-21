async function cadastrarPorteiro(event) {
  event.preventDefault();
  const form = event.target;
  const dados = {
    nome: form.nome_porteiro.value,
    cpf: form.cpf_porteiro.value,
    senha: form.senha_porteiro.value,
  };
  const res = await fetch(`${process.env.REACT_APP_API_URL}/cadastro-porteiro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  const resposta = await res.json();
  alert(resposta.sucesso ? 'Cadastrado com sucesso!' : 'Erro no cadastro');
}
function CadastroPorteiro() {
  return (
    <>
      <section id="cadastroPorteiro">
        <h2>Cadastro de Porteiro</h2>
        <form onSubmit={cadastrarPorteiro}>
          <label>Nome:</label>
          <input type="text" name="nome_porteiro" required />
          <label>CPF:</label>
          <input type="number" name="cpf_porteiro" required />
          <label>Senha:</label>
          <input type="password" name="senha_porteiro" required />
          <button className="submit-btn" type="submit">Cadastrar</button>
        </form>
      </section>
    </>
  );
}

export default CadastroPorteiro;