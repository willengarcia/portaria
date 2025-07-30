import React, { useRef, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function formatarDataHora(dataISO) {
  if (!dataISO) return '-';
  const data = new Date(dataISO);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(data);
}


function Relatorio() {
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [fabricas, setFabricas] = useState([]);

  const dataInicioRef = useRef();
  const dataFimRef = useRef();
  const fabricaRef = useRef();

  useEffect(() => {
    async function carregarFabricas() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/allfabricas`);
        if (!res.ok) throw new Error('Erro ao carregar fábricas');
        const dados = await res.json();
        setFabricas(dados);
      } catch (error) {
        console.error('Erro ao carregar fábricas:', error);
      }
    }
    carregarFabricas();
  }, []);

  async function gerarRelatorio(event) {
    event.preventDefault();

    const dataInicio = dataInicioRef.current.value;
    const dataFim = dataFimRef.current.value;
    const fabricaId = fabricaRef.current.value;
    const dataInicioFormatada = `${dataInicio} 00:00:00`;
    const dataFimFormatada = `${dataFim} 23:59:59`;

    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicioFormatada);
    if (dataFim) params.append('dataFim', dataFimFormatada);
    if (fabricaId) params.append('fabricaId', fabricaId);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/relatorio?${params.toString()}`);
      const dados = await res.json();

      if (!Array.isArray(dados) || dados.length === 0) {
        setMensagem('Nenhum resultado encontrado.');
        setDadosRelatorio([]);
        return;
      }
      setMensagem('');
      setDadosRelatorio(dados);
    } catch (error) {
      setMensagem('Erro ao gerar relatório.');
      setDadosRelatorio([]);
      console.error('Erro ao gerar relatório:', error);
    }
  }

  function gerarExcel() {
    if (!Array.isArray(dadosRelatorio) || dadosRelatorio.length === 0) {
      alert('Gere o relatório primeiro.');
      return;
    }

    const dadosFormatados = dadosRelatorio.map(item => ({
      "Data Entrada": formatarDataHora(item.data_hora_entrada),
      "Data Saída": formatarDataHora(item.data_hora_saida),
      "Placa": item.placa_carro || '-',
      "Motorista": item.nome_motorista || '-',
      "Documento": item.tipo_documento && item.documento ? `${item.tipo_documento.toUpperCase()} - ${item.documento}` : '-',
      "Fábrica": item.nome_fabrica && item.estado ? `${item.nome_fabrica} (${item.estado})` : '-',
      "Movimento": item.status === 1 ? "Entrada" : "Saída",
      "Observação": item.observacao || '-',
      "Imagem": item.imagem_link ? `https://portaria.rodriguescolchoes.com.br:4096${item.imagem_link}` : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(dadosFormatados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, 'relatorio_portaria.xlsx');
  }

  return (
    <section id="relatorio">
      <h2>Relatório</h2>
      <form id="filtroRelatorio" onSubmit={gerarRelatorio}>
        <div>
          <label htmlFor="dataInicio">Data Início:</label>
          <input type="date" id="dataInicio" name="dataInicio" required ref={dataInicioRef} />
        </div>
        <div>
          <label htmlFor="dataFim">Data Fim:</label>
          <input type="date" id="dataFim" name="dataFim" required ref={dataFimRef} />
        </div>
        <div>
          <label htmlFor="fabrica">Fábrica:</label>
          <select id="fabricaRelatorio" name="fabrica" ref={fabricaRef} required>
            <option value="">Todas</option>
            {fabricas.map(f => (
              <option key={f.id} value={f.id}>{`${f.nome} (${f.estado})`}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-filtrar">Filtrar</button>
        <button type="button" onClick={gerarExcel} className="btn-filtrar">Exportar Excel</button>
      </form>

      <div id="resultadoRelatorio">
        {mensagem && <p>{mensagem}</p>}
        {dadosRelatorio.map((item, idx) => (
          <div className="card" key={idx}>
            <p><strong>Data Entrada:</strong> {formatarDataHora(item.data_hora_entrada)}</p>
            <p><strong>Data Saída:</strong> {formatarDataHora(item.data_hora_saida)}</p>
            <p><strong>Placa:</strong> {item.placa_carro || '-'}</p>
            <p><strong>Pessoa:</strong> {item.nome_motorista || '-'}</p>
            <p><strong>Documento:</strong> {item.tipo_documento && item.documento ? `${item.tipo_documento.toUpperCase()} - ${item.documento}` : '-'}</p>
            <p><strong>Fábrica:</strong> {item.nome_fabrica && item.estado ? `${item.nome_fabrica} (${item.estado})` : '-'}</p>
            <p><strong>Tipo:</strong> {item.tipo}</p>
            <p><strong>Observação:</strong> {item.observacao || '-'}</p>
            {item.imagem_link && (
              <a href={`https://portaria.rodriguescolchoes.com.br/api/uploads/${item.imagem_link}`} target="_blank" rel="noopener noreferrer">Imagem</a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Relatorio;
