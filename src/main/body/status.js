import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

function Status() {
  const [registros, setRegistros] = useState([]);
  const [fabricas, setFabricas] = useState([]);
  const [fabricaSelecionada, setFabricaSelecionada] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarRegistros() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/relatorio/entrada/status/`);
        const dados = await res.json();
        setRegistros(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setMensagem('Erro ao carregar registros.');
      }
    }
    async function carregarFabricas() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fabrica`);
        const dados = await res.json();
        setFabricas(Array.isArray(dados) ? dados : []);
      } catch (error) {
      }
    }
    carregarRegistros();
    carregarFabricas();
  }, []);

  async function alterarStatus(id) {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/relatorio/entrada/status`, {
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

  const registrosFiltrados = fabricaSelecionada
    ? registros.filter(reg => reg.fabrica_id === parseInt(fabricaSelecionada))
    : registros;

  return (
    <section id="status">
      <h2>Status de Entrada</h2>
      <div>
        <label htmlFor="fabricaFiltro"><strong>Filtrar por Fábrica:</strong></label>
        <select
          id="fabricaFiltro"
          value={fabricaSelecionada}
          onChange={e => setFabricaSelecionada(e.target.value)}
        >
          <option value="">Todas</option>
          {fabricas.map(fabrica => (
            <option key={fabrica.id} value={fabrica.id}>
              {fabrica.nome} - {fabrica.estado}
            </option>
          ))}
        </select>
      </div>
      {mensagem && <p>{mensagem}</p>}
      <div>
        {registrosFiltrados.map(registro => (
          <div key={registro.id} className="card">
            <p><strong>Motorista:</strong> {registro.nome_motorista}</p>
            <p><strong>CPF/RG:</strong> {registro.documento}</p>
            <p><strong>Entrada:</strong> {dayjs(registro.data_hora).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Fábrica:</strong> {registro.nome_fabrica} ({registro.estado})</p>
            <p><strong>Placa:</strong> {registro.placa_carro}</p>
            <button className='submit-btn'
              onClick={() => alterarStatus(registro.id)}
              disabled={registro.status_entrada === false}
            >
              Efetuar Saída
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Status;