import React from 'react';
import logo from './logo.svg';
import Sudoku from './Sudoku';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>react-sudoku</div>
      </header>

      <main className="App-main">
        <Sudoku />
      </main>
    </div>
  );
}

export default App;
