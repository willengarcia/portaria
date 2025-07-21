import './App.css';
import logo from './LOGO_COLORIDO.png';
import React, { useState } from 'react';
import Index from './main/index';
import Login from './main/login';

function App() {
  const [logado, setLogado] = useState(false);

  return (
    <div className="App">
      <header>
            <img src={logo} alt="Logo da Empresa" className="logo" />
            <h1>Sistema de Portaria</h1>
        </header>
      {!logado ? (

        <Login onLogin={() => setLogado(true)} />
      ) : (
        <Index />
      )}
    </div>
  );
}

export default App;