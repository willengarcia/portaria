import React, { useEffect, useState } from 'react';

function Status() {
  const [registros, setRegistros] = useState([]);
  const [mensagem, setMensagem] = useState('');
  useEffect(() => {
    async function carregarRegistros() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/relatorio/entrada/status`);
        const dados = await res.json();
        setRegistros(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setMensagem('Erro ao carregar registros.');
      }
    }
    carregarRegistros();
  }, []);

  async function alterarStatus(id) {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/relatorio/entrada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.mensagem) {
        setMensagem(data.mensagem);
        setRegistros(registros.filter(reg => reg.id !== id));
      } else {
        setMensagem(data.erro || 'Erro ao alterar status.');
      }
    } catch (error) {
      setMensagem('Erro ao alterar status.');
    }
  }

  return (
    <section id="status">
      <h2>Status de Entrada</h2>
      {mensagem && <p>{mensagem}</p>}
      <div>
        {registros.map(registro => (
          <div key={registro.id} className="card">
            <p><strong>ID:</strong> {registro.id}</p>
            <p><strong>Motorista:</strong> {registro.nome_motorista}</p>
            <p><strong>Status Entrada:</strong> {registro.status_entrada ? 'true' : 'false'}</p>
            <button
              onClick={() => alterarStatus(registro.id)}
              disabled={registro.status_entrada === false}
            >
              Alterar Status
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Status;