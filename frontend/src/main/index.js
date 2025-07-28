import React, { useState } from 'react';
import '../App.css';
import CadastroPorteiro from './body/cadastroPorteiro';
import EntradaSaida from './body/entradaSaida';
import Fabrica from './body/fabrica';
import Portaria from './body/portaria';
import Relatorio from './body/relatorio';
function Index({ usuario }) {
  const [tela, setTela] = useState('portaria');

  function sair() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  const tipo = usuario?.tipo;

  return (
    <div className="index">
      <nav id="menuNav">
        <button onClick={() => setTela('portaria')}>Cadastro Portaria</button>

        {(tipo === 'administrador' || tipo !== 'comum') && (
          <button onClick={() => setTela('fabrica')}>Cadastro Fábrica</button>
        )}

        {(tipo === 'administrador' || tipo !== 'comum') && (
          <button onClick={() => setTela('porteiro')}>Cadastro Porteiro</button>
        )}

        <button onClick={() => setTela('relatorio')}>Relatório</button>

        {(tipo === 'administrador' || tipo === 'comum') && (
          <button onClick={() => setTela('entradaSaida')}>Entrada/Saída</button>
        )}

        <button onClick={sair}>Sair</button>
      </nav>

      {tela === 'portaria' && <Portaria />}
      {tela === 'relatorio' && <Relatorio />}
      {tela === 'fabrica' && (tipo === 'administrador' || tipo !== 'comum') && <Fabrica />}
      {tela === 'porteiro' && (tipo === 'administrador' || tipo !== 'comum') && <CadastroPorteiro />}
      {tela === 'entradaSaida' && (tipo === 'administrador' || tipo === 'comum') && <EntradaSaida />}
    </div>
  );
}
export default Index;