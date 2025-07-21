import React, { useEffect, useState } from 'react';

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

function validarRG(rg) {
  rg = rg.replace(/\D/g, '');
  return rg.length >= 7 && rg.length <= 9;
}

async function cadastrarPortaria(event) {
  event.preventDefault();
  const form = event.target;
  const tipoDocumento = form.tipoDocumento.value;
  const documento = form.documento.value;

  if (tipoDocumento === 'cpf' && !validarCPF(documento)) {
    alert('CPF inválido!');
    return;
  }
  if (tipoDocumento === 'rg' && !validarRG(documento)) {
    alert('RG inválido!');
    return;
  }

  const formData = new FormData(form);
  const res = await fetch(`${process.env.REACT_APP_API_URL}/portaria`, {
    method: 'POST',
    body: formData
  });
  const dados = await res.json();
  alert(dados.sucesso ? 'Registro salvo com sucesso!' : 'Erro ao salvar');
}

function Portaria() {
  const [fabricas, setFabricas] = useState([]);
  const [dataHora, setDataHora] = useState('');

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

    const agora = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const dataHoraFormatada =
      agora.getFullYear() + '-' +
      pad(agora.getMonth() + 1) + '-' +
      pad(agora.getDate()) + 'T' +
      pad(agora.getHours()) + ':' +
      pad(agora.getMinutes());
    setDataHora(dataHoraFormatada);
  }, []);

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
          <input type="text" name="placa" id="placa" required placeholder="AAA0A00 ou ABC1234" maxLength="8" />
          <label htmlFor="motorista">Motorista:</label>
          <input list="lista-motoristas" id="motorista" name="motorista" autoComplete="off" />
          <datalist id="lista-motoristas"></datalist>
          <label>Tipo de Documento:</label>
          <select id="tipoDocumento" name="tipoDocumento" required>
            <option value="cpf">CPF</option>
            <option value="rg">RG</option>
          </select>
          <label>Documento:</label>
          <input type="text" name="documento" id="documento" required />
          <label>Entrada ou Saída:</label>
          <select name="movimento" required>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <label>Fábrica:</label>
          <select name="fabrica" id="fabricaSelect" required>
            <option value="">Selecione</option>
            {fabricas.map(fabrica => (
              <option key={fabrica.id} value={fabrica.id}>
                {fabrica.nome} - {fabrica.estado}
              </option>
            ))}
          </select>
          <label>Imagem (opcional):</label>
          <input type="file" accept="image/*" name="imagem" />
          <label>Observação:</label>
          <textarea name="observacao" rows="3"></textarea>
          <button className="submit-btn" type="submit">Registrar</button>
        </form>
      </section>
    </>
  );
}

export default Portaria;