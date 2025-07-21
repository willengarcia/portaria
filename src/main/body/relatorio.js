import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

function Relatorio() {
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const dataInicioRef = useRef();
  const dataFimRef = useRef();
  const motoristaRef = useRef();
  const placaRef = useRef();
  const fabricaRef = useRef();

  async function gerarRelatorio(event) {
    event.preventDefault();

    const dataInicio = dataInicioRef.current.value;
    const dataFim = dataFimRef.current.value;
    const motorista = motoristaRef.current.value.trim();
    const placa = placaRef.current.value.trim();
    const fabrica = fabricaRef.current.value;

    const params = new URLSearchParams({
      dataInicio,
      dataFim,
      motorista,
      placa,
      fabrica
    });

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
      "Data": new Date(item.data_hora).toLocaleString(),
      "Placa": item.placa_carro,
      "Motorista": item.nome_motorista,
      "Documento": `${item.tipo_documento.toUpperCase()} - ${item.documento}`,
      "Fábrica": `${item.nome_fabrica} (${item.estado})`,
      "Movimento": item.movimento,
      "Observação": item.observacao || '',
      "Imagem": `https://portaria.rodriguescolchoes.com.br:4096${item.imagem_link || ''}`
    }));

    const ws = XLSX.utils.json_to_sheet(dadosFormatados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, 'relatorio_portaria.xlsx');
  }

  return (
    <>
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
            <label htmlFor="motorista">Motorista:</label>
            <input type="text" id="motorista" name="motorista" ref={motoristaRef} />
          </div>
          <div>
            <label htmlFor="placa">Carro (placa):</label>
            <input type="text" id="placa" name="placa" ref={placaRef} />
          </div>
          <div>
            <label htmlFor="fabrica">Fábrica:</label>
            <select id="fabricaRelatorio" name="fabrica" ref={fabricaRef}>
              <option value="">Todas</option>
            </select>
          </div>
          <button type="submit" className="btn-filtrar">Filtrar</button>
          <button type="button" onClick={gerarExcel} className="btn-filtrar">Exportar Excel</button>
        </form>

        <div id="resultadoRelatorio">
          {mensagem && <p>{mensagem}</p>}
          {dadosRelatorio.map((item, idx) => (
            <div className="card" key={idx}>
              <p><strong>Data:</strong> {new Date(item.data_hora).toLocaleString()}</p>
              <p><strong>Placa:</strong> {item.placa_carro}</p>
              <p><strong>Motorista:</strong> {item.nome_motorista}</p>
              <p><strong>Documento:</strong> {item.tipo_documento.toUpperCase()} - {item.documento}</p>
              <p><strong>Fábrica:</strong> {item.nome_fabrica} ({item.estado})</p>
              <p><strong>Movimento:</strong> {item.movimento}</p>
              <p><strong>Observação:</strong> {item.observacao || '-'}</p>
              {item.imagem_link && (
                <a href={`https://portaria.rodriguescolchoes.com.br:4096${item.imagem_link}`} target="_blank" rel="noopener noreferrer">Imagem</a>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Relatorio;