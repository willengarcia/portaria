import React, { useState } from 'react';
import '../App.css'
import CadastroPorteiro from './body/cadastroPorteiro';
import EntradaSaida from './body/entradaSaida';
import Fabrica from './body/fabrica';
import Portaria from './body/portaria';
import Relatorio from './body/relatorio';
function Index() {
    const [tela, setTela] = useState('portaria');
      function sair() {
        window.location.reload();
      }
  return (
    <div className="index">
        <nav id="menuNav">
            <button onClick={() => setTela('portaria')}>Cadastro Portaria</button>
            <button onClick={() => setTela('fabrica')}>Cadastro Fábrica</button>
            <button onClick={() => setTela('porteiro')}>Cadastro Porteiro</button>
            <button onClick={() => setTela('relatorio')}>Relatório</button>
            <button onClick={() => setTela('entradaSaida')}>Entrada/Saída</button>
            <button onClick={sair}>Sair</button>
        </nav>
        {tela === 'porteiro' && <CadastroPorteiro />}
        {tela === 'portaria' && <Portaria />}
        {tela === 'fabrica' && <Fabrica />}
        {tela === 'relatorio' && <Relatorio />}
        {tela === 'entradaSaida' && <EntradaSaida />}
    </div>
  );
}

export default Index;