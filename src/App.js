import React from 'react';
import logo from './logo.svg';
import './App.css';
import Coords from './components/boxenv';

import {MainContext, DEFAULT_STATE} from "./components/provider";
class MainPage extends React.Component {
  state = DEFAULT_STATE;

  pause = () => {
    this.setState({paused: !this.state.paused});
  };
  render() {
    return (
            <MainContext.Provider value={this.state}>
              <Coords/>
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <button onClick={this.pause}/>
            </MainContext.Provider>
    );
  }
}

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
