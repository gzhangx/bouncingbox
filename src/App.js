import React from 'react';
import logo from './logo.svg';
import './App.css';
import {RunWorker} from './components/graphworker';

function App() {

  function processor(context, props) {
    const {rotation, t, width, height} = props;
    context.fillStyle = "#F00";
    context.fillRect(0, 0, 100, 50);
    context.fillText((t/1000).toFixed(1), 100,10);
  }
  return (
    <div className="App">
      <header className="App-header">
        <RunWorker width={512} height={512} processor={processor}/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
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
