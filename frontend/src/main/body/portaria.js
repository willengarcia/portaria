import React, { useEffect, useState } from 'react';
import axios from 'axios';


function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  return true;
}

function validarRG(rg) {
  rg = rg.replace(/\D/g, '');
  return rg.length >= 7 && rg.length <= 9;
}

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

function Portaria() {
  const [pessoas, setPessoas] = useState([]);
  const [placaDigitada, setPlacaDigitada] = useState('');
  const [carroManualId, setCarroManualId] = useState('');


  const [fabricas, setFabricas] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [carros, setCarros] = useState([]);

  const [tipoEntrada, setTipoEntrada] = useState('pessoa');
  const [dataHora, setDataHora] = useState(getDataHoraAtual());
  const [fabricaId, setFabricaId] = useState('');
  const [observacao, setObservacao] = useState('');


  const [motoristaId, setMotoristaId] = useState('');
  const [carroId, setCarroId] = useState('');

  const [nomePessoa, setNomePessoa] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('cpf');
  const [documento, setDocumento] = useState('');

  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const [resFabricas, resMotoristas, resCarros] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/allFabricas`),
          axios.get(`${process.env.REACT_APP_API_URL}/motoristas`),
          axios.get(`${process.env.REACT_APP_API_URL}/carros`),
        ]);

        setFabricas(resFabricas.data);
        setMotoristas(resMotoristas.data);
        setCarros(resCarros.data);
        setPessoas(resMotoristas.data);

      } catch (error) {
        console.error('❌ Erro ao carregar dados iniciais:', error);

        if (error.response) {
          console.error('🟥 Status:', error.response.status);
          console.error('🟥 Dados do erro:', error.response.data);
        } else if (error.request) {
          console.error('🟧 Nenhuma resposta recebida:', error.request);
        } else {
          console.error('🟨 Erro na configuração da requisição:', error.message);
        }

        alert('Não foi possível carregar os dados do servidor. Veja o console.');
      }
    }

    carregarDadosIniciais();
  }, []);
  const resetarFormulario = () => {
    setDataHora(getDataHoraAtual());
    setFabricaId('');
    setObservacao('');
    setMotoristaId('');
    setCarroId('');
    setNomePessoa('');
    setDocumento('');
    setTipoDocumento('cpf');
  };

  async function registrarEntrada(event) {
    event.preventDefault();

    const payload = {
      status: 0,
      data_hora_entrada: dataHora,
      data_hora_saida: null,
      fabrica_id: fabricaId,
      motorista_id: null,
      carro_id: null,
      observacao: observacao,
    };

    if (tipoEntrada === 'motorista') {
      if (!motoristaId) {
        alert('É necessário selecionar o motorista.');
        return;
      }

      payload.motorista_id = motoristaId;

      // Aqui faz sentido priorizar o carro da placa digitada
      if (carroManualId) {
        payload.carro_id = carroManualId;
      } else if (carroId) {
        payload.carro_id = carroId;
      } else {
        alert('Para motorista, é necessário preencher o carro.');
        return;
      }
    } else {
      if (!nomePessoa || !documento) {
        alert('Para pessoa, é necessário preencher o nome e o documento.');
        return;
      }
      if (tipoDocumento === 'cpf' && !validarCPF(documento)) {
        alert('CPF inválido!');
        return;
      }
      if (tipoDocumento === 'rg' && !validarRG(documento)) {
        alert('RG inválido!');
        return;
      }

      const pessoaEncontrada = pessoas.find(p => p.nome.toLowerCase() === nomePessoa.toLowerCase());
      if (pessoaEncontrada) {
        payload.motorista_id = pessoaEncontrada.id;
      }

      payload.observacao = `Pessoa: ${nomePessoa} | Documento (${tipoDocumento.toUpperCase()}): ${documento}. ${observacao}`;
    }

    try {
      const formData = new FormData();
      for (const key in payload) {
        if (payload[key] !== null && payload[key] !== '') {
          formData.append(key, payload[key]);
        }
      }

      if (imagem) {
        formData.append('imagem', imagem);
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/portaria`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Registro de entrada salvo com sucesso!');
      resetarFormulario();
      setImagem(null);
    } catch (error) {
      console.error('Erro ao registrar entrada:', error);
      alert(error?.response?.data?.message || 'Erro ao registrar entrada.');
    }
  }
  return (
    <section id="portaria">
      <h2>Registrar Entrada na Portaria</h2>
      <form id="formPortaria" onSubmit={registrarEntrada}>
        <label>Data e Hora da Entrada:</label>
        <input
          type="datetime-local"
          value={dataHora}
          readOnly
          required
        />

        <label>Tipo de Entrada:</label>
        <div className="radio-group">
            <label>
                <input 
                    type="radio" 
                    name="tipoEntrada" 
                    value="pessoa" 
                    checked={tipoEntrada === 'pessoa'}
                    onChange={(e) => setTipoEntrada(e.target.value)}
                /> Pessoa / Visitante
            </label>
            <label>
                <input 
                    type="radio" 
                    name="tipoEntrada" 
                    value="motorista" 
                    checked={tipoEntrada === 'motorista'}
                    onChange={(e) => setTipoEntrada(e.target.value)}
                /> Motorista
            </label>
        </div>
        {tipoEntrada === 'motorista' && (
          <>
            <label htmlFor="motoristaId">Motorista:</label>
            <select
              id="motoristaId"
              value={motoristaId}
              onChange={(e) => setMotoristaId(e.target.value)}
              required
            >
              <option value="">Selecione um motorista</option>
              {motoristas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} - {m.cnh}
                </option>
              ))}
            </select>

            <label htmlFor="carroId">Carro:</label>
            <label htmlFor="placaCarro">Placa do Carro (opcional):</label>
            <input
              type="text"
              id="placaCarro"
              value={placaDigitada}
              onChange={(e) => {
                const placa = e.target.value.toUpperCase();
                setPlacaDigitada(placa);
                const carroEncontrado = carros.find(c => c.placa.toUpperCase() === placa);
                if (carroEncontrado) {
                  setCarroManualId(carroEncontrado.id);
                } else {
                  setCarroManualId('');
                }
              }}
              list="listaPlacas"
              placeholder="Digite a placa do carro"
            />
            <datalist id="listaPlacas">
              {carros.map(c => (
                <option key={c.id} value={c.placa} />
              ))}
            </datalist>

          </>
        )}
        {tipoEntrada === 'pessoa' && (
          <>
            <label htmlFor="nomePessoa">Nome da Pessoa:</label>
            <label htmlFor="nomePessoa">Nome da Pessoa:</label>
            <input
              type="text"
              id="nomePessoa"
              value={nomePessoa}
              onChange={(e) => {
                const nomeDigitado = e.target.value;
                setNomePessoa(nomeDigitado);
                const pessoaEncontrada = pessoas.find(p => p.nome.toLowerCase() === nomeDigitado.toLowerCase());
                if (pessoaEncontrada) {
                  setMotoristaId(pessoaEncontrada.id);
                } else {
                  setMotoristaId('');
                }
              }}
              list="listaNomes"
              placeholder="Digite o nome completo"
              required
            />
            <datalist id="listaNomes">
              {pessoas.map(p => (
                <option key={p.id} value={p.nome} />
              ))}
            </datalist>
            <label>Tipo de Documento:</label>
            <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                required
            >
                <option value="cpf">CPF</option>
                <option value="rg">RG</option>
            </select>
            <label>Número do Documento:</label>
            <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Digite o número do documento"
                required
            />
          </>
        )}
        <label htmlFor="fabricaId">Fábrica de Destino:</label>
        <select
          id="fabricaId"
          value={fabricaId}
          onChange={(e) => setFabricaId(e.target.value)}
          required
        >
          <option value="">Selecione a fábrica</option>
          {fabricas.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome} - {f.estado}
            </option>
          ))}
        </select>

        <label htmlFor="imagem">Foto da Entrada (opcional):</label>
        <input
          type="file"
          id="imagem"
          accept="image/*"
          capture="environment"
          onChange={(e) => setImagem(e.target.files[0])}
        />
        <label htmlFor="observacao">Observação:</label>
        <textarea
          id="observacao"
          rows="3"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="(Opcional) Adicione uma observação relevante."
        ></textarea>

        <button className="submit-btn" type="submit">
          Registrar Entrada
        </button>
      </form>
    </section>
  );
}

export default Portaria;