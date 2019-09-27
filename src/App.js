import React from 'react';
import './App.css';
import MainPage from './components/mainpage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MainPage/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
