import React, { useEffect, useState } from 'react';

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
  const pad = n => n.toString().padStart(2, '0');
  return (
    agora.getFullYear() + '-' +
    pad(agora.getMonth() + 1) + '-' +
    pad(agora.getDate()) + 'T' +
    pad(agora.getHours()) + ':' +
    pad(agora.getMinutes())
  );
}

function Portaria() {
  const [fabricas, setFabricas] = useState([]);
  const [dataHora, setDataHora] = useState(getDataHoraAtual());
  const [placa, setPlaca] = useState('');
  const [motorista, setMotorista] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('cpf');
  const [documento, setDocumento] = useState('');
  const [movimento, setMovimento] = useState('entrada');
  const [fabrica, setFabrica] = useState('');
  const [imagem, setImagem] = useState(null);
  const [observacao, setObservacao] = useState('');

  const [motoristas, setMotoristas] = useState([]);

  useEffect(() => {
    async function getFabrica() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fabrica`);
        const fabricas = await res.json();
        setFabricas(fabricas);
      } catch (error) {
        console.error('Erro ao carregar fábricas:', error);
      }
    }
    getFabrica();
  }, []);

  async function cadastrarPortaria(event) {
    event.preventDefault();

    if (tipoDocumento === 'cpf' && !validarCPF(documento)) {
      alert('CPF inválido!');
      return;
    }
    if (tipoDocumento === 'rg' && !validarRG(documento)) {
      alert('RG inválido!');
      return;
    }

    const formData = new FormData();
    formData.append('dataHora', dataHora);
    formData.append('placa', placa);
    formData.append('motorista', motorista);
    formData.append('tipoDocumento', tipoDocumento);
    formData.append('documento', documento);
    formData.append('movimento', movimento);
    formData.append('fabrica', fabrica);
    if (imagem) formData.append('imagem', imagem);
    formData.append('observacao', observacao);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/portaria`, {
      method: 'POST',
      body: formData
    });
    const dados = await res.json();
    alert(dados.sucesso ? 'Registro salvo com sucesso!' : 'Erro ao salvar');
    setDataHora(getDataHoraAtual());
    setPlaca('');
    setMotorista('');
    setTipoDocumento('cpf');
    setDocumento('');
    setMovimento('entrada');
    setFabrica('');
    setImagem(null);
    setObservacao('');
  }

  function preencherDocumento() {
    const motoristaSelecionado = motoristas.find(m => m.nome === motorista);
    if (motoristaSelecionado) {
      setDocumento(motoristaSelecionado.documento);
      setTipoDocumento(motoristaSelecionado.tipo_documento || 'cpf');
    }
  }
  useEffect(() => {
    async function buscarMotoristas() {
      if (motorista.length < 2) {
        setMotoristas([]);
        return;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/motoristas?busca=${motorista}`);
        const lista = await res.json();
        setMotoristas(Array.isArray(lista) ? lista : []);
      } catch (error) {
        setMotoristas([]);
      }
    }
    buscarMotoristas();
  }, [motorista]);
  return (
    <>
      <section id="portaria">
        <h2>Cadastro de Portaria</h2>
        <form id="formPortaria" onSubmit={cadastrarPortaria}>
          <label>Data e Hora:</label>
          <input
            type="datetime-local"
            id="dataHora"
            name="dataHora"
            required
            readOnly
            value={dataHora}
          />
          <label>Placa do Carro:</label>
          <input
            type="text"
            name="placa"
            id="placa"
            required
            placeholder="AAA0A00 ou ABC1234"
            maxLength="8"
            value={placa}
            onChange={e => setPlaca(e.target.value)}
          />
          <label htmlFor="motorista">Motorista:</label>
          <input
            list="lista-motoristas"
            id="motorista"
            name="motorista"
            autoComplete="off"
            value={motorista}
            onChange={e => setMotorista(e.target.value)}
            onBlur={preencherDocumento}          />
          <datalist id="lista-motoristas">
            {motoristas.map(m => (
              <option key={m.id} value={m.nome}>
                {m.nome} - {m.documento}
              </option>
            ))}
          </datalist>
          <label>Tipo de Documento:</label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            required
            value={tipoDocumento}
            onChange={e => setTipoDocumento(e.target.value)}
          >
            <option value="cpf">CPF</option>
            <option value="rg">RG</option>
          </select>
          <label>Documento:</label>
          <input
            type="text"
            name="documento"
            id="documento"
            required
            value={documento}
            onChange={e => setDocumento(e.target.value)}
          />
          <label>Entrada ou Saída:</label>
          <select
            name="movimento"
            required
            value={movimento}
            onChange={e => setMovimento(e.target.value)}
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <label>Fábrica:</label>
          <select
            name="fabrica"
            id="fabricaSelect"
            required
            value={fabrica}
            onChange={e => setFabrica(e.target.value)}
          >
            <option value="">Selecione</option>
            {fabricas.map(fabrica => (
              <option key={fabrica.id} value={fabrica.id}>
                {fabrica.nome} - {fabrica.estado}
              </option>
            ))}
          </select>
          <label>Imagem (opcional):</label>
          <input
            type="file"
            accept="image/*"
            name="imagem"
            onChange={e => setImagem(e.target.files[0])}
          />
          <label>Observação:</label>
          <textarea
            name="observacao"
            rows="3"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
          ></textarea>
          <button className="submit-btn" type="submit">Registrar</button>
        </form>
      </section>
    </>
  );
}

export default Portaria;