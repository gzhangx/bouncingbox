import React from 'react';
import logo from './logo.svg';
import './App.css';
import Anim from './components/graphworker';
class RunWorker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rotation: 0, startTime: performance.now() };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    requestAnimationFrame(this.tick);
  }

  tick() {
    const rotation = this.state.rotation + 0.04;
    console.log(this.state.startTime);
    console.log(`now= ${performance.now()}`);
    this.setState({ rotation, t: performance.now() - this.state.startTime });
    requestAnimationFrame(this.tick);
  }

  processor(context, props) {
    const {rotation, t} = props;
    //context.translate(100, 100);
    //context.rotate(rotation, 100, 100);
    context.fillStyle = "#F00";
    context.fillRect(-50, -50, 100, 100);
    context.font = "20px Georgia";
    context.fillText((t/1000).toFixed(1), 50,50);
  }
  render() {
    return <Anim t={this.state.t} rotation={this.state.rotation} width={200} height={200} processor={this.processor} />;
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RunWorker/>
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
