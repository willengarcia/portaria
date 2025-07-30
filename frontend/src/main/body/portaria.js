import React, { useEffect, useState } from 'react';
import axios from 'axios';

const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
};

const validarRG = (rg) => {
  rg = rg.replace(/\D/g, '');
  return rg.length >= 7 && rg.length <= 9;
};

const getDataHoraAtual = () => {
  const agora = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}T${pad(agora.getHours())}:${pad(agora.getMinutes())}`;
};

function Portaria() {
  const [selecionado, setSelecionado] = useState(false);
  const [fabricas, setFabricas] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);

  const [tipoEntrada, setTipoEntrada] = useState('Visitante - Pedestre');
  const [dataHora, setDataHora] = useState(getDataHoraAtual());
  const [fabricaId, setFabricaId] = useState('');
  const [nome, setNome] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('cpf');
  const [documento, setDocumento] = useState('');
  const [placa, setPlaca] = useState('');
  const [observacao, setObservacao] = useState('');
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    const carregarFabricas = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/allFabricas`);
        setFabricas(res.data);
      } catch (err) {
        console.error('Erro ao carregar fábricas:', err);
        alert('Erro ao carregar fábricas.');
      }
    };
    carregarFabricas();
  }, []);

  useEffect(() => {
    const buscarMotoristaPorPlaca = async () => {
      if (placa.length < 2) {
        setSugestoes([]);
        return;
      }
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/findNomeMotorista`, {
          params: { query: placa.toUpperCase() }
        });
        setSugestoes(res.data);
      } catch (error) {
        console.error("Erro na busca:", error);
        setSugestoes([]);
      }
    };

    buscarMotoristaPorPlaca();
  }, [placa]);

  const selecionarSugestao = (s) => {
    setNome(s.nome);
    setTipoDocumento(s.tipo_documento);
    setDocumento(s.documento);
    setPlaca(s.placa || '');
    setSugestoes([]);
  };

  const validarDocumento = () => {
    return tipoDocumento === 'cpf' ? validarCPF(documento) : validarRG(documento);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !documento || !fabricaId) {
      return alert('Preencha todos os campos obrigatórios.');
    }

    if (!validarDocumento()) {
      return alert('Documento inválido.');
    }

    const dados = {
      nome,
      tipo_documento: tipoDocumento,
      documento,
      tipo_entrada: tipoEntrada,
      data_hora_entrada: dataHora,
      fabrica_id: fabricaId,
      observacao,
      placa: tipoEntrada.includes('Motorizado') ? placa : null
    };

    const formData = new FormData();
    for (const key in dados) {
      if (dados[key]) formData.append(key, dados[key]);
    }
    if (imagem) formData.append('imagem', imagem);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/portaria`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Entrada registrada com sucesso!');
      resetarFormulario();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Erro ao registrar entrada.');
    }
  };

  const resetarFormulario = () => {
    setNome('');
    setDocumento('');
    setTipoDocumento('cpf');
    setTipoEntrada('Visitante - Pedestre');
    setPlaca('');
    setFabricaId('');
    setObservacao('');
    setImagem(null);
    setDataHora(getDataHoraAtual());
    
  };

  const handlePlacaChange = (valor) => {
  setPlaca(valor.toUpperCase());
  setSelecionado(false);
};


  return (
    <section id="portaria">
      <h2>Registrar Entrada</h2>
      <form onSubmit={handleSubmit}>
        <label>Data e Hora:</label>
        <input type="datetime-local" value={dataHora} readOnly required />

        <label>Tipo de Entrada:</label>
        <select value={tipoEntrada} onChange={(e) => setTipoEntrada(e.target.value)} required>
          <option>Visitante - Pedestre</option>
          <option>Funcionário - Pedestre</option>
          <option>Visitante - Motorizado</option>
          <option>Funcionário - Motorizado</option>
        </select>

        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoComplete="off"
          required
        />

        <label>Tipo de Documento:</label>
        <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} required>
          <option value="cpf">CPF</option>
          <option value="rg">RG</option>
        </select>

        <label>Número do Documento:</label>
        <input type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} required />

        {tipoEntrada.includes('Motorizado') && (
          <>
            <label>Placa do Veículo:</label>
            <input
              type="text"
              value={placa}
              onChange={(e) => handlePlacaChange(e.target.value)}
              autoComplete="off"
              required={tipoEntrada.includes('Motorizado')}
            />
            {sugestoes.length > 0 && (
              <ul className="autocomplete">
                {sugestoes.map((s) => (
                  <li key={s.motorista_id} onClick={() => selecionarSugestao(s)}>
                    {s.nome} – {s.documento} {s.placa && `– Placa: ${s.placa}`}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <label>Fábrica:</label>
        <select value={fabricaId} onChange={(e) => setFabricaId(e.target.value)} required>
          <option value="">Selecione a fábrica</option>
          {fabricas.map((f) => (
            <option key={f.id} value={f.id}>{f.nome} - {f.estado}</option>
          ))}
        </select>

        <label>Observação:</label>
        <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows="3" />

        <label>Foto da Entrada (opcional):</label>
        <input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} />

        <button type="submit" className="submit-btn">Registrar Entrada</button>
      </form>
    </section>
  );
}

export default Portaria;
