import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

  function getDataHoraAtual() {
    const agora = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return (
      agora.getFullYear() + '-' +
      pad(agora.getMonth() + 1) + '-' +
      pad(agora.getDate()) + 'T' +
      pad(agora.getHours()) + ':' +
      pad(agora.getMinutes())
    );
  }

function Pedestres() {
  const [dataHora, setDataHora] = useState(getDataHoraAtual());
  const [pedestres, setPedestres] = useState([]);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [fabricaSelecionada, setFabricaSelecionada] = useState('');
  const fabricasUnicas = [...new Set(pedestres.map(p => p.nome_fabrica))].sort();

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/pedestres`);
        const dados = await res.json();
        setPedestres(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.log(error);
        setMensagem('Erro ao carregar os pedestres.');
      }
    }

    carregar();
  }, []);

  async function concluirSaida(id) {
    const data_saida = getDataHoraAtual()

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/pedestres/saida`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data_saida }),
      });

      const data = await res.json();
      if (data.mensagem) {
        setPedestres(p => p.filter(ped => ped.id !== id));
        setMensagem(data.mensagem);
      } else {
        setMensagem(data.erro || 'Erro ao concluir saída.');
      }
    } catch (err) {
      setMensagem('Erro ao concluir saída.');
    }
  }

  const filtrados = pedestres.filter(
    p =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (fabricaSelecionada === '' || p.nome_fabrica === fabricaSelecionada)
  );

  return (
    <section>
      <select value={fabricaSelecionada} onChange={e => setFabricaSelecionada(e.target.value)}>
        <option value="">Todas as fábricas</option>
        {fabricasUnicas.map(f => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Buscar por nome..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />
      {mensagem && <p>{mensagem}</p>}
      <div>
        {filtrados.map(ped => (
          <div key={ped.id} className="card">
            <p>
              <strong>Nome:</strong> {ped.nome}
            </p>
            <p>
              <strong>Documento:</strong> {ped.documento}
            </p>
            <p><strong>Entrada:</strong> {dayjs(ped.data_hora_entrada).utc().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm')}</p>
            <p>
              <strong>Tipo de Entrada:</strong> {ped.tipo}
            </p>
            <p>
              <strong>Placa:</strong> {ped.placa}
            </p>
            {ped.imagem_link ? (
              <a href={'api/uploads/'+ped.imagem_link} target="_blank" rel="noopener noreferrer">
                Imagem
              </a>
            ) : (
              <p>Sem imagem</p>
            )}
            <button className="submit-btn" onClick={() => concluirSaida(ped.id)}>
              Concluir Saída
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pedestres;
